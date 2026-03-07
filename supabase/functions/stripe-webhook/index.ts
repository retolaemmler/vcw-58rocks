import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Verify Stripe signature using Web Crypto API
    const encoder = new TextEncoder();
    const parts = signature?.split(",") ?? [];
    const timestamp = parts.find((p) => p.startsWith("t="))?.split("=")[1];
    const sig = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

    if (!timestamp || !sig) {
      throw new Error("Invalid Stripe signature format");
    }

    const signedPayload = `${timestamp}.${body}`;
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(STRIPE_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedPayload)
    );
    const expectedSig = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSig !== sig) {
      console.error("Signature mismatch");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Save order to database
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { error: dbError } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email ?? session.customer_email,
        customer_name: session.customer_details?.name ?? null,
        amount_total: session.amount_total,
        currency: session.currency ?? "chf",
        status: "completed",
      });

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw new Error(`Failed to save order: ${dbError.message}`);
      }

      // Send confirmation email via Resend
      const customerEmail = session.customer_details?.email ?? session.customer_email;
      const customerName = session.customer_details?.name ?? "there";
      const amountFormatted = (session.amount_total / 100).toFixed(2);

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Vibe Code Workshop <onboarding@resend.dev>",
          to: [customerEmail],
          subject: "🎉 Your Vibe Code Workshop Ticket is Confirmed!",
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, hsl(174, 72%, 40%), hsl(262, 80%, 55%)); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Vibe Code Workshop</h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Build a Real App in One Day</p>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 18px; color: hsl(220, 20%, 10%);">Hey ${customerName}! 👋</p>
                <p style="color: hsl(220, 10%, 46%); line-height: 1.6;">
                  Thank you for securing your spot! Your ticket for the Vibe Code Workshop has been confirmed.
                </p>
                <div style="background: hsl(210, 20%, 97%); border-radius: 12px; padding: 20px; margin: 24px 0;">
                  <h2 style="font-size: 16px; color: hsl(220, 20%, 10%); margin: 0 0 12px;">Event Details</h2>
                  <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">📅 Thursday, 16 April 2026 · 9:00 – 17:00</p>
                  <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">📍 Zurich, Switzerland (exact location TBD)</p>
                  <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">💰 CHF ${amountFormatted} paid</p>
                </div>
                <p style="color: hsl(220, 10%, 46%); line-height: 1.6;">
                  If the min. of 10 participants is not reached, the money will be refunded to you.
                </p>
                <p style="color: hsl(220, 10%, 46%); line-height: 1.6;">
                  We'll send you more details as the event gets closer. See you there! 🚀
                </p>
              </div>
              <div style="background: hsl(210, 20%, 97%); padding: 20px 30px; text-align: center;">
                <p style="color: hsl(220, 10%, 46%); font-size: 12px; margin: 0;">Vibe Code Workshop · Zurich, Switzerland</p>
              </div>
            </div>
          `,
        }),
      });

      if (!emailRes.ok) {
        const emailError = await emailRes.text();
        console.error("Resend API error:", emailError);
        // Don't throw - order is saved, email failure is non-critical
      }

      console.log(`Order saved and email sent for session ${session.id}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
