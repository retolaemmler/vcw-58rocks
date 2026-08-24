# Merge 28.8.26 feedback into Masterclass Feedback

Remove the separate "28.08.26 Masterclass Feedback Survey" entry in Admin → Surveys, and instead make 28.8.26 an edition option inside the existing "Masterclass Feedback" view.

## What changes

- Admin → Surveys dropdown: the "28.08.26 Masterclass Feedback Survey" option disappears.
- Admin → Surveys → Masterclass Feedback → "Filter by Edition" gets a third option: "Edition 3 - 28.8.26", alongside Edition 1 - 16.4.26 and Edition 2 - 30.6.26. "All Editions" includes it.
- The public feedback page stays live at `/de/mc-aug28-feedback?token=…` with its existing token, so responses keep coming in — they now show up under Masterclass Feedback instead of a separate tab. (Say the word if you'd rather retire that page entirely.)
- Stats, NPS, table and XLSX export in Masterclass Feedback respect the new edition filter as they do today.

## Technical notes

- `src/pages/Admin.tsx`: drop the `mc-aug28-feedback` SelectItem, its conditional render and the `MasterclassAug28FeedbackAdmin` import.
- Delete `src/components/admin/MasterclassAug28FeedbackAdmin.tsx`.
- `src/components/admin/FeedbackAdmin.tsx`:
  - Load tokens for kinds `feedback`, `feedback_de` and `mc_aug28_feedback`.
  - Treat responses on the `mc_aug28_feedback` token as Edition 3; keep the existing date-cutoff split for Editions 1/2.
  - Add the `edition3` SelectItem and filter branch; include Edition 3 rows in `all`.
- Keep the route `/:lang/mc-aug28-feedback` and `src/pages/MasterclassAug28Feedback.tsx` unchanged; surface its share link in the Masterclass Feedback header when the Edition 3 filter is active.
- No database changes — the existing `mc_aug28_feedback` token and `feedback_responses` table are reused.
