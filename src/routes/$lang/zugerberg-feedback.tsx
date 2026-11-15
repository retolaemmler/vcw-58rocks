import { createFileRoute } from "@tanstack/react-router";
import ZugerbergFeedback from "@/pages/ZugerbergFeedback";

export const Route = createFileRoute("/$lang/zugerberg-feedback")({
  component: ZugerbergFeedback,
});
