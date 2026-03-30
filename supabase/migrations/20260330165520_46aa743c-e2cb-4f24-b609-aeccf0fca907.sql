CREATE POLICY "Admins can delete responses" ON public.survey_responses
FOR DELETE TO authenticated
USING (is_admin_email());