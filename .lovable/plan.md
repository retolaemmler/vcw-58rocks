## Raiffeisen Post-Workshop Feedback

Create a German post-workshop feedback survey for Raiffeisen, modelled on the existing `/feedback` survey. Reuse the existing `feedback_responses` table — Raiffeisen responses are isolated via a dedicated `survey_tokens` row with a new `kind = "raiffeisen_feedback"`.

### 1. Database (migration)
- Insert a new row into `public.survey_tokens` with `kind = 'raiffeisen_feedback'` and a fresh random token.
- No schema changes — `feedback_responses` already supports everything needed; rows are scoped by `token_id`.

### 2. New page: `src/pages/RaiffeisenFeedback.tsx`
- Copy `src/pages/Feedback.tsx` and translate all user-facing strings to German.
- Validates `?token=` via `validate_survey_token` RPC and additionally requires `row.kind === "raiffeisen_feedback"` (like `RaiffeisenSurvey.tsx` does for prep).
- Keep the same fields: email, NPS (0–10), overall rating (1–5), 8 per-section ratings, best/worst, app built, will-continue, recommend, testimonial + public-OK checkbox, anything else.
- Drop the AI "Generate testimonial" button (it's tied to the public survey token flow; not needed here for the closed Raiffeisen cohort) — keep a plain testimonial textarea.
- Submit to `feedback_responses` with the resolved `token_id`.

### 3. Route
- In `src/App.tsx`, add `<Route path="raiffeisen-feedback" element={<RaiffeisenFeedback />} />` inside the `:lang` layout.

### 4. New admin component: `src/components/admin/RaiffeisenFeedbackAdmin.tsx`
- Copy `FeedbackAdmin.tsx` and adapt:
  - Look up the `raiffeisen_feedback` token (link uses `/raiffeisen-feedback?token=...`).
  - Filter `feedback_responses` by that `token_id`.
  - Same summary cards (Responses / Avg overall / NPS), section averages, table + XLSX export.
  - German labels in headers/labels to match the Raiffeisen theme (light touch — keep table compact).

### 5. Admin dashboard wiring
- In `src/pages/Admin.tsx`, add a fourth tab under Surveys: `Raiffeisen Feedback` → `<RaiffeisenFeedbackAdmin />`.

### Files touched
- new: `supabase/migrations/<ts>_raiffeisen_feedback_token.sql`
- new: `src/pages/RaiffeisenFeedback.tsx`
- new: `src/components/admin/RaiffeisenFeedbackAdmin.tsx`
- edit: `src/App.tsx` (route)
- edit: `src/pages/Admin.tsx` (tab)
