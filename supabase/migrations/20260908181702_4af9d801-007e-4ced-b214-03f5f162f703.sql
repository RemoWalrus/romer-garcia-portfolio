DROP POLICY IF EXISTS "temp_reverb_upload" ON storage.objects;
UPDATE public.reverb_characters SET figure_file = 'reverb-eduq-main.webp' WHERE id = 'eduq';