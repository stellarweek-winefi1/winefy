// Submit Signed - Submit signed emission transaction to Stellar
// @ts-ignore - Deno runtime
import * as StellarSdk from "https://cdn.jsdelivr.net/npm/@stellar/stellar-sdk@14.2.0/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  WINE_STATUS,
  corsHeaders,
  getStellarClass,
  getStellarNetwork,
  handleCORS,
  nowIso,
} from "../_shared/utils.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const { server, networkPassphrase } = getStellarNetwork();

Deno.serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const { signedXDR, tokenCode, issuerPublicKey } = await req.json();

    if (!signedXDR || !tokenCode || !issuerPublicKey) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: signedXDR, tokenCode, issuerPublicKey",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const tokenCodeUpper = tokenCode.toUpperCase();

    const { data: wineLot, error: lotError } = await supabase
      .from("wine_lots")
      .select("*")
      .eq("token_code", tokenCodeUpper)
      .eq("issuer_public_key", issuerPublicKey)
      .single();

    if (lotError || !wineLot) {
      return new Response(JSON.stringify({ error: "Wine lot not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: issuanceRows, error: issuanceError } = await supabase
      .from("wine_token_issuances")
      .select("*")
      .eq("wine_lot_id", wineLot.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (issuanceError) {
      console.error("Issuance fetch error:", issuanceError);
    }

    const issuance = issuanceRows?.[0];

    if (!issuance) {
      return new Response(
        JSON.stringify({ error: "No pending issuance found for wine lot" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    try {
      const TransactionBuilder = getStellarClass("TransactionBuilder");
      if (!TransactionBuilder) {
        throw new Error("TransactionBuilder class not found in Stellar SDK");
      }

      const transaction = TransactionBuilder.fromXDR(
        signedXDR,
        networkPassphrase,
      );

      const result = await server.submitTransaction(transaction as any);

      await supabase
        .from("wine_lots")
        .update({
          status: WINE_STATUS.TOKENS_EMITTED,
          emission_tx_hash: result.hash,
          emitted_at: nowIso(),
          updated_at: nowIso(),
        })
        .eq("id", wineLot.id);

      await supabase
        .from("wine_token_issuances")
        .update({
          emission_tx_hash: result.hash,
          issued_at: nowIso(),
        })
        .eq("id", issuance.id);

      return new Response(
        JSON.stringify({
          success: true,
          txHash: result.hash,
          wineLotId: wineLot.id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } catch (stellarError: any) {
      console.error("Stellar transaction error:", stellarError);

      let errorMessage = "Transaction submission failed";
      let errorDetails: any = {};

      if (stellarError.response) {
        const errorData = stellarError.response.data;
        if (errorData?.extras?.result_codes) {
          const resultCodes = errorData.extras.result_codes;
          const transactionCode = resultCodes.transaction;
          const operationCodes = resultCodes.operations || [];

          errorDetails = {
            transactionCode,
            operationCodes,
            fullResultCodes: resultCodes,
          };

          const errorMessages: Record<string, string> = {
            tx_failed: "Transaction failed",
            tx_insufficient_fee: "Insufficient transaction fee",
            tx_too_early: "Transaction submitted too early",
            tx_too_late: "Transaction expired",
            tx_missing_operation: "Transaction missing operations",
            tx_bad_auth: "Transaction authentication failed",
            tx_bad_auth_extra: "Transaction has extra signatures",
            op_underfunded: "Account has insufficient balance",
            op_low_reserve: "Account minimum reserve not met",
            op_line_full: "Trustline limit reached",
            op_no_trust: "Destination has no trustline",
            op_not_authorized: "Operation not authorized",
            op_no_issuer: "Issuer account does not exist",
            op_success: "Operation succeeded",
          };

          const messages: string[] = [];
          if (transactionCode) {
            messages.push(
              `Transaction: ${errorMessages[transactionCode] || transactionCode}`,
            );
          }

          operationCodes.forEach((opCode: string, index: number) => {
            messages.push(
              `Operation ${index + 1}: ${errorMessages[opCode] || opCode}`,
            );
          });

          errorMessage =
            messages.join(". ") || "Transaction failed on Stellar network";
        } else if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else if (errorData?.title) {
          errorMessage = errorData.title;
        }
      } else if (stellarError.message) {
        errorMessage = stellarError.message;
      }

      return new Response(
        JSON.stringify({
          error: errorMessage,
          details: errorDetails,
          stellarError: stellarError.response?.data || stellarError.message,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
