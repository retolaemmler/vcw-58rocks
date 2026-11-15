import { createFileRoute } from "@tanstack/react-router";
import Confirmation from "@/pages/Confirmation";

export const Route = createFileRoute("/$lang/confirmation")({
  component: Confirmation,
});
