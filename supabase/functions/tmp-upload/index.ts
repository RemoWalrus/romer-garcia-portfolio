import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Temporary authenticated upload helper for trusted internal use.
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method", { status: 405 });
  const path = req.headers.get("x-path");
  const type = req.headers.get("x-content-type") ?? "application/octet-stream";
  if (!path || !path.startsWith("reverb/transmissions/")) {
    return new Response("bad path", { status: 400 });
  }
  const body = await req.arrayBuffer();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { error } = await supabase.storage
    .from("images")
    .upload(path, body, { contentType: type, upsert: true });
  if (error) return new Response(JSON.stringify(error), { status: 500 });
  return new Response("ok");
});
