DROP POLICY IF EXISTS "temp_reverb_upload" ON storage.objects;
UPDATE public.reverb_characters SET figure_file = 'reverb-reverb-main.webp' WHERE id = 'reverb';