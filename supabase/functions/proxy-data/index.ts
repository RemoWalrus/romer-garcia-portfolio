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
    const table = url.searchParams.get('table');
    const action = url.searchParams.get('action') || 'select';

    if (!table) {
      return new Response(
        JSON.stringify({ error: 'Missing table parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Data proxy request - Table: ${table}, Action: ${action}`);

    let result;

    switch (action) {
      case 'select':
        // Handle SELECT operations
        const columns = url.searchParams.get('columns') || '*';
        const orderBy = url.searchParams.get('order');
        const limit = url.searchParams.get('limit');
        const filter = url.searchParams.get('filter');
        
        let query = supabase.from(table).select(columns);
        
        if (filter) {
          // Handle basic eq filters like "section_name:eq:contact"
          const [column, operator, value] = filter.split(':');
          if (operator === 'eq') {
            query = query.eq(column, value);
          }
        }
        
        if (orderBy) {
          const [column, direction] = orderBy.split(':');
          query = query.order(column, { ascending: direction !== 'desc' });
        }
        
        if (limit) {
          query = query.limit(parseInt(limit));
        }
        
        result = await query;
        break;

      case 'rpc':
        // Handle RPC function calls
        const functionName = url.searchParams.get('function');
        if (!functionName) {
          return new Response(
            JSON.stringify({ error: 'Missing function parameter for RPC' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
        const params = url.searchParams.get('params');
        const rpcParams = params ? JSON.parse(params) : {};
        
        result = await supabase.rpc(functionName, rpcParams);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ data: result.data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Proxy data error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});