import { createFileRoute } from "@tanstack/react-router";
import Edition1Participants from "@/pages/Edition1Participants";

export const Route = createFileRoute("/$lang/edition1/participants")({
  component: Edition1Participants,
});
