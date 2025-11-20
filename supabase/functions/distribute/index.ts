// Distribute - Execute wine token payouts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  BASE_FEE,
  WINE_STATUS,
  corsHeaders,
  decryptSecret,
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

const PLATFORM_TREASURY = Deno.env.get("PLATFORM_TREASURY_PUBLIC_KEY")!;
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
      wineryPayoutPublicKey,
      reservePublicKey,
    } = await req.json();

    if (!issuerPublicKey || !tokenCode) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: issuerPublicKey, tokenCode",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!PLATFORM_TREASURY) {
      return new Response(
        JSON.stringify({ error: "Platform treasury not configured" }),
        {
          status: 500,
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

    if (wineLot.status !== WINE_STATUS.TOKENS_EMITTED) {
      if (wineLot.status === WINE_STATUS.DISTRIBUTED) {
        return new Response(
          JSON.stringify({
            error: "Distribution already completed",
            distributionTxHash: wineLot.distribution_tx_hash,
            distributedAt: wineLot.distributed_at,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(
        JSON.stringify({
          error: "Wine lot is not ready for distribution",
          currentStatus: wineLot.status,
          requiredStatus: WINE_STATUS.TOKENS_EMITTED,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: issuanceRows } = await supabase
      .from("wine_token_issuances")
      .select("*")
      .eq("wine_lot_id", wineLot.id)
      .order("created_at", { ascending: false })
      .limit(1);
    const issuance = issuanceRows?.[0];

    if (!issuance) {
      return new Response(
        JSON.stringify({ error: "No issuance record found for wine lot" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const Keypair = getStellarClass("Keypair");
    const Asset = getStellarClass("Asset");
    const TransactionBuilder = getStellarClass("TransactionBuilder");
    const Operation = getStellarClass("Operation");

    if (!Keypair || !Asset || !TransactionBuilder || !Operation) {
      throw new Error("Required Stellar SDK classes not found");
    }

    const distributionSecret = await decryptSecret(
      wineLot.distribution_secret_encrypted,
    );
    const distributionKeypair = Keypair.fromSecret(distributionSecret);
    const asset = new Asset(tokenCodeUpper, issuerPublicKey);

    const totalSupply = parseFloat(issuance.total_supply);
    if (!Number.isFinite(totalSupply) || totalSupply <= 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid total supply",
          message: `Total supply must be positive. Received: ${issuance.total_supply}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const platformFeeBps = wineLot.platform_fee_bps || 0;
    const reserveRatioBps = issuance.reserve_ratio_bps || 0;
    const platformAmount = (totalSupply * platformFeeBps) / 10000;
    const reserveAmount = (totalSupply * reserveRatioBps) / 10000;
    const wineryAmount = Math.max(totalSupply - platformAmount - reserveAmount, 0);

    const platformAmountStr = toAmountString(
      platformAmount,
      7,
      "platformAmount",
    );
    const reserveAmountStr = reserveAmount > 0
      ? toAmountString(reserveAmount, 7, "reserveAmount")
      : "0";
    const wineryAmountStr = wineryAmount > 0
      ? toAmountString(wineryAmount, 7, "wineryAmount")
      : "0";

    const distributionAccount = await server.loadAccount(
      distributionKeypair.publicKey(),
    );
    const distributionBalance = distributionAccount.balances.find(
      (b: any) =>
        b.asset_code === tokenCodeUpper && b.asset_issuer === issuerPublicKey,
    );

    if (!distributionBalance) {
      return new Response(
        JSON.stringify({
          error: "Distribution account missing token balance",
          message: "Ensure emission transaction completed successfully.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const availableBalance = parseFloat(distributionBalance.balance);
    if (availableBalance + 0.000001 < totalSupply) {
      return new Response(
        JSON.stringify({
          error: "Insufficient token balance",
          message: `Distribution account balance (${availableBalance}) is lower than expected total supply (${totalSupply}).`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const ensureTrustline = async (
      accountPublicKey: string,
      label: string,
      autoCreateSecretEnv?: string,
    ) => {
      const account = await server.loadAccount(accountPublicKey);
      const hasTrustline = account.balances.some(
        (b: any) =>
          b.asset_code === tokenCodeUpper && b.asset_issuer === issuerPublicKey,
      );
      if (hasTrustline) {
        return true;
      }
      if (!autoCreateSecretEnv) {
        throw new Error(
          `${label} account is missing trustline for ${tokenCodeUpper}.`,
        );
      }
      const secret = Deno.env.get(autoCreateSecretEnv);
      if (!secret) {
        throw new Error(
          `${label} account missing trustline and ${autoCreateSecretEnv} is not configured.`,
        );
      }
      const signer = Keypair.fromSecret(secret.trim());
      const trustlineTx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase,
      })
        .addOperation(
          Operation.changeTrust({
            asset,
            limit: issuance.total_supply,
          }),
        )
        .setTimeout(180)
        .build();
      trustlineTx.sign(signer);
      await server.submitTransaction(trustlineTx);
      return true;
    };

    await ensureTrustline(
      PLATFORM_TREASURY,
      "Platform treasury",
      "PLATFORM_TREASURY_SECRET_KEY",
    );

    if (reserveAmount > 0 && reservePublicKey) {
      await ensureTrustline(reservePublicKey, "Reserve");
    }

    if (wineryAmount > 0 && wineryPayoutPublicKey) {
      await ensureTrustline(wineryPayoutPublicKey, "Winery payout");
    }

    const transactionBuilder = new TransactionBuilder(distributionAccount, {
      fee: BASE_FEE,
      networkPassphrase,
    });

    if (parseFloat(platformAmountStr) > 0) {
      transactionBuilder.addOperation(
        Operation.payment({
          destination: PLATFORM_TREASURY,
          asset,
          amount: platformAmountStr,
        }),
      );
    }

    if (parseFloat(wineryAmountStr) > 0 && wineryPayoutPublicKey) {
      transactionBuilder.addOperation(
        Operation.payment({
          destination: wineryPayoutPublicKey,
          asset,
          amount: wineryAmountStr,
        }),
      );
    }

    if (parseFloat(reserveAmountStr) > 0 && reservePublicKey) {
      transactionBuilder.addOperation(
        Operation.payment({
          destination: reservePublicKey,
          asset,
          amount: reserveAmountStr,
        }),
      );
    }

    if (transactionBuilder.operations.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No distribution operations to execute",
          message:
            "At least one of platformAmount, wineryAmount, or reserveAmount must be greater than zero.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const transaction = transactionBuilder.setTimeout(180).build();
    transaction.sign(distributionKeypair);
    const result = await server.submitTransaction(transaction);

    await supabase
      .from("wine_lots")
      .update({
        status: WINE_STATUS.DISTRIBUTED,
        distribution_tx_hash: result.hash,
        distributed_at: nowIso(),
        updated_at: nowIso(),
      })
      .eq("id", wineLot.id);

    await supabase.from("wine_distributions").insert({
      wine_lot_id: wineLot.id,
      distribution_tx_hash: result.hash,
      winery_amount: wineryAmountStr,
      platform_amount: platformAmountStr,
      reserve_amount: reserveAmountStr,
      distribution_at: nowIso(),
    });

    const network = Deno.env.get("STELLAR_NETWORK") || "TESTNET";
    const explorerBase =
      network === "PUBLIC"
        ? "https://stellar.expert/explorer/public"
        : network === "FUTURENET"
          ? "https://stellar.expert/explorer/futurenet"
          : "https://stellar.expert/explorer/testnet";

    return new Response(
      JSON.stringify({
        success: true,
        distributionTxHash: result.hash,
        transactionUrl: `${explorerBase}/tx/${result.hash}`,
        wineLotId: wineLot.id,
        distributionAccount: distributionKeypair.publicKey(),
        allocations: {
          wineryAmount: wineryAmountStr,
          platformAmount: platformAmountStr,
          reserveAmount: reserveAmountStr,
          platformFeeBps,
          reserveRatioBps,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Distribution error:", error);
    const message =
      error instanceof Error ? error.message : "Distribution failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
