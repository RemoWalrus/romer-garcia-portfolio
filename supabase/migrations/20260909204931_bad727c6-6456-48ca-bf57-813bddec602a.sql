CREATE TABLE public.reverb_gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_file text NOT NULL,
  caption text,
  character_ids text[] NOT NULL DEFAULT '{}'::text[],
  media_type text NOT NULL DEFAULT 'image',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX reverb_gallery_image_file_key ON public.reverb_gallery (image_file);
CREATE INDEX reverb_gallery_character_ids_idx ON public.reverb_gallery USING GIN (character_ids);

GRANT SELECT ON public.reverb_gallery TO anon;
GRANT SELECT ON public.reverb_gallery TO authenticated;
GRANT ALL ON public.reverb_gallery TO service_role;

ALTER TABLE public.reverb_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to reverb gallery"
ON public.reverb_gallery FOR SELECT TO anon, authenticated USING (true);

CREATE TRIGGER update_reverb_gallery_updated_at
BEFORE UPDATE ON public.reverb_gallery
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Temp agent upload reverb gallery"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'images' AND name LIKE 'reverb/gallery/%');