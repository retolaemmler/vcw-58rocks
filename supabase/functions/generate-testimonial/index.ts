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
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("app_built, customer_name, contact_name")
      .ilike("customer_email", normalized)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderErr) {
      console.error("Order lookup error:", orderErr);
    }

    const appBuilt = order?.app_built?.trim();
    const userContext = appBuilt
      ? `The participant built the following app at the workshop: "${appBuilt}".`
      : `The participant attended the Vibe Code Workshop and enjoyed the experience.`;

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
            content: `You write short, authentic, first-person testimonials for the "Vibe Code Workshop" — a one-day workshop where people build a real web app using AI tools like Lovable.

Rules:
- 1-2 sentences max, around 20-40 words.
- Sound natural and human, NOT marketing-fluffy. No clichés like "game-changer", "next-level", "blown away".
- Mention what the person built if context is provided.
- First person ("I built...", "I came in...").
- No quotes around the output. No name signature. No emojis.
- Vary tone slightly each time — sometimes reflective, sometimes punchy, sometimes practical.`,
          },
          {
            role: "user",
            content: `Write a short testimonial. ${userContext}`,
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

    return new Response(
      JSON.stringify({ testimonial, appBuilt: appBuilt || null, foundOrder: !!order }),
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
