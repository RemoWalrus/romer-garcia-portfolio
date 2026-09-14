CREATE POLICY "Reverb download files are readable"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'reverb-downloads');

UPDATE public.reverb_downloads SET
  file_url = 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/proxy-storage?bucket=reverb-downloads&file=' || regexp_replace(file_url, '^.*/', ''),
  preview_url = CASE
    WHEN category = 'poster' THEN 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/proxy-storage?bucket=reverb-downloads&file=' || replace(regexp_replace(file_url, '^.*/', ''), '-poster.jpg', '-preview.webp')
    ELSE 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/proxy-storage?bucket=reverb-downloads&file=' || replace(regexp_replace(file_url, '^.*/', ''), '.jpg', '-preview.webp')
  END
WHERE file_url LIKE '%/reverb/downloads/%';