import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { badRequest, checkRateLimit, getClientIp, rateLimitResponse } from "../_shared/ai-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return badRequest("Invalid request body.", corsHeaders);

    const { action, id, imageDataUrl, prompt } = body as {
      action?: string;
      id?: string;
      imageDataUrl?: string;
      prompt?: string;
    };

    const ip = getClientIp(req);

    if (action === "create") {
      // Video is expensive: hard cap per IP.
      const retryAfter = checkRateLimit(`story-video:${ip}`, { limit: 6, windowMs: 60 * 60 * 1000 });
      if (retryAfter !== null) return rateLimitResponse(retryAfter, corsHeaders);

      const safePrompt =
        typeof prompt === "string" && prompt.trim().length > 0
          ? prompt.trim().slice(0, 1200)
          : "Cinematic slow push-in on the survivor standing still in the scorched Cyber Boondocks: dust drifting, failing neon flicker, fabric and hair moving faintly in the wind, subtle head turn toward the camera. Photorealistic film still in motion, moody cool rim light.";

      const payload: Record<string, unknown> = {
        model: "google/veo-3.1-lite",
        prompt: safePrompt,
        seconds: "4",
        size: "1280x720",
      };

      if (typeof imageDataUrl === "string" && imageDataUrl.startsWith("data:image/")) {
        payload.input_reference = imageDataUrl;
      }

      const res = await fetch("https://ai.gateway.lovable.dev/v1/videos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("video create failed:", res.status, detail);
        if (res.status === 429) return json({ error: "Too many videos rendering. Try again shortly." }, 429);
        if (res.status === 402) return json({ error: "AI credits depleted." }, 402);
        return json({ error: "Could not start the intro sequence." }, 400);
      }

      const job = await res.json();
      return json({ id: job.id, status: job.status });
    }

    if (action === "status") {
      if (typeof id !== "string" || !/^[\w-]{1,64}$/.test(id)) return badRequest("Invalid job id.", corsHeaders);

      const res = await fetch(`https://ai.gateway.lovable.dev/v1/videos/${id}`, {
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
      });
      if (!res.ok) {
        console.error("video status failed:", res.status, await res.text());
        return json({ error: "Could not read the intro sequence." }, 400);
      }
      const job = await res.json();

      if (job.status !== "completed") {
        if (job.status === "failed") {
          console.error("video job failed:", job?.error);
          return json({ status: "failed", error: "The intro sequence could not be rendered." });
        }
        return json({ status: job.status ?? "in_progress", progress: job.progress ?? 0 });
      }

      const contentRes = await fetch(`https://ai.gateway.lovable.dev/v1/videos/${id}/content`, {
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
      });
      if (!contentRes.ok) {
        console.error("video download failed:", contentRes.status);
        return json({ error: "Could not fetch the intro sequence." }, 400);
      }
      const bytes = new Uint8Array(await contentRes.arrayBuffer());
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const base64 = btoa(binary);

      return json({ status: "completed", videoUrl: `data:video/mp4;base64,${base64}` });
    }

    return badRequest("Unknown action.", corsHeaders);
  } catch (error) {
    console.error("story-video error:", error);
    return json({ error: "Server error." }, 500);
  }
});
