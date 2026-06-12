Make `/:lang/v2/classic` render the current homepage instead of the custom Classic placeholder.

**Change:** In `src/App.tsx`, point the `v2/classic` route to the existing `Index` page component (the current homepage).

```tsx
<Route path="v2/classic" element={<Index />} />
```

This keeps the V2 "Vibe Code Masterclass" CTA from `WorkshopChoice` working — clicking it lands on the full real homepage with all its sections (hero, pricing, agenda, testimonials, etc.).

`src/pages/WorkshopClassic.tsx` becomes unused but will be left in place for now (no deletion) so we can revisit later if needed.