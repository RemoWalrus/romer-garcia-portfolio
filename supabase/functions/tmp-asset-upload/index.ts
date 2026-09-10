import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { items } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const results: unknown[] = [];
    for (const item of items ?? []) {
      const res = await fetch(item.source);
      if (!res.ok) {
        results.push({ path: item.path, ok: false, status: res.status });
        continue;
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      const { error } = await supabase.storage
        .from(item.bucket ?? "images")
        .upload(item.path, bytes, { contentType: item.contentType, upsert: true });
      results.push({ path: item.path, ok: !error, size: bytes.length, error: error?.message });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: "upload failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
