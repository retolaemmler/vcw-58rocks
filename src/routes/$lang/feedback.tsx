import { createFileRoute } from "@tanstack/react-router";
import { FeedbackByLang } from "@/components/routing/LangRouting";

export const Route = createFileRoute("/$lang/feedback")({
  component: FeedbackByLang,
});
