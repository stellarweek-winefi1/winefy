// Prepare Token - Creates distribution account and trustline for a wine lot
// @ts-ignore - Deno runtime
import * as StellarSdk from "https://cdn.jsdelivr.net/npm/@stellar/stellar-sdk@14.2.0/+esm";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  BASE_FEE,
  WINE_STATUS,
  corsHeaders,
  deriveTokenSupply,
  encryptSecret,
  ensureNumber,
  ensurePositiveInteger,
  fundDistributionAccount,
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
const { server, networkPassphrase, network } = getStellarNetwork();

Deno.serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    let requestBody: Record<string, unknown>;
    try {
      requestBody = await req.json();
      console.log(
        "Received wine lot payload:",
        JSON.stringify(requestBody, null, 2),
      );
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          details:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const {
      issuerPublicKey,
      tokenCode,
      wineName,
      wineryName,
      region,
      country,
      appellation,
      vineyard,
      vintage,
      bottleFormatMl = 750,
      bottleCount,
      pricePerBottleUsd,
      sku,
      custodialPartner,
      storageLocation,
      insurancePolicy,
      documentationUrls,
      platformFeeBps,
      unitsPerBottle = 1,
      totalTokenUnits,
      description,
      metadata,
    } = requestBody as Record<string, unknown>;

    const missingFields: string[] = [];
    if (!issuerPublicKey) missingFields.push("issuerPublicKey");
    if (!tokenCode) missingFields.push("tokenCode");
    if (!wineryName && !wineName) missingFields.push("wineryName");
    if (!region) missingFields.push("region");
    if (!country) missingFields.push("country");
    if (!vintage) missingFields.push("vintage");
    if (!bottleCount) missingFields.push("bottleCount");
    if (!pricePerBottleUsd) missingFields.push("pricePerBottleUsd");

    if (missingFields.length > 0) {
      const errorMessage =
        `Missing required fields: ${missingFields.join(", ")}.`;
      console.error(errorMessage);
      return new Response(
        JSON.stringify({
          error: errorMessage,
          received: requestBody,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const tokenCodeUpper = String(tokenCode || "").toUpperCase();
    if (!/^[A-Z0-9]{1,12}$/.test(tokenCodeUpper)) {
      return new Response(
        JSON.stringify({
          error: "Token code must be 1-12 alphanumeric characters",
          received: tokenCode,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    try {
      await server.loadAccount(String(issuerPublicKey));
      console.log(`Issuer account verified: ${issuerPublicKey}`);
    } catch (accountError) {
      console.error(`Issuer account load error:`, accountError);
      const errorMessage =
        accountError instanceof Error
          ? accountError.message
          : String(accountError);
      return new Response(
        JSON.stringify({
          error: "Issuer account does not exist on Stellar network",
          details: errorMessage,
          issuerPublicKey,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: existingLot } = await supabase
      .from("wine_lots")
      .select("id")
      .eq("token_code", tokenCodeUpper)
      .eq("issuer_public_key", issuerPublicKey)
      .single();

    if (existingLot) {
      return new Response(
        JSON.stringify({
          error: "Wine lot with this code already exists for this issuer",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const bottleCountInt = ensurePositiveInteger(bottleCount, "bottleCount");
    const pricePerBottle = ensureNumber(
      pricePerBottleUsd,
      "pricePerBottleUsd",
      { min: 0.01 },
    );
    const unitsPerBottleNumber = ensureNumber(
      unitsPerBottle,
      "unitsPerBottle",
      { min: 0.0000001 },
    );
    const totalSupplyValue = typeof totalTokenUnits !== "undefined" &&
        totalTokenUnits !== null
      ? ensureNumber(totalTokenUnits, "totalTokenUnits", { min: 0.0000001 })
      : parseFloat(deriveTokenSupply(bottleCountInt, unitsPerBottleNumber));
    const totalSupplyStr = toAmountString(
      totalSupplyValue,
      7,
      "totalTokenSupply",
    );
    const docsArray = Array.isArray(documentationUrls)
      ? documentationUrls
      : documentationUrls
        ? [documentationUrls]
        : [];

    const Keypair = getStellarClass("Keypair");
    if (!Keypair) {
      throw new Error("Keypair class not found in Stellar SDK");
    }
    const distributionKeypair = Keypair.random();
    const secretKey = await encryptSecret(distributionKeypair.secret());

    const insertPayload = {
      winery_name: wineryName || wineName,
      region,
      country,
      appellation: appellation || null,
      vineyard: vineyard || null,
      vintage: ensurePositiveInteger(vintage, "vintage"),
      bottle_format_ml: ensurePositiveInteger(
        bottleFormatMl || 750,
        "bottleFormatMl",
      ),
      bottle_count: bottleCountInt,
      sku: sku || null,
      custodial_partner: custodialPartner || null,
      storage_location: storageLocation || null,
      insurance_policy: insurancePolicy || null,
      documentation_urls: docsArray,
      price_per_bottle_usd: pricePerBottle,
      token_code: tokenCodeUpper,
      issuer_public_key: issuerPublicKey,
      distribution_public_key: distributionKeypair.publicKey(),
      distribution_secret_encrypted: secretKey,
      platform_fee_bps: platformFeeBps || 1000,
      status: WINE_STATUS.CREATED,
      description: description || null,
      token_metadata: {
        ...(metadata as Record<string, unknown> | undefined),
        unitsPerBottle: unitsPerBottleNumber,
        totalTokenSupply: totalSupplyStr,
      },
    };

    const { data, error } = await supabase
      .from("wine_lots")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("DB Error:", error);
      return new Response(
        JSON.stringify({
          error: "Error saving wine lot to database",
          details: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    try {
      await fundDistributionAccount(
        distributionKeypair.publicKey(),
        server,
        networkPassphrase,
        network,
      );
      console.log("Distribution account funded successfully");
    } catch (fundingError) {
      console.error("Funding error:", fundingError);
      if (network === "PUBLIC") {
        return new Response(
          JSON.stringify({
            error: "Account funding failed",
            details:
              fundingError instanceof Error
                ? fundingError.message
                : String(fundingError),
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw fundingError;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const Asset = getStellarClass("Asset");
      const TransactionBuilder = getStellarClass("TransactionBuilder");
      const Operation = getStellarClass("Operation");

      if (!Asset || !TransactionBuilder || !Operation) {
        throw new Error("Required Stellar SDK classes not found");
      }

      const asset = new Asset(tokenCodeUpper, issuerPublicKey);

      let distributionAccount;
      let retries = 5;
      while (retries > 0) {
        try {
          distributionAccount = await server.loadAccount(
            distributionKeypair.publicKey(),
          );
          break;
        } catch (loadError) {
          retries--;
          if (retries === 0) {
            throw loadError;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      if (!distributionAccount) {
        throw new Error(
          `Distribution account not found after funding. Public key: ${distributionKeypair.publicKey()}. Network: ${network}`,
        );
      }

      const transaction = new TransactionBuilder(distributionAccount, {
        fee: BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.changeTrust({
            asset: asset,
            limit: totalSupplyStr,
          }),
        )
        .setTimeout(180)
        .build();

      transaction.sign(distributionKeypair);
      const result = await server.submitTransaction(transaction);

      await supabase
        .from("wine_lots")
        .update({
          status: WINE_STATUS.TRUSTLINE_CREATED,
          trustline_tx_hash: result.hash,
          updated_at: nowIso(),
        })
        .eq("id", data.id);

      return new Response(
        JSON.stringify({
          success: true,
          distributionAccount: distributionKeypair.publicKey(),
          wineLotId: data.id,
          trustlineTxHash: result.hash,
          totalTokenSupply: totalSupplyStr,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } catch (trustlineError) {
      console.error("Trustline creation error:", trustlineError);
      await supabase
        .from("wine_lots")
        .update({
          status: WINE_STATUS.CREATED,
          updated_at: nowIso(),
        })
        .eq("id", data.id);

      return new Response(
        JSON.stringify({
          success: true,
          distributionAccount: distributionKeypair.publicKey(),
          wineLotId: data.id,
          warning:
            "Wine lot created but trustline creation failed. It can be retried later.",
        }),
        {
          status: 200,
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
