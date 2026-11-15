import { createFileRoute } from "@tanstack/react-router";
import HsgWomenFeedback from "@/pages/HsgWomenFeedback";

export const Route = createFileRoute("/$lang/hsg-women-feedback")({
  component: HsgWomenFeedback,
});
