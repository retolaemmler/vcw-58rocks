# Architecture rules
- Workshop presentations use a central slide registry and a shared 1920×1080 scaled layout, with deck-specific semantic CSS tokens; this keeps presentation, overview, and print views consistent.
- Preserve uploaded presentation images as Lovable Assets pointers; this keeps screenshots faithful without storing binary media in the source tree.
- Ticket email triggers share registered React Email templates and event-derived idempotency keys through the managed send helper; this prevents duplicate sends across checkout confirmation and webhook retries without an email queue.
- After payment verification and order persistence, confirmation treats calendar/email delivery as best-effort and returns its status separately; delivery failures must not hide a paid ticket, while the shared dispatcher still throws so webhook retries remain effective.
- The app runs on TanStack Start with file routes in `src/routes`; language pages live under the `$lang` layout, which sets the i18n language on first render so server and client text match.
- Pages keep react-router-style hooks through `src/lib/router-compat.tsx`; this let the migration keep page code unchanged while running on the TanStack router.
- App-internal backend calls are server functions in `src/lib/*.functions.ts` wrapping the original handler via `runLegacyHandler`; webhooks, auth hooks and the shared ticket-email path stay as backend functions because external services or shared idempotency depend on them.
