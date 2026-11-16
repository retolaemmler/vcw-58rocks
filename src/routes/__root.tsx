import { useEffect, type ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import appCss from "../styles.css?url";
// ported from main.tsx
import "@/i18n";

const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://api.vibehunt.me https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.vibehunt.me https://api.stripe.com; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://buy.stripe.com https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self' https://buy.stripe.com; frame-ancestors 'self'; upgrade-insecure-requests";

const TITLE = "Vibe Code Workshop — Build a Real Web App in One Evening";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "impact-site-verification", value: "5e90f004-6762-4c06-9898-0833fc13207b" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { httpEquiv: "Content-Security-Policy", content: CSP },
      { title: TITLE },
      {
        name: "description",
        content:
          "Build a real web app in one evening with Lovable.dev — no coding experience required. A 58rocks GmbH hands-on bootcamp in Zürich, Wednesday, January 27, 2027, 17:00–21:00.",
      },
      { name: "author", content: "58rocks GmbH" },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content:
          "A hands-on evening bootcamp by 58rocks GmbH. Build a real app using Lovable.dev — no coding required. Wednesday, January 27, 2027, 17:00–21:00 in Zürich.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/vcw-logo.png" },
      { property: "og:url", content: "https://vibecodeworkshop.ch" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/vcw-logo.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "canonical", href: "https://vibecodeworkshop.ch" },
    ],
    scripts: [
      {
        src: "https://api.vibehunt.me/functions/v1/annotation-widget?appId=d9e855b8-d846-467d-8558-01242ed5c237",
        defer: true,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-bold">This page didn't load</h1>
        <p className="mt-3 text-muted-foreground">Something went wrong on our side. Please try again.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => {
              void router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
          <Link to="/" className="rounded-md border border-border px-4 py-2 text-sm font-medium">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
