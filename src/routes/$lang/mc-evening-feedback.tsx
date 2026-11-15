import { createFileRoute } from "@tanstack/react-router";
import { EveningFeedbackByLang } from "@/components/routing/LangRouting";

export const Route = createFileRoute("/$lang/mc-evening-feedback")({
  component: EveningFeedbackByLang,
});
