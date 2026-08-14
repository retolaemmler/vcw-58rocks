import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const APP_TAG = "vibe-code-workshop";

// Our Stripe account is shared with other apps. Only sessions carrying our own
// metadata tag are processed here.
async function resolveOurMetadata(session: Record<string, any>) {
  const direct = session.metadata ?? {};
  if (direct.app) return direct;

  // Payment Link sessions: fall back to the link's metadata.
  const linkId = typeof session.payment_link === "string"
    ? session.payment_link
    : session.payment_link?.id;
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!linkId || !key) return direct;

  const res = await fetch(`https://api.stripe.com/v1/payment_links/${linkId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.error("Failed to fetch payment link metadata:", await res.text());
    return direct;
  }
  const link = await res.json();
  return { ...(link.metadata ?? {}), ...direct };
}

async function verifyStripeSignature(payload: string, sigHeader: string, secret: string) {
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => p.split("=") as [string, string]),
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");

  // Constant-time-ish comparison
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return false;

  // Reject events older than 5 minutes
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  return age < 300;
}

function buildIcs() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vibe Code Workshop//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "DTSTART:20260915T150000Z",
    "DTEND:20260915T190000Z",
    "SUMMARY:Vibe Code Workshop - Build a Real Web App in One Evening",
    "DESCRIPTION:Evening hands-on masterclass. Build a real app using AI-powered tools.\\nMore details: https://vibecodeworkshop.ch",
    "LOCATION:Zurich\\, Switzerland (exact location TBD)",
    "STATUS:CONFIRMED",
    "UID:vibe-code-workshop-2026-09-15@vibecodeworkshop.ch",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function customerEmailHtml(displayName: string, amountFormatted: string) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, hsl(174, 72%, 40%), hsl(262, 80%, 55%)); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Vibe Code Workshop</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Build a Real Web App in One Evening</p>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 18px; color: hsl(220, 20%, 10%);">Dear ${displayName} 👋</p>
        <p style="color: hsl(220, 10%, 46%); line-height: 1.6;">
          Thank you for securing your spot! Your ticket for the Vibe Code Workshop has been confirmed.
        </p>
        <div style="background: hsl(210, 20%, 97%); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h2 style="font-size: 16px; color: hsl(220, 20%, 10%); margin: 0 0 12px;">Event Details</h2>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">📅 Tuesday, 15 September 2026 · 17:00 – 21:00</p>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">📍 Zurich, Switzerland (exact location TBD)</p>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">🍕 Pizza break included · free Lovable credits</p>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">💰 CHF ${amountFormatted} paid</p>
        </div>
        <p style="color: hsl(220, 10%, 46%); line-height: 1.6;">
          We'll send you more details as the event gets closer. See you there! 🚀
        </p>
      </div>
      <div style="background: hsl(210, 20%, 97%); padding: 20px 30px; text-align: center;">
        <p style="color: hsl(220, 10%, 46%); font-size: 12px; margin: 0;">Vibe Code Workshop · Zurich, Switzerland</p>
      </div>
    </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!WEBHOOK_SECRET || !sig || !(await verifyStripeSignature(payload, sig, WEBHOOK_SECRET))) {
    console.error("Invalid Stripe signature");
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const event = JSON.parse(payload);
  console.log("Received Stripe event:", event.type);

  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const session = event.data.object;
    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const customerEmail = session.customer_details?.email ?? session.customer_email;
    const fullName = session.customer_details?.name ?? null;
    const amountFormatted = ((session.amount_total ?? 0) / 100).toFixed(2);
    const displayName = fullName ? fullName.split(" ")[0] : "there";

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (existingOrder) {
      console.log("Order already recorded, skipping:", session.id);
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: dbError } = await supabase.from("orders").insert({
      stripe_session_id: session.id,
      customer_email: customerEmail,
      contact_name: fullName,
      amount_total: session.amount_total,
      currency: session.currency ?? "chf",
      status: "completed",
      edition: EDITION,
    });
    if (dbError) console.error("Database insert error:", dbError);

    if (RESEND_API_KEY && customerEmail) {
      const icsBase64 = btoa(String.fromCharCode(...new TextEncoder().encode(buildIcs())));

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Vibe Code Workshop <hello@vibecodeworkshop.ch>",
          to: [customerEmail],
          subject: "🎉 Your Vibe Code Workshop Ticket is Confirmed!",
          attachments: [{ filename: "vibe-code-workshop.ics", content: icsBase64, type: "text/calendar" }],
          html: customerEmailHtml(displayName, amountFormatted),
        }),
      });
      if (!emailRes.ok) console.error("Resend error (customer):", await emailRes.text());

      const notifyRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Vibe Code Workshop <hello@vibecodeworkshop.ch>",
          to: ["reto@58rocks.com", "valentin.binnendijk@pedalix.com"],
          subject: `🎟️ New Ticket Sold – ${customerEmail}`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>🎟️ New Ticket Sold</h2>
              <p><strong>Name:</strong> ${fullName ?? "N/A"}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Amount:</strong> CHF ${amountFormatted}</p>
              <p><strong>Edition:</strong> 15 September 2026</p>
            </div>`,
        }),
      });
      if (!notifyRes.ok) console.error("Resend error (organizer):", await notifyRes.text());
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook handler error:", e);
    return new Response(JSON.stringify({ error: "Handler error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
