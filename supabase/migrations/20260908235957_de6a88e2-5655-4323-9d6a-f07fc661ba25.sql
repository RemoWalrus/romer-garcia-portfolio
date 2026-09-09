ALTER TABLE public.reverb_characters ADD COLUMN IF NOT EXISTS is_locked boolean NOT NULL DEFAULT false;
UPDATE public.reverb_characters SET is_locked = true WHERE is_hidden = true;