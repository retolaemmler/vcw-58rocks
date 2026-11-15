import { createFileRoute } from "@tanstack/react-router";
import { RootRedirect } from "@/components/routing/LangRouting";

export const Route = createFileRoute("/")({
  component: RootRedirect,
});
