import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

/**
 * Server-side env lookup for handlers ported from backend functions. Platform-owned
 * backend URL/keys fall back to the public VITE_* values when not injected.
 */
export function env(name: string): string | undefined {
  const value = process.env[name];
  if (value) return value;
  if (name === "SUPABASE_URL") return import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  if (name === "SUPABASE_ANON_KEY" || name === "SUPABASE_PUBLISHABLE_KEY") {
    return import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;
  }
  return undefined;
}

/** Forwards the signed-in user's access token to server functions as an Authorization header. */
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});

/**
 * Runs a Request -> Response handler (the original backend-function body) with the
 * caller's headers and the given JSON payload. Non-2xx responses throw, mirroring
 * how the previous invoke() call surfaced HTTP errors.
 */
export async function runLegacyHandler(
  handler: (req: Request) => Promise<Response>,
  incoming: Request,
  payload: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const headers = new Headers(incoming.headers);
  headers.set("content-type", "application/json");
  headers.delete("content-length");
  const req = new Request(incoming.url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload ?? {}),
  });
  const res = await handler(req);
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const message = typeof json["error"] === "string" ? json["error"] : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return json;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyServerFn = (opts: { data: Record<string, unknown> }) => Promise<any>;

/** Drop-in for `supabase.functions.invoke(name, { body })`: resolves to `{ data, error }`. */
export async function invokeServerFn(
  fn: AnyServerFn,
  options?: { body?: Record<string, unknown> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ data: any; error: Error | null }> {
  try {
    const data = await fn({ data: options?.body ?? {} });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}
