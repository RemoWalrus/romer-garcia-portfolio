CREATE TABLE public.reverb_transmissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  transmission_number integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  subtitle text,
  excerpt text,
  body text,
  character_slug text REFERENCES public.reverb_characters(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'archive',
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  cover_image_url text,
  thumbnail_url text,
  media_url text,
  external_url text,
  cta_label text,
  cta_url text,
  is_collective_only boolean NOT NULL DEFAULT false,
  is_anomaly boolean NOT NULL DEFAULT false,
  sort_order integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reverb_transmissions TO anon;
GRANT SELECT ON public.reverb_transmissions TO authenticated;
GRANT ALL ON public.reverb_transmissions TO service_role;

ALTER TABLE public.reverb_transmissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published transmissions"
ON public.reverb_transmissions FOR SELECT
TO anon, authenticated
USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());

CREATE INDEX reverb_transmissions_feed_idx
  ON public.reverb_transmissions (status, published_at DESC);
CREATE INDEX reverb_transmissions_character_idx
  ON public.reverb_transmissions (character_slug);

CREATE TRIGGER update_reverb_transmissions_updated_at
BEFORE UPDATE ON public.reverb_transmissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.reverb_archive_slots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_slug text REFERENCES public.reverb_characters(id) ON DELETE CASCADE,
  label text,
  title text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  release_status text NOT NULL DEFAULT 'locked',
  linked_transmission_id uuid REFERENCES public.reverb_transmissions(id) ON DELETE SET NULL,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reverb_archive_slots TO anon;
GRANT SELECT ON public.reverb_archive_slots TO authenticated;
GRANT ALL ON public.reverb_archive_slots TO service_role;

ALTER TABLE public.reverb_archive_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible archive slots"
ON public.reverb_archive_slots FOR SELECT
TO anon, authenticated
USING (visible = true);

CREATE INDEX reverb_archive_slots_character_idx
  ON public.reverb_archive_slots (character_slug, display_order);

CREATE TRIGGER update_reverb_archive_slots_updated_at
BEFORE UPDATE ON public.reverb_archive_slots
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();