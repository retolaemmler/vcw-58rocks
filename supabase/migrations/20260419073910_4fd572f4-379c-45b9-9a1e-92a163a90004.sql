-- Add a 'kind' column to survey_tokens to distinguish prep vs feedback tokens
ALTER TABLE public.survey_tokens 
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'prep';

-- Create feedback_responses table for post-workshop feedback
CREATE TABLE public.feedback_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL REFERENCES public.survey_tokens(id) ON DELETE CASCADE,
  email text,
  participant_name text,
  -- Overall NPS (0-10)
  nps_score integer,
  overall_rating integer,         -- 1-5
  -- Agenda-section ratings (1-5 each)
  rating_intro integer,
  rating_workshop_session_1 integer,
  rating_lunch integer,
  rating_next_level integer,
  rating_workshop_session_2 integer,
  rating_presentations integer,
  rating_future integer,
  rating_qa_beer integer,
  -- Qualitative
  best_part text,
  improve_part text,
  app_built_description text,
  will_continue_building text,    -- yes / maybe / no
  recommend_to_others text,       -- yes / maybe / no
  testimonial text,
  allow_testimonial_public boolean DEFAULT false,
  anything_else text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;

-- Same RLS pattern as survey_responses
CREATE POLICY "Anyone can insert feedback"
  ON public.feedback_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can check existing feedback"
  ON public.feedback_responses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can read feedback"
  ON public.feedback_responses FOR SELECT
  TO authenticated
  USING (is_admin_email());

CREATE POLICY "Admins can update feedback"
  ON public.feedback_responses FOR UPDATE
  TO authenticated
  USING (is_admin_email())
  WITH CHECK (is_admin_email());

CREATE POLICY "Admins can delete feedback"
  ON public.feedback_responses FOR DELETE
  TO authenticated
  USING (is_admin_email());

CREATE POLICY "Service role manages feedback"
  ON public.feedback_responses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed a default feedback token so /postfeedback works without param
INSERT INTO public.survey_tokens (token, kind)
VALUES ('feedback-default-' || replace(gen_random_uuid()::text, '-', ''), 'feedback');