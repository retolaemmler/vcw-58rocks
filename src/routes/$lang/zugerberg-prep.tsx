import { createFileRoute } from "@tanstack/react-router";
import ZugerbergSurvey from "@/pages/ZugerbergSurvey";

export const Route = createFileRoute("/$lang/zugerberg-prep")({
  component: ZugerbergSurvey,
});
