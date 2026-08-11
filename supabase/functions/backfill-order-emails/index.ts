import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { customerEmailHtml } from "../stripe-webhook/index.ts";

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
