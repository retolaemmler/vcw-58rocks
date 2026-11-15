import { createFileRoute } from "@tanstack/react-router";
import ZugerbergSlides from "@/pages/ZugerbergSlides";

export const Route = createFileRoute("/$lang/zugerberg/slides")({
  component: ZugerbergSlides,
});
