import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Require admin authentication for all actions on this endpoint.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: adminCheck } = await supabase
      .from("admin_allowed_emails")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();
    if (!adminCheck) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle token creation (admin action)
    if (body.action === "create-token") {
      const kind = typeof body.kind === "string" && body.kind.length > 0 ? body.kind : "prep";

      // Check if token exists for this kind
      const { data: existing } = await supabase
        .from("survey_tokens")
        .select("token")
        .eq("kind", kind)
        .limit(1)
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ token: existing.token }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: newToken, error } = await supabase
        .from("survey_tokens")
        .insert({ kind })
        .select("token")
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ token: newToken.token }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default: validate email against orders
    const { email } = body;

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ valid: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data } = await supabase
      .from("orders")
      .select("id")
      .eq("customer_email", email.trim().toLowerCase())
      .limit(1)
      .maybeSingle();

    return new Response(
      JSON.stringify({ valid: !!data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("validate-survey-email error:", err);
    return new Response(
      JSON.stringify({ valid: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
