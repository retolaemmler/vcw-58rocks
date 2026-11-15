import { createFileRoute } from "@tanstack/react-router";
import Edition2Slides from "@/pages/Edition2Slides";

export const Route = createFileRoute("/$lang/edition2/slides")({
  component: Edition2Slides,
});
