import { createFileRoute } from "@tanstack/react-router";
import MasterclassNov11Survey from "@/pages/MasterclassNov11Survey";

export const Route = createFileRoute("/$lang/mc-nov11-prep")({
  component: MasterclassNov11Survey,
});
