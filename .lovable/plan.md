# 28.08.26 Masterclass Prep & Feedback Surveys

Two new surveys, cloned from the Zugerberg Prep Survey and Zugerberg Feedback, in German, for the Masterclass on 28.08.2026.

## What you get

- Two new entries in Admin → Surveys dropdown:
  - "28.08.26 Masterclass Prep Survey"
  - "28.08.26 Masterclass Feedback Survey"
- Each admin view works exactly like the Zugerberg ones: shareable survey link with token, response table, stats/ratings, delete, and XLSX export.
- Two new public survey pages with their own access tokens.
- The "which workshop day" question is removed on both pages (single date, 28. August 2026); all other questions stay identical.

## Pages and links

- Prep survey: `/de/mc-aug28-prep?token=…`
- Feedback survey: `/de/mc-aug28-feedback?token=…`

Tokens are created in the database as part of this work and shown in the admin panel for copying.

## Technical notes

- New pages `src/pages/MasterclassAug28Survey.tsx` and `src/pages/MasterclassAug28Feedback.tsx`, copied from the Zugerberg pages with token kinds `mc_aug28_prep` and `mc_aug28_feedback`, and the attendance-day block removed.
- New admin components `src/components/admin/MasterclassAug28SurveyAdmin.tsx` and `MasterclassAug28FeedbackAdmin.tsx`, copied from the Zugerberg admin components with the new KIND, SURVEY_PATH, titles, export names, and no attendance-day column.
- Routes added in `src/App.tsx` under the `/:lang` parent.
- Two rows inserted into `survey_tokens` (kinds above); reuses the existing `survey_responses` / `feedback_responses` tables, so no schema change is needed.
- `src/pages/Admin.tsx`: two new `SelectItem`s and their conditional renders.
