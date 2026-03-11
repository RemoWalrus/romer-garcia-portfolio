ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS alt_text text NULL;
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS alt_text text NULL;