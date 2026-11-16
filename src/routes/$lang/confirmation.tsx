import { createFileRoute } from "@tanstack/react-router";
import Confirmation from "@/pages/Confirmation";

export const Route = createFileRoute("/$lang/confirmation")({
  head: () => ({ meta: [
    { title: "Ticket confirmation | Vibe Code Workshop" },
    { name: "description", content: "Your Vibe Code Workshop ticket and payment confirmation." },
    { property: "og:title", content: "Ticket confirmation | Vibe Code Workshop" },
    { property: "og:description", content: "Your Vibe Code Workshop ticket and payment confirmation." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Confirmation,
});
