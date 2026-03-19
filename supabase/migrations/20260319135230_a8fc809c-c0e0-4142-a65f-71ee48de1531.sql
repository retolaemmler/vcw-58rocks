
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.admin_allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage allowed emails"
ON public.admin_allowed_emails
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can read allowed emails"
ON public.admin_allowed_emails
FOR SELECT
TO authenticated
USING (true);

INSERT INTO public.admin_allowed_emails (email) VALUES 
  ('rlaemmler@gmail.com'),
  ('binnendijk@gmail.com'),
  ('remy.blaettler@gmail.com');

CREATE POLICY "Admins can read all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_allowed_emails 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);
