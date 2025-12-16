-- Create stock-music storage bucket for downloadable compressed music files
INSERT INTO storage.buckets (id, name, public)
VALUES ('stock-music', 'stock-music', true);

-- Allow public read access to stock-music files
CREATE POLICY "Public read access for stock-music"
ON storage.objects
FOR SELECT
USING (bucket_id = 'stock-music');