import { createFileRoute } from "@tanstack/react-router";
import Survey from "@/pages/Survey";

export const Route = createFileRoute("/$lang/survey")({
  component: Survey,
});
