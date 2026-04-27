-- Allow anonymous read of testimonials marked public
CREATE POLICY "Public testimonials readable by anyone"
ON public.feedback_responses
FOR SELECT
TO anon, authenticated
USING (allow_testimonial_public = true AND testimonial IS NOT NULL AND testimonial <> '');

-- Mark all existing testimonials as public per user request
UPDATE public.feedback_responses
SET allow_testimonial_public = true
WHERE testimonial IS NOT NULL AND testimonial <> '';