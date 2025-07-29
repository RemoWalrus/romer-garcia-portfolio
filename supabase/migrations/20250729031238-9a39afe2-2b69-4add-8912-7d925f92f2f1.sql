-- Phase 1: Critical Database Security Fixes

-- 1. Enable RLS on metadata table
ALTER TABLE public.metadata ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for metadata table (public read access, no write access for now)
CREATE POLICY "Allow public read access to metadata" 
ON public.metadata 
FOR SELECT 
USING (true);

-- 2. Fix database function security issues

-- Update update_updated_at_column function with proper security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update get_random_quote function with proper security
CREATE OR REPLACE FUNCTION public.get_random_quote()
RETURNS SETOF quotes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM quotes
  ORDER BY random()
  LIMIT 1;
END;
$$;