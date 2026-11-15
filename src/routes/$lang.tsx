import { createFileRoute } from "@tanstack/react-router";
import { LangLayout } from "@/components/routing/LangRouting";

export const Route = createFileRoute("/$lang")({
  component: LangLayout,
});
