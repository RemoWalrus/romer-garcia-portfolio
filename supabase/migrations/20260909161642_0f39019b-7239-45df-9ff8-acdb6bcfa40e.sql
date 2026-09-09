CREATE TABLE public.collective_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  source_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text NOT NULL DEFAULT 'subscribed',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX collective_subscribers_email_key ON public.collective_subscribers (lower(email));

GRANT INSERT ON public.collective_subscribers TO anon;
GRANT INSERT ON public.collective_subscribers TO authenticated;
GRANT ALL ON public.collective_subscribers TO service_role;

ALTER TABLE public.collective_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the collective"
ON public.collective_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 254
  AND status = 'subscribed'
);