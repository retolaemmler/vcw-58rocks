import { createFileRoute } from "@tanstack/react-router";
import Survey from "@/pages/Survey";

export const Route = createFileRoute("/$lang/prepsurvey")({
  component: Survey,
});
