CREATE TABLE public.reverb_characters (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  image_file text NOT NULL DEFAULT '',
  figure_file text,
  accent text NOT NULL DEFAULT '#ffffff',
  glow text NOT NULL DEFAULT 'rgba(255,255,255,0.5)',
  has_profile boolean NOT NULL DEFAULT true,
  kanji text,
  title text,
  tagline text[] NOT NULL DEFAULT '{}',
  discipline text,
  identity jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text[] NOT NULL DEFAULT '{}',
  color_name text,
  specialties text[] NOT NULL DEFAULT '{}',
  palette text[] NOT NULL DEFAULT '{}',
  gear text[] NOT NULL DEFAULT '{}',
  overview text[] NOT NULL DEFAULT '{}',
  sign_off text,
  closing_quote text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reverb_characters TO anon;
GRANT SELECT ON public.reverb_characters TO authenticated;
GRANT ALL ON public.reverb_characters TO service_role;

ALTER TABLE public.reverb_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to reverb characters"
ON public.reverb_characters FOR SELECT
TO anon, authenticated
USING (true);

CREATE TRIGGER update_reverb_characters_updated_at
BEFORE UPDATE ON public.reverb_characters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();