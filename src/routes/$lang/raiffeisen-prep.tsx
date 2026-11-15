import { createFileRoute } from "@tanstack/react-router";
import RaiffeisenSurvey from "@/pages/RaiffeisenSurvey";

export const Route = createFileRoute("/$lang/raiffeisen-prep")({
  component: RaiffeisenSurvey,
});
