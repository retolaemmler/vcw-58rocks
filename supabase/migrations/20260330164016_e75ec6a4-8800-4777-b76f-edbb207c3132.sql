CREATE POLICY "Authenticated can insert response" ON public.survey_responses
FOR INSERT TO authenticated
WITH CHECK (true);