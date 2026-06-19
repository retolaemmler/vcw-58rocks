Move the Coaches section (HostsSection) to appear immediately after the Agenda section on the homepage.

### Current order
Hero → TrustedBy → Why → Agenda → Audience → Testimonials → Requirements → Coaches → Pricing → Footer

### Proposed order
Hero → TrustedBy → Why → Agenda → Coaches → Audience → Testimonials → Requirements → Pricing → Footer

### What will change
- In `src/pages/Index.tsx`: move `<HostsSection />` so it renders directly after `<AgendaSection />`.
- No other component changes needed; the `#coaches` anchor and scroll behavior stay intact.

### Optional follow-up
The navbar currently lists nav items as: What, Schedule, Participants, Requirements, Coaches, Tickets, Newsletter. Since Coaches will now appear before Requirements visually, we may want to swap those two items so the nav order matches the page order. I can include this or skip it — let me know.

### Validation
- Verify the local build passes.
- Confirm in the preview that the Coaches section renders after the Agenda section and the rest of the page order is unchanged.