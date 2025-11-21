// Get Bottle Traceability - Retrieves bottle data and full event history (for QR scanner)
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
    const bottleId = url.searchParams.get("bottleId");
    const qrCode = url.searchParams.get("qrCode");

    if (!bottleId && !qrCode) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameter: bottleId or qrCode",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let bottle;

    // Query by QR code first if provided
    if (qrCode) {
      const { data: qrMapping } = await supabase
        .from("qr_code_mapping")
        .select("bottle_id")
        .eq("qr_code", qrCode)
        .single();

      if (!qrMapping) {
        return new Response(
          JSON.stringify({ error: "QR code not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const { data: bottleData } = await supabase
        .from("bottles")
        .select("*")
        .eq("id", qrMapping.bottle_id)
        .single();
      bottle = bottleData;
    } else if (bottleId) {
      // Query by bottle_id or UUID
      if (bottleId.length === 36 && bottleId.includes("-")) {
        // Likely a UUID
        const { data: bottleData } = await supabase
          .from("bottles")
          .select("*")
          .eq("id", bottleId)
          .single();
        bottle = bottleData;
      } else {
        // Likely a bottle_id string
        const { data: bottleData } = await supabase
          .from("bottles")
          .select("*")
          .eq("bottle_id", bottleId)
          .single();
        bottle = bottleData;
      }
    }

    if (!bottle) {
      return new Response(
        JSON.stringify({ error: "Bottle not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get full event history
    const { data: events, error: eventsError } = await supabase
      .from("traceability_events")
      .select("*")
      .eq("bottle_id", bottle.id)
      .order("timestamp", { ascending: true });

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
    }

    // Optionally log a Scanned event if qrCode was used
    if (qrCode) {
      // Don't await - fire and forget for better performance
      supabase
        .from("traceability_events")
        .insert({
          bottle_id: bottle.id,
          event_type: "scanned",
          actor_address: "anonymous", // QR scanner doesn't have authenticated user
          description: "Bottle scanned via QR code",
          timestamp: new Date().toISOString(),
        })
        .catch((err) => console.error("Error logging scanned event:", err));
    }

    return new Response(
      JSON.stringify({
        success: true,
        bottle: {
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
        },
        events: (events || []).map((event) => ({
          id: event.id,
          eventType: event.event_type,
          actorAddress: event.actor_address,
          description: event.description,
          timestamp: event.timestamp,
          onChainTxHash: event.on_chain_tx_hash,
        })),
        eventCount: events?.length || 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in get-bottle-traceability:", error);
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

