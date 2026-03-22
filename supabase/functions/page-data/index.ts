import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url);
    const page = url.searchParams.get('page') || 'home';

    console.log(`page-data request for: ${page}`);

    if (page === 'home') {
      const [
        projectsRes,
        heroTitlesRes,
        galleryRes,
        sectionsRes,
        metadataRes,
        quoteRes,
      ] = await Promise.all([
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('hero_titles').select('*').order('sort_order', { ascending: true }),
        supabase.from('gallery').select('*').order('sort_order', { ascending: true }),
        supabase.from('sections').select('*'),
        supabase.from('metadata').select('meta_key,meta_value'),
        supabase.rpc('get_random_quote'),
      ]);

      return new Response(
        JSON.stringify({
          data: {
            projects: projectsRes.data || [],
            heroTitles: heroTitlesRes.data || [],
            gallery: galleryRes.data || [],
            sections: sectionsRes.data || [],
            metadata: metadataRes.data || [],
            quote: quoteRes.data?.[0] || null,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (page === 'paradoxxia') {
      const [
        carouselRes,
        configRes,
        metadataRes,
        socialRes,
      ] = await Promise.all([
        supabase.from('paradoxxia_carousel').select('*').order('sort_order', { ascending: true }),
        supabase.from('config').select('value').eq('key', 'paradoxxia_lore_text').single(),
        supabase.from('metadata').select('meta_key,meta_value'),
        supabase.from('sections').select('*').eq('section_name', 'social'),
      ]);

      return new Response(
        JSON.stringify({
          data: {
            carousel: carouselRes.data || [],
            loreText: configRes.data?.value || '',
            metadata: metadataRes.data || [],
            social: socialRes.data?.[0] || null,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown page parameter' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('page-data error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
