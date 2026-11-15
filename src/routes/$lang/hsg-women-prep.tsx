import { createFileRoute } from "@tanstack/react-router";
import HsgWomenSurvey from "@/pages/HsgWomenSurvey";

export const Route = createFileRoute("/$lang/hsg-women-prep")({
  component: HsgWomenSurvey,
});
