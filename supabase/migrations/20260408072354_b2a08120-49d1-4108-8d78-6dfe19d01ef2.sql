CREATE POLICY "Admins can delete newsletter signups"
  ON public.newsletter_signups FOR DELETE
  TO authenticated
  USING (is_admin_email());