CREATE POLICY "Allow fixed Reverb artwork upload"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'images'
  AND name IN (
    'reverb/reverb-char-reverb.png',
    'reverb/reverb-char-spark.png',
    'reverb/reverb-char-harmonix.png',
    'reverb/reverb-char-eduq.png',
    'reverb/reverb-char-wida.png',
    'reverb/reverb-spark-main.png',
    'reverb/reverb-harmonix-main.png',
    'reverb/reverb-wida-main.png'
  )
);