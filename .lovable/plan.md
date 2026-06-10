# Company social proof on `/v2/company`

Add a monochrome "Trusted by" logo strip directly under the CTA button, and replace the individual `TestimonialsSection` with a new section featuring two embedded LinkedIn posts.

## 1. Upload logos as CDN assets

Use `lovable-assets` to upload from `/mnt/user-uploads/`:
- `trekksoft-logo.png`
- `raiffeisen-logo.png`
- `humatica-logo.png`
- `startups-logo.svg`

Pointers saved at `src/assets/<name>.asset.json`.

## 2. New component: `TrustedByStrip.tsx`

`src/components/sections/v2/TrustedByStrip.tsx`

- Small eyebrow text: "Trusted by teams at"
- Horizontal flex row, 4 logos, wraps on mobile
- All logos rendered with `grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition` and a fixed `h-8 md:h-10` for visual consistency (monochrome trust look)
- Names as `alt` text for accessibility
- No background, sits inside the hero container directly under the Request button

## 3. New component: `CompanyLinkedInPosts.tsx`

`src/components/sections/v2/CompanyLinkedInPosts.tsx`

- Section with eyebrow "What companies say" + heading "Real stories from real teams"
- Two-column grid on desktop (`md:grid-cols-2`), stacked on mobile
- Two LinkedIn iframe embeds (height 750, width 100%, max-w 504, rounded border):
  1. `https://www.linkedin.com/embed/feed/update/urn:li:activity:7419422883065688064`
  2. `https://www.linkedin.com/embed/feed/update/urn:li:activity:7469734925231869952` (converted from the `/feed/update/` URL the user provided)
- `loading="lazy"`, `title` attribute set, `allowfullscreen`

## 4. Update `WorkshopCompany.tsx`

- Render `<TrustedByStrip />` inside the hero, directly after the CTA `<Button>`, with `mt-12` spacing
- Replace `<TestimonialsSection />` with `<CompanyLinkedInPosts />` in the page composition
- All other sections (Agenda, Industries, Requirements, Hosts, Footer) unchanged

## Out of scope

- No changes to `/v2` homepage or `/v2/classic` (still use individual `TestimonialsSection`)
- No DB, edge functions, secrets, or i18n keys
- No new design tokens
