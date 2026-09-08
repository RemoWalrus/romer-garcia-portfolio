ALTER TABLE public.reverb_characters ADD COLUMN IF NOT EXISTS base_id text;

UPDATE public.reverb_characters SET base_id = 'spark' WHERE id = 'spark-20';

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;