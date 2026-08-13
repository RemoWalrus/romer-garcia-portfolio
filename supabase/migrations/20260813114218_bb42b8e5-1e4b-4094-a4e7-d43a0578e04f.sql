-- 1. Remove public write access to the images bucket
DROP POLICY IF EXISTS "Enable upload for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable upload access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for all users" ON storage.objects;

-- 2. Consolidate duplicate public read policies
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Public Download" ON storage.objects;

-- 3. Hide contact_email from Data API readers
REVOKE SELECT (contact_email) ON public.profile FROM anon;
REVOKE SELECT (contact_email) ON public.profile FROM authenticated;

-- 4. SECURITY DEFINER hardening
CREATE OR REPLACE FUNCTION public.get_active_meme()
RETURNS SETOF public.daily_memes
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.daily_memes WHERE is_active = true LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_random_quote()
RETURNS SETOF public.quotes
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $$
  SELECT * FROM public.quotes ORDER BY random() LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM authenticated;