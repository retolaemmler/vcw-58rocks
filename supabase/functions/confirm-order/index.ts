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
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("Missing session_id");
    }

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
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

    // Save order to database (upsert to handle page refreshes)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const customerEmail = session.customer_details?.email ?? session.customer_email;
    const customerCompanyName = session.customer_details?.name ?? null;

    // Get the "Full Name" custom field from Stripe checkout
    const fullNameField = session.custom_fields?.find(
      (f: any) => f.key === "full_name" || f.key === "fullname"
    );
    const contactName = fullNameField?.text?.value ?? null;
    const contactFirstName = contactName ? contactName.split(" ")[0] : null;

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    let isNewOrder = false;

    if (!existingOrder) {
      isNewOrder = true;
      const { error: dbError } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        customer_email: customerEmail,
        customer_name: customerFullName,
        amount_total: session.amount_total,
        currency: session.currency ?? "chf",
        status: "completed",
      });

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw new Error(`Failed to save order: ${dbError.message}`);
      }
    }

    // Only send email for new orders (not on page refresh)
    if (isNewOrder && customerEmail) {
      const amountFormatted = (session.amount_total / 100).toFixed(2);
      const displayName = customerFirstName ?? "there";

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Vibe Code Workshop <hello@vibecodeworkshop.ch>",
          to: [customerEmail],
          subject: "🎉 Your Vibe Code Workshop Ticket is Confirmed!",
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, hsl(174, 72%, 40%), hsl(262, 80%, 55%)); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Vibe Code Workshop</h1>
                <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Build a Real App in One Day</p>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 18px; color: hsl(220, 20%, 10%);">Dear ${displayName} 👋</p>
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
      } else {
        console.log(`Confirmation email sent to ${customerEmail}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          customer_email: customerEmail,
          customer_name: customerFullName,
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
