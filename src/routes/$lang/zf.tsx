import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@/lib/router-compat";

export const Route = createFileRoute("/$lang/zf")({
  component: () => <Navigate to="/zugerberg-feedback?token=13863054-2753-46f3-b30d-ebd0fc8b496c" replace />,
});
