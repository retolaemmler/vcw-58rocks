

## Plan: Add Promo Banner to Pricing Section

Add an eye-catching promo callout between the pricing tiers and the CTA buttons, highlighting the limited-time offer.

### Changes

**`src/components/sections/PricingSection.tsx`**:
- Import `Gift` icon from lucide-react
- Add a styled promo banner between the pricing grid (line 53) and the CTA buttons (line 55)
- Banner will feature a gradient border/accent with gift icon, the promo text: "Buy a ticket until Fr. March 20 and receive a **Free Vibe Code Fest Ticket** (CHF 75 Value)"
- Styled as a rounded card with a subtle gradient left border and warm background to draw attention

