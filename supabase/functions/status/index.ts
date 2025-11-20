// Status - Check token creation status
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCORS } from "../_shared/utils.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const url = new URL(req.url);
    const tokenCode = url.searchParams.get("code");
    const issuer = url.searchParams.get("issuer");

    if (!tokenCode || !issuer) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: code and issuer",
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
      .eq("issuer_public_key", issuer)
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
      console.error("Issuance query error:", issuanceError);
    }

    const issuance = issuanceRows?.[0] || null;

    const { data: distributionRows, error: distributionError } = await supabase
      .from("wine_distributions")
      .select("*")
      .eq("wine_lot_id", wineLot.id)
      .order("distribution_at", { ascending: false })
      .limit(1);

    if (distributionError) {
      console.error("Distribution query error:", distributionError);
    }

    const distribution = distributionRows?.[0] || null;

    return new Response(
      JSON.stringify({
        status: wineLot.status,
        tokenCode: wineLot.token_code,
        wineryName: wineLot.winery_name,
        region: wineLot.region,
        country: wineLot.country,
        vintage: wineLot.vintage,
        bottleCount: wineLot.bottle_count,
        bottleFormatMl: wineLot.bottle_format_ml,
        pricePerBottleUsd: wineLot.price_per_bottle_usd,
        platformFeeBps: wineLot.platform_fee_bps,
        documentationUrls: wineLot.documentation_urls || [],
        metadata: wineLot.token_metadata || {},
        distributionAccount: wineLot.distribution_public_key,
        trustlineTxHash: wineLot.trustline_tx_hash,
        emissionTxHash: wineLot.emission_tx_hash || issuance?.emission_tx_hash,
        distributionTxHash:
          wineLot.distribution_tx_hash || distribution?.distribution_tx_hash,
        createdAt: wineLot.created_at,
        updatedAt: wineLot.updated_at,
        emittedAt: wineLot.emitted_at || issuance?.issued_at,
        distributedAt: wineLot.distributed_at || distribution?.distribution_at,
        latestIssuance: issuance
          ? {
            totalSupply: issuance.total_supply,
            pricePerUnitUsd: issuance.price_per_unit_usd,
            reserveRatioBps: issuance.reserve_ratio_bps,
            emissionTxHash: issuance.emission_tx_hash,
            issuedAt: issuance.issued_at,
          }
          : null,
        latestDistribution: distribution
          ? {
            platformAmount: distribution.platform_amount,
            wineryAmount: distribution.winery_amount,
            reserveAmount: distribution.reserve_amount,
            txHash: distribution.distribution_tx_hash,
            distributionAt: distribution.distribution_at,
          }
          : null,
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
