import { createFileRoute } from "@tanstack/react-router";
import RaiffeisenFeedback from "@/pages/RaiffeisenFeedback";

export const Route = createFileRoute("/$lang/raiffeisen-feedback")({
  component: RaiffeisenFeedback,
});
