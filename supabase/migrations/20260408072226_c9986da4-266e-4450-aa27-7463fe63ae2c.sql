CREATE TABLE public.newsletter_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX newsletter_signups_email_idx ON public.newsletter_signups (email);

ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for newsletter"
  ON public.newsletter_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read newsletter signups"
  ON public.newsletter_signups FOR SELECT
  TO authenticated
  USING (is_admin_email());

CREATE POLICY "Service role manages newsletter signups"
  ON public.newsletter_signups FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);