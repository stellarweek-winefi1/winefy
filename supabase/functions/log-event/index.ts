// Log Event - Records a traceability event for a bottle
// @ts-ignore - Deno runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  corsHeaders,
  handleCORS,
  nowIso,
} from "../_shared/utils.ts";
import { requireAuthUser } from "../_shared/auth.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const EVENT_TYPES = ["bottling", "shipped", "received", "scanned"] as const;

Deno.serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Authenticate user (optional for scanned events, required for others)
    const body = await req.json();
    const { bottleId, eventType, actorAddress, description, skipAuth } = body;

    // Validation
    if (!bottleId || !eventType || !actorAddress) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: bottleId, eventType, actorAddress",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!EVENT_TYPES.includes(eventType)) {
      return new Response(
        JSON.stringify({
          error: `Invalid eventType. Must be one of: ${EVENT_TYPES.join(", ")}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Require auth for non-scanned events
    if (!skipAuth && eventType !== "scanned") {
      const authError = await requireAuthUser(req);
      if (authError) {
        return authError;
      }
    }

    // Find bottle by bottle_id or UUID
    let bottle;
    if (bottleId.length === 36 && bottleId.includes("-")) {
      // Likely a UUID
      const { data: bottleData } = await supabase
        .from("bottles")
        .select("id, bottle_id")
        .eq("id", bottleId)
        .single();
      bottle = bottleData;
    } else {
      // Likely a bottle_id string (e.g., "MALBEC-2024-001-0001")
      const { data: bottleData } = await supabase
        .from("bottles")
        .select("id, bottle_id")
        .eq("bottle_id", bottleId)
        .single();
      bottle = bottleData;
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

    // TODO: Invoke TraceabilityLog contract to log event on-chain
    // For now, we'll just store in DB. Contract integration will be added later.
    // const traceabilityLogAddress = Deno.env.get("TRACEABILITY_LOG_ADDRESS");
    // if (traceabilityLogAddress) {
    //   // Call TraceabilityLog.log_event contract method
    // }

    // Store event in database
    const { data: event, error: insertError } = await supabase
      .from("traceability_events")
      .insert({
        bottle_id: bottle.id,
        event_type: eventType,
        actor_address: actorAddress,
        description: description || null,
        timestamp: nowIso(),
      })
      .select()
      .single();

    if (insertError || !event) {
      console.error("Error inserting event:", insertError);
      return new Response(
        JSON.stringify({
          error: "Error logging event",
          details: insertError?.message || "Unknown error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // For Received events, update bottle owner if needed
    if (eventType === "received") {
      await supabase
        .from("bottles")
        .update({ current_owner_address: actorAddress })
        .eq("id", bottle.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        event: {
          id: event.id,
          bottleId: bottle.bottle_id,
          eventType: event.event_type,
          actorAddress: event.actor_address,
          description: event.description,
          timestamp: event.timestamp,
        },
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in log-event:", error);
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

