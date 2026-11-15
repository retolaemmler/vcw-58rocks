import { createFileRoute } from "@tanstack/react-router";
import IdeaGenerator from "@/pages/IdeaGenerator";

export const Route = createFileRoute("/$lang/ideas")({
  component: IdeaGenerator,
});
