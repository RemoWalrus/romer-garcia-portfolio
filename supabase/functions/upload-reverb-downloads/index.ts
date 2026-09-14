// TEMPORARY one-off uploader for the reverb-downloads bucket. Delete after use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const TOKEN = "k7Qv2xR9tL4mZs1bYw8Np3Hd";

Deno.serve(async (req) => {
  if (req.headers.get("x-upload-token") !== TOKEN) {
    return new Response("no", { status: 401 });
  }

  const path = new URL(req.url).searchParams.get("path");
  if (!path || path.includes("..")) return new Response("bad path", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const bytes = new Uint8Array(await req.arrayBuffer());
  const { error } = await supabase.storage.from("reverb-downloads").upload(path, bytes, {
    contentType: path.endsWith(".webp") ? "image/webp" : "image/jpeg",
    upsert: true,
    cacheControl: "31536000",
  });

  return new Response(JSON.stringify({ ok: !error, error: error?.message ?? null }), {
    status: error ? 500 : 200,
    headers: { "Content-Type": "application/json" },
  });
});
