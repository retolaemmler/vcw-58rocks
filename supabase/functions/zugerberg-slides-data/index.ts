import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KIND = "zugerberg_prep";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: token } = await supabase
      .from("survey_tokens").select("id").eq("kind", KIND).limit(1).maybeSingle();

    if (!token) {
      return new Response(JSON.stringify({ rows: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only anonymized, aggregate-relevant fields — no email / name.
    const { data, error } = await supabase
      .from("survey_responses")
      .select(
        "id, created_at, attendance_day, ai_coding_experience, lovable_experience, workshop_goals, success_criteria, has_app_idea, app_idea_description, app_audience, building_blocks",
      )
      .eq("token_id", token.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify({ rows: data ?? [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
