

## App Idea Generator Page (Updated)

A new `/ideas` page where workshop participants enter a prompt, get 3-5 AI-generated app idea summaries, and can expand any into a full Lovable prompt. Now includes both B2B and consumer app example chips.

### Suggestion chips

**Business / Internal:**
- "Internal team dashboard"
- "Client onboarding portal"
- "Invoice automation tool"

**Consumer / Public:**
- "Fitness tracker with social features"
- "Recipe sharing community"
- "Local event discovery app"
- "Personal budget planner"
- "Habit tracker with streaks"

### Changes

| File | Action |
|------|--------|
| `supabase/functions/generate-ideas/index.ts` | Create — edge function calling Lovable AI. Two modes: `ideas` (returns 3-5 structured ideas) and `expand` (generates detailed Lovable prompt) |
| `src/pages/IdeaGenerator.tsx` | Create — textarea + grouped suggestion chips (Business & Consumer), result cards, "Expand for Lovable" button with copyable output |
| `src/App.tsx` | Edit — add `/ideas` route |

### Flow

1. User sees prompt textarea with two rows of clickable chip suggestions (Business / Consumer)
2. Clicking a chip or typing + submitting calls the edge function (`type: "ideas"`)
3. 3-5 idea cards appear with title, summary, target user
4. "Generate Lovable Prompt" on any card calls the edge function again (`type: "expand"`)
5. Expanded prompt shown in a copyable text block

