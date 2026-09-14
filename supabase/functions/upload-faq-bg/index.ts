// One-off: upload the Reverb FAQ background to the public `images` bucket.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { path, contentType, base64 } = await req.json();
    if (!path || !base64) throw new Error("missing fields");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supabase.storage
      .from("images")
      .upload(path, bytes, { contentType: contentType ?? "image/webp", upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return new Response(JSON.stringify({ url: data.publicUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "upload failed" }), { status: 400 });
  }
});
