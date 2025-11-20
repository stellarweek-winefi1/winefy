// Emission XDR - Generate unsigned XDR for wine token emission
// @ts-ignore - Deno runtime
import * as StellarSdk from "https://cdn.jsdelivr.net/npm/@stellar/stellar-sdk@14.2.0/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  BASE_FEE,
  WINE_STATUS,
  corsHeaders,
  ensureNumber,
  getStellarClass,
  getStellarNetwork,
  handleCORS,
  nowIso,
  toAmountString,
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
    const {
      issuerPublicKey,
      tokenCode,
      totalSupply,
      pricePerUnitUsd,
      reserveRatioBps = 0,
    } = await req.json();

    if (!issuerPublicKey || !tokenCode || !totalSupply || !pricePerUnitUsd) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: issuerPublicKey, tokenCode, totalSupply, pricePerUnitUsd",
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

    if (
      wineLot.status !== WINE_STATUS.TRUSTLINE_CREATED &&
      wineLot.status !== WINE_STATUS.CREATED &&
      wineLot.status !== WINE_STATUS.EMISSION_PENDING
    ) {
      return new Response(
        JSON.stringify({
          error: "Wine lot is not ready for emission.",
          currentStatus: wineLot.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const totalSupplyStr = toAmountString(totalSupply, 7, "totalSupply");
    const pricePerUnit = ensureNumber(pricePerUnitUsd, "pricePerUnitUsd", {
      min: 0.000001,
    });
    const reserveRatio = ensureNumber(reserveRatioBps, "reserveRatioBps", {
      min: 0,
    });

    const Asset = getStellarClass("Asset");
    const TransactionBuilder = getStellarClass("TransactionBuilder");
    const Operation = getStellarClass("Operation");

    if (!Asset || !TransactionBuilder || !Operation) {
      throw new Error("Required Stellar SDK classes not found");
    }

    const asset = new Asset(tokenCodeUpper, issuerPublicKey);
    const issuerAccount = await server.loadAccount(issuerPublicKey);

    const nativeBalance = issuerAccount.balances.find(
      (b: any) => b.asset_type === "native",
    );
    const balance = nativeBalance ? parseFloat(nativeBalance.balance) : 0;

    const operationsCount = 1;
    const transactionFee = (parseFloat(BASE_FEE) * operationsCount) / 10000000;
    const minRequiredBalance = transactionFee + 1;

    if (balance < minRequiredBalance) {
      return new Response(
        JSON.stringify({
          error: "Insufficient balance",
          message: `Issuer account requires ~${minRequiredBalance.toFixed(2)} XLM, has ${balance.toFixed(2)} XLM.`,
          currentBalance: balance,
          requiredBalance: minRequiredBalance,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const transactionBuilder = new TransactionBuilder(issuerAccount, {
      fee: BASE_FEE,
      networkPassphrase: networkPassphrase,
    }).addOperation(
      Operation.payment({
        destination: wineLot.distribution_public_key,
        asset: asset,
        amount: totalSupplyStr,
      }),
    );

    const transaction = transactionBuilder.setTimeout(300).build();
    const xdr = transaction.toXDR();

    const { data: existingIssuance } = await supabase
      .from("wine_token_issuances")
      .select("id")
      .eq("wine_lot_id", wineLot.id)
      .single();

    if (existingIssuance) {
      await supabase
        .from("wine_token_issuances")
        .update({
          total_supply: totalSupplyStr,
          price_per_unit_usd: pricePerUnit,
          reserve_ratio_bps: reserveRatio,
          emission_xdr: xdr,
          emission_tx_hash: null,
          issued_at: null,
          created_at: nowIso(),
        })
        .eq("id", existingIssuance.id);
    } else {
      await supabase.from("wine_token_issuances").insert({
        wine_lot_id: wineLot.id,
        total_supply: totalSupplyStr,
        price_per_unit_usd: pricePerUnit,
        reserve_ratio_bps: reserveRatio,
        emission_xdr: xdr,
      });
    }

    await supabase
      .from("wine_lots")
      .update({
        status: WINE_STATUS.EMISSION_PENDING,
        emission_tx_hash: null,
        updated_at: nowIso(),
      })
      .eq("id", wineLot.id);

    return new Response(
      JSON.stringify({
        success: true,
        xdr,
        wineLotId: wineLot.id,
        distributionAccount: wineLot.distribution_public_key,
        totalSupply: totalSupplyStr,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
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
