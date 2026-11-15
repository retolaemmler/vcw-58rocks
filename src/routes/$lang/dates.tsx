import { createFileRoute } from "@tanstack/react-router";
import UpdateDates from "@/pages/UpdateDates";

export const Route = createFileRoute("/$lang/dates")({
  component: UpdateDates,
});
