// Transfer Bottle - Transfers ownership of a bottle
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

Deno.serve(async (req) => {
  const corsResponse = handleCORS(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Authenticate user
    const authError = await requireAuthUser(req);
    if (authError) {
      return authError;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(
      req.headers.get("Authorization")?.replace("Bearer ", "") || "",
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json();
    const { bottleId, toAddress, description } = body;

    // Validation
    if (!bottleId || !toAddress) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: bottleId, toAddress",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Find bottle by bottle_id or UUID
    let bottle;
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

    if (!bottle) {
      return new Response(
        JSON.stringify({ error: "Bottle not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Verify current owner (should match authenticated user's wallet)
    // For now, we'll trust the auth token. In production, verify wallet address.
    const fromAddress = bottle.current_owner_address;

    // TODO: Invoke Transfer contract to transfer ownership on-chain
    // For now, we'll just update in DB. Contract integration will be added later.
    // const transferAddress = Deno.env.get("TRANSFER_ADDRESS");
    // if (transferAddress) {
    //   // Call Transfer.transfer contract method
    // }

    // Update bottle owner in database
    const { data: updatedBottle, error: updateError } = await supabase
      .from("bottles")
      .update({
        current_owner_address: toAddress,
        updated_at: nowIso(),
      })
      .eq("id", bottle.id)
      .select()
      .single();

    if (updateError || !updatedBottle) {
      console.error("Error updating bottle:", updateError);
      return new Response(
        JSON.stringify({
          error: "Error transferring bottle",
          details: updateError?.message || "Unknown error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Auto-log Shipped event
    await supabase
      .from("traceability_events")
      .insert({
        bottle_id: bottle.id,
        event_type: "shipped",
        actor_address: fromAddress,
        description: description || `Transferred from ${fromAddress} to ${toAddress}`,
        timestamp: nowIso(),
      });

    return new Response(
      JSON.stringify({
        success: true,
        bottle: {
          id: updatedBottle.id,
          bottleId: updatedBottle.bottle_id,
          previousOwner: fromAddress,
          newOwner: toAddress,
          transferredAt: updatedBottle.updated_at,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in transfer-bottle:", error);
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

