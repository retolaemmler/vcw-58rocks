

## Plan: Update organizer notification email recipient

**Change:** In `supabase/functions/confirm-order/index.ts`, change the organizer notification recipient from `hello@vibecodeworkshop.ch` to `rlaemmler@gmail.com`.

**File:** `supabase/functions/confirm-order/index.ts`
- Line with `to: ["hello@vibecodeworkshop.ch"]` in the organizer notification section → change to `to: ["rlaemmler@gmail.com"]`
- Redeploy the edge function

