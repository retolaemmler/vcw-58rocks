import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendTicketEmails, CALENDAR_BUCKET, CALENDAR_PATH } from "../_shared/ticket-emails.ts";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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

    const metadata = await resolveOurMetadata(session);
    if (metadata.app !== APP_TAG) {
      console.log("Ignoring session from another app:", session.id, metadata.app ?? "(no app tag)");
      return new Response(JSON.stringify({ received: true, ignored: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Edition 5 (27.1.27) is the default for any order without edition metadata
    const edition: string | null = metadata.edition ?? "2027-01-27";

    const backendUrl = Deno.env.get('SUPABASE_URL');
    const backendKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!backendUrl || !backendKey) throw new Error('Server configuration error');
    const supabase = createClient(backendUrl, backendKey);

    const customerEmail = session.customer_details?.email ?? session.customer_email;
    const fullName = session.customer_details?.name ?? null;
    const amountFormatted = ((session.amount_total ?? 0) / 100).toFixed(2);
    const displayName = fullName ? fullName.split(" ")[0] : "there";

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (!existingOrder) {
    const { error: dbError } = await supabase.from("orders").insert({
      stripe_session_id: session.id,
      customer_email: customerEmail,
      contact_name: fullName,
      amount_total: session.amount_total,
      currency: session.currency ?? "chf",
      status: "completed",
      edition,
    });
      if (dbError && dbError.code !== "23505") throw new Error(`Failed to save order: ${dbError.message}`);
    }

    if (customerEmail) {
      const { data: calendar, error: calendarError } = await supabase.storage
        .from(CALENDAR_BUCKET).createSignedUrl(CALENDAR_PATH, 365 * 24 * 60 * 60, { download: "vibe-code-workshop.ics" });
      if (calendarError || !calendar?.signedUrl) throw new Error("Could not create calendar download link");
      await sendTicketEmails({ sessionId: session.id, email: customerEmail, name: displayName,
        company: session.customer_details?.business_name ?? undefined,
        amount: amountFormatted, edition: edition ?? "2027-01-27", calendarUrl: calendar.signedUrl });
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
