DROP POLICY IF EXISTS "Authenticated users can read allowed emails" ON public.admin_allowed_emails;
CREATE POLICY "Users can read own admin status" ON public.admin_allowed_emails
  FOR SELECT TO authenticated
  USING (email = auth.email());