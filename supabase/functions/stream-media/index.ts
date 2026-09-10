// Streams media (video/audio) from Supabase Storage with HTTP Range support.
// Range support is required by Safari/iOS for <video> playback.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, range",
  "Access-Control-Expose-Headers": "content-length, content-range, accept-ranges",
};

const ALLOWED_BUCKETS = new Set(["images", "graphics", "stock-music"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const bucket = url.searchParams.get("bucket") ?? "images";
    const file = url.searchParams.get("file") ?? "";

    if (!file || file.includes("..") || !ALLOWED_BUCKETS.has(bucket)) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const target = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${bucket}/${file
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;

    const range = req.headers.get("range");
    const upstream = await fetch(target, {
      method: req.method === "HEAD" ? "HEAD" : "GET",
      headers: range ? { Range: range } : undefined,
    });

    if (!upstream.ok && upstream.status !== 206) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const headers = new Headers(corsHeaders);
    for (const key of ["content-type", "content-length", "content-range", "etag", "last-modified"]) {
      const value = upstream.headers.get(key);
      if (value) headers.set(key, value);
    }
    headers.set("accept-ranges", "bytes");
    headers.set("cache-control", "public, max-age=31536000, immutable");

    return new Response(req.method === "HEAD" ? null : upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (_e) {
    return new Response("Error", { status: 500, headers: corsHeaders });
  }
});
