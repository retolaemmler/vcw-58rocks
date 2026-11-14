import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendTicketEmails, CALENDAR_BUCKET, CALENDAR_PATH } from "../_shared/ticket-emails.ts";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const APP_TAG = "vibe-code-workshop";

// The Stripe account is shared with other apps — only handle our own sessions.
async function resolveOurMetadata(session: Record<string, any>, key: string) {
  const direct = session.metadata ?? {};
  if (direct.app) return direct;

  const linkId = typeof session.payment_link === "string"
    ? session.payment_link
    : session.payment_link?.id;
  if (!linkId) return direct;

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const backendUrl = Deno.env.get('SUPABASE_URL');
    const backendKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!backendUrl || !backendKey) throw new Error('Server configuration error');
    const { session_id, test_confirmation } = await req.json();

    // Server-authorized diagnostic: fixed template and fixed recipient, no order insertion.
    if (test_confirmation === true) {
      const key = Deno.env.get('LOVABLE_API_KEY');
      if (!key || req.headers.get('Authorization') !== `Bearer ${key}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const client = createClient(backendUrl, backendKey);
      const { data: calendar, error } = await client.storage.from(CALENDAR_BUCKET)
        .createSignedUrl(CALENDAR_PATH, 365 * 24 * 60 * 60, { download: 'vibe-code-workshop.ics' });
      if (error || !calendar?.signedUrl) throw new Error('Could not create calendar download link');
      const result = await sendTemplateEmail('ticket-confirmation', 'rlaemmler@gmail.com', {
        templateData: { name: 'Reto', amount: '299.00', isTest: true, calendarUrl: calendar.signedUrl },
        idempotencyKey: 'ticket-confirmation-test-lovable-20261114',
      });
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (typeof session_id !== 'string' || !/^cs_[a-zA-Z0-9_]+$/.test(session_id) || session_id.length > 255) {
      throw new Error("Missing session_id");
    }

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // Fetch checkout session from Stripe API
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      }
    );

    if (!stripeRes.ok) {
      const err = await stripeRes.text();
      console.error("Stripe API error:", err);
      throw new Error("Failed to fetch Stripe session");
    }

    const session = await stripeRes.json();


    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment not completed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const metadata = await resolveOurMetadata(session, STRIPE_SECRET_KEY);
    if (metadata.app !== APP_TAG) {
      console.log("Ignoring session from another app:", session.id, metadata.app ?? "(no app tag)");
      return new Response(
        JSON.stringify({ error: "Session does not belong to this app" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // Edition 5 (27.1.27) is the default for any order without edition metadata
    const edition: string | null = metadata.edition ?? "2027-01-27";

    // Save order to database (upsert to handle page refreshes)
    const supabase = createClient(backendUrl, backendKey);

    const customerEmail = session.customer_details?.email ?? session.customer_email;
    const customerCompanyName = session.customer_details?.business_name ?? session.customer_details?.name ?? null;
    const contactName = session.customer_details?.individual_name ?? null;
    const contactFirstName = contactName ? contactName.split(" ")[0] : null;

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();


    if (!existingOrder) {
      const { error: dbError } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        customer_email: customerEmail,
        customer_name: customerCompanyName,
        contact_name: contactName,
        amount_total: session.amount_total,
        currency: session.currency ?? "chf",
        status: "completed",
        edition,
      });

      if (dbError) {
        // Unique violation: the Stripe webhook inserted this order concurrently.
        // The order exists and its email was sent there — treat as already handled.
        if ((dbError as { code?: string }).code === "23505") {
          console.log("Order already inserted by webhook, skipping:", session.id);
          // The managed sender deduplicates this event across both triggers.
        } else {
          console.error("Database insert error:", dbError);
          throw new Error(`Failed to save order: ${dbError.message}`);
        }
      }
    }

    // Managed idempotency prevents duplicate sends on refresh or webhook races.
    // Retry existing orders as well, so an earlier send failure can recover.
    if (customerEmail) {
      const { data: calendar, error: calendarError } = await supabase.storage
        .from(CALENDAR_BUCKET).createSignedUrl(CALENDAR_PATH, 365 * 24 * 60 * 60, { download: "vibe-code-workshop.ics" });
      if (calendarError || !calendar?.signedUrl) throw new Error("Could not create calendar download link");
      await sendTicketEmails({
        sessionId: session.id, email: customerEmail, name: contactFirstName ?? "there",
        company: customerCompanyName ?? undefined, amount: (session.amount_total / 100).toFixed(2),
        edition: edition ?? "2027-01-27", calendarUrl: calendar.signedUrl,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          customer_email: customerEmail,
          customer_name: customerCompanyName,
          contact_name: contactName,
          amount_total: session.amount_total,
          currency: session.currency,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
