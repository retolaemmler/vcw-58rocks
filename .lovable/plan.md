## Goal

Create an alternate homepage at `/en/v2` to prototype a new direction without touching the live homepage. From there, two big cards let visitors choose **Company Workshop** or **Classic Workshop**, each opening its own sub-page. Shared content (schedule, audience, industries, testimonials, requirements, coaches) is reused. No pricing yet.

## Routes

Add three new routes inside the existing `:lang` layout in `src/App.tsx`:

- `/:lang/v2` → `HomeV2` (intro + two big cards)
- `/:lang/v2/company` → `WorkshopCompany` (company workshop sub-page)
- `/:lang/v2/classic` → `WorkshopClassic` (classic workshop sub-page, application/specific dates)

No changes to `/`, `/en`, or any existing route. English-only content for now.

## New files

```text
src/pages/
  HomeV2.tsx
  WorkshopCompany.tsx
  WorkshopClassic.tsx

src/components/sections/v2/
  V2Hero.tsx              // intro: "Vibecoding Workshop" headline + short copy
  WorkshopChoice.tsx      // two big side-by-side cards (Company | Classic)
  IndustriesSection.tsx   // broader "who is this for" — companies / industries / use cases
  V2Footer.tsx            // optional minimal footer (or reuse FooterSection)
```

Reused as-is (imported from existing files, English copy via current i18n):
- `AgendaSection` (schedule in a nutshell)
- `AudienceSection` (who is this for — people/roles)
- `TestimonialsSection` (what past participants say)
- `RequirementsSection` (what you'll need)
- `HostsSection` (workshop coaches)
- `Navbar`, `FooterSection`

## Page composition

**HomeV2** (`/en/v2`)
1. `Navbar`
2. `V2Hero` — short intro: what a Vibecoding Workshop is
3. `WorkshopChoice` — two big cards, primary entry point:
   - **Company Workshop** — "Book a private workshop for your team (6–20 people)" → `/en/v2/company`
   - **Classic Workshop** — "Apply for one of our upcoming public dates" → `/en/v2/classic`
4. `AgendaSection` (schedule in a nutshell)
5. `AudienceSection` (who is this for — roles)
6. `IndustriesSection` (who is this for — companies / industries, broader framing)
7. `TestimonialsSection`
8. `RequirementsSection`
9. `HostsSection`
10. `FooterSection`
   *(No pricing section.)*

**WorkshopCompany** (`/en/v2/company`)
- `Navbar`
- Hero tailored to companies: 6–20 people, on-site or remote, tailored agenda; primary CTA "Request a company workshop" (opens existing newsletter/contact modal for now, no new backend).
- Reuses: Agenda, Industries, Testimonials, Requirements, Hosts.
- Footer.

**WorkshopClassic** (`/en/v2/classic`)
- `Navbar`
- Hero tailored to individuals: apply for a specific public date; primary CTA "Apply for a date" (placeholder button, scrolls to a simple "Upcoming dates" list — content stubbed for now).
- Reuses: Agenda, Audience, Testimonials, Requirements, Hosts.
- Footer.

## Two big cards (`WorkshopChoice`)

- Two equal-width cards on desktop, stacked on mobile.
- Each card: icon + title + 1-line subtitle + 2–3 bullets + primary button linking to the respective sub-page.
- Uses existing design tokens (teal primary, gradient accents, card styling consistent with `AudienceSection`/`HostsSection`).

## Industries section (new)

Broader "who is this for" at the company level: short intro + grid of industry/use-case chips or small cards (e.g. Financial services, Consulting, Marketing & agencies, Product teams, HR & L&D, Startups, Public sector). Pure presentation, no backend.

## Out of scope

- No DB changes, no edge functions, no new secrets.
- No pricing/checkout on v2.
- No changes to existing homepage, admin, surveys, or i18n keys (new copy is added inline in English in the new components; can be moved into i18n later).
- No navbar link to `/v2` yet — reachable by URL only, so the live site stays untouched.

## Acceptance

- Visiting `/en/v2` renders the intro + two big cards + all shared sections, no pricing.
- Clicking the **Company** card navigates to `/en/v2/company`; **Classic** card to `/en/v2/classic`.
- Existing `/` and `/en` homepages are unchanged.
- Build passes; no console errors on any of the three new pages.
