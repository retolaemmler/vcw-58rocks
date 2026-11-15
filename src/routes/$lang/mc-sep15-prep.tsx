import { createFileRoute } from "@tanstack/react-router";
import MasterclassSep15Survey from "@/pages/MasterclassSep15Survey";

export const Route = createFileRoute("/$lang/mc-sep15-prep")({
  component: MasterclassSep15Survey,
});
