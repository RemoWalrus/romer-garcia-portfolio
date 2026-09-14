CREATE TABLE public.reverb_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'poster',
  file_url text NOT NULL,
  preview_url text,
  size_label text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reverb_downloads TO anon;
GRANT SELECT ON public.reverb_downloads TO authenticated;
GRANT ALL ON public.reverb_downloads TO service_role;

ALTER TABLE public.reverb_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible downloads"
ON public.reverb_downloads FOR SELECT
TO anon, authenticated
USING (visible = true);

CREATE TRIGGER update_reverb_downloads_updated_at
BEFORE UPDATE ON public.reverb_downloads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.reverb_print_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  download_id uuid REFERENCES public.reverb_downloads(id) ON DELETE SET NULL,
  poster_title text,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.reverb_print_waitlist TO anon;
GRANT INSERT ON public.reverb_print_waitlist TO authenticated;
GRANT ALL ON public.reverb_print_waitlist TO service_role;

ALTER TABLE public.reverb_print_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the print waitlist"
ON public.reverb_print_waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 254
  AND (note IS NULL OR length(note) <= 500)
  AND (poster_title IS NULL OR length(poster_title) <= 200)
);

CREATE OR REPLACE FUNCTION public.is_collective_member(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collective_subscribers
    WHERE lower(email) = lower(trim(_email))
      AND status = 'subscribed'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_collective_member(text) TO anon, authenticated;