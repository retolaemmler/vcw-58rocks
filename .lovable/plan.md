## Plan: Add team photo to Coaches section

### Goal
Integrate the uploaded group photo as a full-width banner inside the existing Coaches section (`HostsSection.tsx`), placed above the three coach cards, using a balanced medium (~16:7) aspect ratio.

### Steps

1. **Upload the photo as a CDN asset**
   - Use `lovable-assets create` on `/mnt/user-uploads/WhatsApp_Image_2026-06-16_at_11.38.23_1.jpeg`, saving the pointer to `src/assets/coaches-team.jpg.asset.json`.
   - This avoids committing the binary into the repo.

2. **Update `src/components/sections/HostsSection.tsx`**
   - Import the new asset pointer.
   - Between the section's intro paragraph and the `grid` of coach cards, insert a banner block:
     - Container: `max-w-5xl mx-auto mb-12 rounded-2xl overflow-hidden shadow-md border border-border/50`
     - Image: `<img>` with `aspect-[16/7] w-full object-cover object-center`, descriptive `alt` ("Valentin Binnendijk, Reto Lämmler and Remy Blaettler at a Vibe Code Workshop"), `loading="lazy"`.
   - Keep all existing content (heading, intro, cards, badges, LinkedIn links) unchanged.

3. **Verification**
   - Confirm the build is green (auto-run).
   - Visually check the Coaches section on the homepage (`/en`) at desktop and mobile widths to ensure the banner crops well and doesn't push layout.

### Notes
- No copy/caption added (per user response).
- The same `HostsSection` is reused on `WorkshopCompany.tsx`, so the banner will appear there too — this is consistent with the user's "Coaches section" choice.
- No i18n strings needed (image only, alt text is descriptive English which is fine for both locales).
