

## Plan: Participant Preparation Survey (Single Shared Link)

One tokenized survey link for all participants. The survey collects an email address, which is matched against the `orders` table to verify the participant.

### 1. Database: `survey_tokens` and `survey_responses` tables

**Migration:**

```sql
-- Single shared token for survey access
CREATE TABLE public.survey_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.survey_tokens ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read by token value
CREATE POLICY "Anyone can validate token" ON public.survey_tokens
  FOR SELECT TO anon USING (true);

CREATE POLICY "Service role manages tokens" ON public.survey_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Survey responses linked by email
CREATE TABLE public.survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid REFERENCES public.survey_tokens(id) NOT NULL,
  email text NOT NULL,
  ai_coding_experience text NOT NULL,
  lovable_experience text NOT NULL,
  workshop_goals text NOT NULL,
  success_criteria text NOT NULL,
  has_app_idea boolean NOT NULL DEFAULT false,
  app_idea_description text,
  app_audience text,
  building_blocks text NOT NULL,
  drink_preference text NOT NULL,
  dietary text NOT NULL,
  anything_else text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(token_id, email)
);
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert response" ON public.survey_responses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins can read responses" ON public.survey_responses
  FOR SELECT TO authenticated USING (is_admin_email());

CREATE POLICY "Service role manages responses" ON public.survey_responses
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

### 2. Survey Page (`/survey?token=...`)

- Validates token from URL query param
- First field: **email address** — on blur, check if email exists in `orders` table (via an edge function, since `orders` has RLS). Show error if not found
- Prevent duplicate submissions (same token + email)
- 10 questions as described, with conditional fields for app idea details
- Branded to match the site style
- Thank-you screen on submit

### 3. Edge Function: `validate-survey-email`

Checks if the provided email exists in the `orders` table (using service role). Returns `{ valid: true/false }`. This keeps order data protected while allowing anonymous survey access.

### 4. Admin Dashboard additions

- **"Generate Survey Link" button** — creates a token in `survey_tokens` and displays the URL for copy-paste
- **"Survey Responses" tab** — table showing all responses with participant name (from orders), email, and answers
- Show completion status: which order emails have/haven't submitted

### Files changed
- `supabase/migrations/` — new migration for both tables
- `supabase/functions/validate-survey-email/index.ts` — new edge function
- `src/pages/Survey.tsx` — new survey page
- `src/pages/Admin.tsx` — add survey link generation + responses view
- `src/App.tsx` — add `/survey` route

