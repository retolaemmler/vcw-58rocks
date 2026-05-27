import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_DATES = new Set([
  "2026-05-28",
  "2026-06-11",
  "2026-06-23",
  "2026-06-30",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const action = typeof body.action === "string" ? body.action : "update";
    const datesInput = Array.isArray(body.preferred_dates) ? body.preferred_dates : [];
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const preferred_dates = datesInput.filter(
      (d: unknown) => typeof d === "string" && ALLOWED_DATES.has(d)
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Lookup-only: return existing signup info to prefill the form
    if (action === "lookup") {
      const { data: existing, error: lookupErr } = await supabase
        .from("newsletter_signups")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (lookupErr) {
        console.error("lookup error", lookupErr);
        return new Response(
          JSON.stringify({ error: "Lookup failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Only return a boolean to avoid leaking PII (name/company/dates) about
      // other people's signups to anonymous callers.
      return new Response(
        JSON.stringify({ found: !!existing }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find existing signup by email
    const { data: existing, error: lookupErr } = await supabase
      .from("newsletter_signups")
      .select("id, name, company")
      .eq("email", email)
      .maybeSingle();

    if (lookupErr) {
      console.error("lookup error", lookupErr);
      return new Response(
        JSON.stringify({ error: "Lookup failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existing) {
      const { error: updateErr } = await supabase
        .from("newsletter_signups")
        .update({
          preferred_dates: preferred_dates.length ? preferred_dates : null,
          name: name || existing.name,
          company: company || existing.company,
        })
        .eq("id", existing.id);

      if (updateErr) {
        console.error("update error", updateErr);
        return new Response(
          JSON.stringify({ error: "Update failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, found: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Not found — create a new signup so we capture their interest
    const { error: insertErr } = await supabase
      .from("newsletter_signups")
      .insert({
        email,
        name: name || null,
        company: company || null,
        preferred_dates: preferred_dates.length ? preferred_dates : null,
      });

    if (insertErr) {
      console.error("insert error", insertErr);
      return new Response(
        JSON.stringify({ error: "Insert failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, found: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("update-newsletter-dates error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});