
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;

CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_allowed_emails ae
    JOIN auth.users u ON u.email = ae.email
    WHERE u.id = auth.uid()
  )
$$;

CREATE POLICY "Admins can read all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin_email());
