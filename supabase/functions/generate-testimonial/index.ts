import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const normalized = email.trim().toLowerCase();

    const [orderRes, surveyRes] = await Promise.all([
      supabase
        .from("orders")
        .select("app_built, customer_name, contact_name")
        .ilike("customer_email", normalized)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("survey_responses")
        .select("participant_name, app_idea_description, app_audience, workshop_goals, success_criteria, lovable_experience, ai_coding_experience, building_blocks")
        .ilike("email", normalized)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const order = orderRes.data;
    const survey = surveyRes.data;
    if (orderRes.error) console.error("Order lookup error:", orderRes.error);
    if (surveyRes.error) console.error("Survey lookup error:", surveyRes.error);

    // Strip URLs from a string so we never echo a link in the testimonial
    const stripUrls = (s?: string | null) =>
      (s || "")
        .replace(/https?:\/\/\S+/gi, "")
        .replace(/www\.\S+/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();

    const appBuilt = stripUrls(order?.app_built);
    const appIdea = stripUrls(survey?.app_idea_description);
    const audience = stripUrls(survey?.app_audience);
    const goals = stripUrls(survey?.workshop_goals);
    const success = stripUrls(survey?.success_criteria);
    const lovableExp = survey?.lovable_experience?.trim();
    const aiExp = survey?.ai_coding_experience?.trim();

    const contextParts: string[] = [];
    if (appBuilt) contextParts.push(`At the workshop they built: "${appBuilt}".`);
    if (appIdea) contextParts.push(`Their original app idea going in: "${appIdea}".`);
    if (audience) contextParts.push(`Intended audience: ${audience}.`);
    if (goals) contextParts.push(`Their workshop goals: ${goals}.`);
    if (success) contextParts.push(`What success looked like for them: ${success}.`);
    if (lovableExp) contextParts.push(`Prior Lovable experience: ${lovableExp}.`);
    if (aiExp) contextParts.push(`Prior AI coding experience: ${aiExp}.`);

    const hasAnyContext = contextParts.length > 0;
    const userContext = hasAnyContext
      ? contextParts.join(" ")
      : `No specific information was found for this participant. Write a generic but exciting first-person testimonial about spending one day at the Vibe Code Workshop building a real web app with Lovable — capture the "I can't believe I actually built this in a single day" feeling, without inventing specific app details.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You write short, authentic, first-person testimonials for the "Vibe Code Workshop" — a one-day workshop where people build a real web app using Lovable.

Rules:
- 1-2 sentences max, around 20-40 words.
- Sound natural and human, NOT marketing-fluffy. No clichés like "game-changer", "next-level", "blown away".
- Refer to the workshop as "in a day" or "in one day" — NEVER say "in an afternoon", "in a morning", or "in a few hours".
- When mentioning the tool/platform used, refer to it as "Lovable" — do NOT say "AI tools", "no-code tools", or other generic phrases.
- You may use the provided context (app built, idea, audience, goals, experience) as inspiration, but NEVER include URLs, links, domains, or web addresses in the output.
- Mention what the person built only if it makes the testimonial more concrete and human.
- If no specific context is provided, write a generic but exciting testimonial that captures the surprise of building something real in a single day with Lovable. Do NOT invent fake app names or fake specifics — keep it about the experience.
- First person ("I built...", "I came in...").
- No quotes around the output. No name signature. No emojis.
- Vary tone slightly each time — sometimes reflective, sometimes punchy, sometimes practical.`,
          },
          {
            role: "user",
            content: `Write a short testimonial. Context about the participant (use as inspiration only, do not quote URLs): ${userContext}`,
          },
        ],
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    let testimonial: string = data.choices?.[0]?.message?.content?.trim() || "";
    // Strip surrounding quotes if model added them
    testimonial = testimonial.replace(/^["“”']+|["“”']+$/g, "").trim();
    // Final safety net: remove any URLs/domains the model might have included
    testimonial = testimonial
      .replace(/https?:\/\/\S+/gi, "")
      .replace(/www\.\S+/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    return new Response(
      JSON.stringify({ testimonial, appBuilt: appBuilt || null, foundOrder: !!order, foundSurvey: !!survey }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-testimonial error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
