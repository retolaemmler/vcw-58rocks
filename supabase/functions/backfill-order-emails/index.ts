import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
function customerEmailHtml(displayName: string, amountFormatted: string) {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, hsl(174, 72%, 40%), hsl(262, 80%, 55%)); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Vibe Code Workshop</h1>
        <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px;">Build a Real Web App in One Evening</p>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 18px; color: hsl(220, 20%, 10%);">Dear ${displayName} \u{1F44B}</p>
        <p style="color: hsl(220, 10%, 46%); line-height: 1.6;">Thank you for securing your spot! Your ticket for the Vibe Code Workshop has been confirmed.</p>
        <div style="background: hsl(210, 20%, 97%); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h2 style="font-size: 16px; color: hsl(220, 20%, 10%); margin: 0 0 12px;">Event Details</h2>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">\u{1F4C5} Tuesday, 15 September 2026 &middot; 17:00 &ndash; 21:00</p>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">\u{1F4CD} Zurich, Switzerland (exact location TBD)</p>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">\u{1F355} Pizza break included &middot; free Lovable credits</p>
          <p style="margin: 6px 0; color: hsl(220, 10%, 46%);">\u{1F4B0} CHF ${amountFormatted} paid</p>
        </div>
        <p style="color: hsl(220, 10%, 46%); line-height: 1.6;">We'll send you more details as the event gets closer. See you there! \u{1F680}</p>
      </div>
      <div style="background: hsl(210, 20%, 97%); padding: 20px 30px; text-align: center;">
        <p style="color: hsl(220, 10%, 46%); font-size: 12px; margin: 0;">Vibe Code Workshop &middot; Zurich, Switzerland</p>
      </div>
    </div>`;
}

const ics = [
  "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Vibe Code Workshop//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
  "BEGIN:VEVENT","DTSTART:20260915T150000Z","DTEND:20260915T190000Z",
  "SUMMARY:Vibe Code Workshop - Build a Real Web App in One Evening",
  "DESCRIPTION:Evening hands-on masterclass. Build a real app using AI-powered tools.\\nMore details: https://vibecodeworkshop.ch",
  "LOCATION:Zurich\\, Switzerland (exact location TBD)","STATUS:CONFIRMED",
  "UID:vibe-code-workshop-2026-09-15@vibecodeworkshop.ch","END:VEVENT","END:VCALENDAR",
].join("\r\n");

Deno.serve(async () => {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: orders } = await supabase
    .from("orders")
    .select("customer_email, contact_name, amount_total")
    .eq("edition", "2026-09-15");

  const icsBase64 = btoa(String.fromCharCode(...new TextEncoder().encode(ics)));
  const results: unknown[] = [];
  let rows = "";

  for (const o of orders ?? []) {
    const amount = (o.amount_total / 100).toFixed(2);
    const first = (o.contact_name ?? "there").split(" ")[0];
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Vibe Code Workshop <hello@vibecodeworkshop.ch>",
        to: [o.customer_email],
        subject: "🎉 Your Vibe Code Workshop Ticket is Confirmed!",
        attachments: [{ filename: "vibe-code-workshop.ics", content: icsBase64, type: "text/calendar" }],
        html: customerEmailHtml(first, amount),
      }),
    });
    results.push({ to: o.customer_email, ok: res.ok, body: res.ok ? null : await res.text() });
    rows += `<li>${o.contact_name ?? ""} — ${o.customer_email} — CHF ${amount}</li>`;
  }

  const notify = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
    body: JSON.stringify({
      from: "Vibe Code Workshop <hello@vibecodeworkshop.ch>",
      to: ["reto@58rocks.com", "valentin.binnendijk@pedalix.com"],
      subject: "🎟️ Ticket orders – Masterclass 15 September 2026",
      html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;"><h2>🎟️ Ticket orders (15 Sept 2026)</h2><p>Confirmation emails sent to:</p><ul>${rows}</ul></div>`,
    }),
  });
  results.push({ to: "organizers", ok: notify.ok, body: notify.ok ? null : await notify.text() });

  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
});
