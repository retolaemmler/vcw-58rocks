
ALTER TABLE public.survey_responses ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.survey_responses ADD COLUMN participant_name text;
ALTER TABLE public.survey_responses DROP CONSTRAINT survey_responses_token_id_email_key;
CREATE UNIQUE INDEX survey_responses_unique_identity ON public.survey_responses (token_id, COALESCE(email, participant_name));
