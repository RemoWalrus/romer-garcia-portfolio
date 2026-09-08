CREATE POLICY "temp reverb upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'images');

ALTER TABLE public.reverb_characters ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;