
-- Remove overly-permissive anon SELECT policies on response tables
DROP POLICY IF EXISTS "Anyone can check existing response" ON public.survey_responses;
DROP POLICY IF EXISTS "Anyone can check existing feedback" ON public.feedback_responses;

-- Remove overly-permissive anon SELECT policy on survey_tokens (enumeration risk)
DROP POLICY IF EXISTS "Anyone can validate token" ON public.survey_tokens;

-- Provide a secure RPC for anon to validate a token by value without enumeration
CREATE OR REPLACE FUNCTION public.validate_survey_token(_token text)
RETURNS TABLE(id uuid, kind text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, kind FROM public.survey_tokens WHERE token = _token LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.validate_survey_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_survey_token(text) TO anon, authenticated;
