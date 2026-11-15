import { createFileRoute } from "@tanstack/react-router";
import WorkshopSlides from "@/pages/WorkshopSlides";

export const Route = createFileRoute("/slides")({
  component: WorkshopSlides,
});
