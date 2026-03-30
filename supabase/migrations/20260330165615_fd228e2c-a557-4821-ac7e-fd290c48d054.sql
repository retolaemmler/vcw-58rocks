CREATE POLICY "Admins can update responses" ON public.survey_responses
FOR UPDATE TO authenticated
USING (is_admin_email())
WITH CHECK (is_admin_email());