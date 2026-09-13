CREATE TABLE public.reverb_faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reverb_faq TO anon;
GRANT SELECT ON public.reverb_faq TO authenticated;
GRANT ALL ON public.reverb_faq TO service_role;

ALTER TABLE public.reverb_faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible FAQ entries"
ON public.reverb_faq FOR SELECT
TO anon, authenticated
USING (visible = true);

CREATE TRIGGER update_reverb_faq_updated_at
BEFORE UPDATE ON public.reverb_faq
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();