-- Create table for daily developer memes
CREATE TABLE public.daily_memes (
  id SERIAL PRIMARY KEY,
  meme_text TEXT NOT NULL,
  attribution TEXT,
  update_info TEXT DEFAULT 'Updated daily at midnight UTC',
  coding_tip TEXT,
  fun_fact TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_memes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to daily memes" 
ON public.daily_memes 
FOR SELECT 
USING (true);

-- Create function to get active meme
CREATE OR REPLACE FUNCTION public.get_active_meme()
RETURNS SETOF daily_memes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM daily_memes
  WHERE is_active = true
  LIMIT 1;
END;
$function$;

-- Insert initial meme data
INSERT INTO public.daily_memes (meme_text, attribution, coding_tip, fun_fact, is_active) VALUES 
('All your base are belong to us!', 'Classic Zero Wing (1992) mistranslation that became legendary meme', 'There are only 10 types of people in the world: those who understand binary and those who don''t.', 'Remember when we thought Y2K would end civilization? Good times... *nervous developer laughter*', true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_memes_updated_at
BEFORE UPDATE ON public.daily_memes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();