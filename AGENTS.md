# Architecture rules
- Workshop presentations use a central slide registry and a shared 1920×1080 scaled layout, with deck-specific semantic CSS tokens; this keeps presentation, overview, and print views consistent.
- Preserve uploaded presentation images as Lovable Assets pointers; this keeps screenshots faithful without storing binary media in the source tree.
- Ticket email triggers share registered React Email templates and event-derived idempotency keys through the managed send helper; this prevents duplicate sends across checkout confirmation and webhook retries without an email queue.