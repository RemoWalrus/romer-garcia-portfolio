import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  badRequest,
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
  validatePrompt,
} from "../_shared/ai-guard.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Abuse protection: cap anonymous text generations per IP.
    const ip = getClientIp(req);
    const retryAfter = checkRateLimit(`character:${ip}`, { limit: 20, windowMs: 60 * 60 * 1000 });
    if (retryAfter !== null) return rateLimitResponse(retryAfter, corsHeaders);

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return badRequest("Invalid request body.", corsHeaders);

    const { prompt } = body as { prompt?: unknown };
    const promptError = validatePrompt(prompt);
    if (promptError) return badRequest(promptError, corsHeaders);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a creative character designer for the Paradoxxia universe - a dark, mysterious sci-fi/fantasy setting full of paradoxes, strange phenomena, and complex characters. Generate detailed, engaging characters with depth and intrigue."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const character = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ character }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-character function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate character. Please try again later." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
