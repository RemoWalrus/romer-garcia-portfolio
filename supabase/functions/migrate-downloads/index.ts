// One-off maintenance task: copy Reverb download files that still live on the
// Lovable asset CDN into Supabase Storage (public `images` bucket) and rewrite
// the reverb_downloads rows to point at the storage URLs, so posters and
// wallpapers are managed entirely from Supabase.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const CDN_ORIGIN = "https://romer-garcia-portfolio.lovable.app";
const BUCKET = "images";
const PREFIX = "reverb/downloads";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: rows, error } = await admin
    .from("reverb_downloads")
    .select("id,file_url,preview_url");

  if (error) return new Response("Query failed", { status: 500, headers: corsHeaders });

  const publicUrl = (path: string) =>
    `${url}/storage/v1/object/public/${BUCKET}/${path}`;

  const moved = new Map<string, string>();
  const log: string[] = [];

  const move = async (assetUrl: string | null) => {
    if (!assetUrl || !assetUrl.startsWith("/__l5e/")) return assetUrl;
    if (moved.has(assetUrl)) return moved.get(assetUrl)!;

    const name = assetUrl.split("/").pop()!;
    const path = `${PREFIX}/${name}`;
    const res = await fetch(`${CDN_ORIGIN}${assetUrl}`);
    if (!res.ok) {
      log.push(`skip ${name} (${res.status})`);
      return assetUrl;
    }
    const body = new Uint8Array(await res.arrayBuffer());
    const { error: upErr } = await admin.storage.from(BUCKET).upload(path, body, {
      contentType: res.headers.get("content-type") ?? "application/octet-stream",
      upsert: true,
    });
    if (upErr) {
      log.push(`upload failed ${name}`);
      return assetUrl;
    }
    const next = publicUrl(path);
    moved.set(assetUrl, next);
    log.push(`moved ${name}`);
    return next;
  };

  for (const row of rows ?? []) {
    const file_url = await move(row.file_url);
    const preview_url = await move(row.preview_url);
    if (file_url !== row.file_url || preview_url !== row.preview_url) {
      await admin.from("reverb_downloads").update({ file_url, preview_url }).eq("id", row.id);
    }
  }

  return new Response(JSON.stringify({ log }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
