import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url);
    const bucket = url.searchParams.get('bucket');
    const file = url.searchParams.get('file');
    const action = url.searchParams.get('action') || 'download';

    if (!bucket || !file) {
      return new Response(
        JSON.stringify({ error: 'Missing bucket or file parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Storage proxy request - Bucket: ${bucket}, File: ${file}, Action: ${action}`);

    if (action === 'download') {
      // Create signed URL for download
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(file, 3600); // 1 hour expiry

      if (error) {
        console.error('Storage error:', error);
        return new Response(
          JSON.stringify({ error: 'File not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Redirect to the signed URL
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': data.signedUrl
        }
      });
    } else if (action === 'url') {
      // Return the signed URL as JSON
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(file, 3600);

      if (error) {
        console.error('Storage error:', error);
        return new Response(
          JSON.stringify({ error: 'File not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ url: data.signedUrl }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Proxy storage error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});