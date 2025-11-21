// List Bottles - Lists bottles by lot_id or winery
// @ts-ignore - Deno runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  corsHeaders,
  handleCORS,
} from "../_shared/utils.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const url = new URL(req.url);
    const lotId = url.searchParams.get("lotId");
    const wineryAddress = url.searchParams.get("wineryAddress");
    const currentOwnerAddress = url.searchParams.get("currentOwnerAddress");
    const limit = parseInt(url.searchParams.get("limit") || "100", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    let query = supabase
      .from("bottles")
      .select("*", { count: "exact" });

    // Apply filters
    if (lotId) {
      query = query.eq("lot_id", lotId);
    }
    if (wineryAddress) {
      query = query.eq("winery_address", wineryAddress);
    }
    if (currentOwnerAddress) {
      query = query.eq("current_owner_address", currentOwnerAddress);
    }

    // Order by creation date (newest first)
    query = query.order("created_at", { ascending: false });

    // Apply pagination
    const { data: bottles, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching bottles:", error);
      return new Response(
        JSON.stringify({
          error: "Error fetching bottles",
          details: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // For each bottle, get the latest event
    const bottlesWithEvents = await Promise.all(
      (bottles || []).map(async (bottle) => {
        const { data: latestEvent } = await supabase
          .from("traceability_events")
          .select("event_type, timestamp")
          .eq("bottle_id", bottle.id)
          .order("timestamp", { ascending: false })
          .limit(1)
          .single();

        return {
          id: bottle.id,
          bottleId: bottle.bottle_id,
          lotId: bottle.lot_id,
          bottleNumber: bottle.bottle_number,
          wineryAddress: bottle.winery_address,
          currentOwnerAddress: bottle.current_owner_address,
          wineName: bottle.wine_name,
          vintage: bottle.vintage,
          region: bottle.region,
          country: bottle.country,
          metadataUri: bottle.metadata_uri,
          qrCode: bottle.qr_code,
          stellarTokenAddress: bottle.stellar_token_address,
          createdAt: bottle.created_at,
          updatedAt: bottle.updated_at,
          latestEventType: latestEvent?.event_type || null,
          latestEventTimestamp: latestEvent?.timestamp || null,
        };
      }),
    );

    return new Response(
      JSON.stringify({
        success: true,
        bottles: bottlesWithEvents,
        count: count || 0,
        limit,
        offset,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in list-bottles:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

