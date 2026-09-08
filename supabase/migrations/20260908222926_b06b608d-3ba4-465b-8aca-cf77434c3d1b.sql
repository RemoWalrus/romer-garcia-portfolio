ALTER TABLE public.reverb_characters
  DROP COLUMN IF EXISTS closing_quote,
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.reverb_characters.gallery IS 'Array of gallery items: {type: "image" | "video", src: string, caption?: string}';
