import { createFileRoute } from "@tanstack/react-router";
import Edition2Participants from "@/pages/Edition2Participants";

export const Route = createFileRoute("/$lang/edition2/participants")({
  component: Edition2Participants,
});
