import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { prompt, type, ideaSummary } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (type === "ideas") {
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
              content: `You are an app idea generator for a Lovable workshop. Given a user's context or interest area, generate 3-5 creative and feasible app ideas that could be built using Lovable (a no-code/low-code AI web app builder). Each idea should be simple enough to prototype in a workshop setting (1-2 hours). Focus on practical, useful apps.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_ideas",
                description: "Return 3-5 app idea suggestions",
                parameters: {
                  type: "object",
                  properties: {
                    ideas: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string", description: "Short catchy app name" },
                          summary: { type: "string", description: "2-3 sentence description of the app" },
                          targetUser: { type: "string", description: "Who would use this app" },
                        },
                        required: ["title", "summary", "targetUser"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["ideas"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_ideas" } },
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      const ideas = JSON.parse(toolCall.function.arguments).ideas;

      return new Response(JSON.stringify({ ideas }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "expand") {
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
              content: `You are a prompt engineer helping workshop participants create detailed prompts for Lovable (an AI web app builder). Given an app idea summary, generate a comprehensive, copy-paste-ready prompt that a user can paste into Lovable to build the app. The prompt should include:
- Clear app description
- Key features (5-8 bullet points)
- UI/UX preferences (layout, colors, style)
- Data model hints
- User flow description

Keep it practical and achievable for a workshop prototype. Write the prompt in second person ("Build me an app that..."). Output only the prompt text, no extra commentary.`,
            },
            {
              role: "user",
              content: `Generate a detailed Lovable prompt for this app idea:\n\n${ideaSummary}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const expandedPrompt = data.choices?.[0]?.message?.content;

      return new Response(JSON.stringify({ prompt: expandedPrompt }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid type. Use 'ideas' or 'expand'." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-ideas error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
