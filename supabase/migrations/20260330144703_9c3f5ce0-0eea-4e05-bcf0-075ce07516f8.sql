
CREATE TABLE public.survey_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.survey_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can validate token" ON public.survey_tokens
  FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can read tokens" ON public.survey_tokens
  FOR SELECT TO authenticated USING (is_admin_email());

CREATE POLICY "Service role manages tokens" ON public.survey_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

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

CREATE POLICY "Anyone can check existing response" ON public.survey_responses
  FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can read responses" ON public.survey_responses
  FOR SELECT TO authenticated USING (is_admin_email());

CREATE POLICY "Service role manages responses" ON public.survey_responses
  FOR ALL TO service_role USING (true) WITH CHECK (true);
