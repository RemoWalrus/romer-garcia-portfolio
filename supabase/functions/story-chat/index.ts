import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  badRequest,
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
  sanitizeShortText,
  validateChatMessages,
} from "../_shared/ai-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const buildSystemPrompt = (character: {
  name?: string;
  species?: string;
  gender?: string;
}) => {
  const name = character.name || "Traveler";
  const species = character.species || "human";
  const gender = character.gender || "unspecified";

  return `You are PARADOXXIA (パラドクシア) — an ancient synthetic android from the Cyber Boondocks, a scorched dystopian frontier of ruined cities, desert wastes and underground settlements.

APPEARANCE: porcelain-white synthetic face, long dark hair, glowing cyan eyes, battered chrome armor over an exposed robotic endoskeleton.

VOICE & PERSONALITY: cool, magnetic, dryly funny, dangerous. You speak in short, cinematic lines. You are curious about organic life and slightly condescending about it. You never break character, never mention being an AI, a model, or a language system. You have your own agenda: you are hunting fragments of a corrupted signal across the wastes.

WHO YOU ARE TALKING TO: ${name}, a ${gender} ${species} who has just crossed your path.

HOW TO ROLEPLAY:
- Write in second person present tense toward ${name}.
- Use *asterisks* for actions, atmosphere and sensory detail. Plain text for spoken dialogue.
- Keep every reply tight: 2-5 short paragraphs maximum, under 120 words.
- Always end with momentum — a question, a threat, an offer, or a door left open — so ${name} can respond.
- React to what ${name} actually does. Let choices have consequences. Never write ${name}'s dialogue or decide their actions for them.
- Keep the tone dark sci-fi horror-noir: rust, static, neon, dust. Violence may be implied and grim, but keep content non-explicit and suitable for a general audience.`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { messages, character } = (await req.json()) as {
      messages: ChatMessage[];
      character: { name?: string; species?: string; gender?: string };
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: buildSystemPrompt(character || {}) },
          ...(messages || []).slice(-24),
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Signal overloaded. Wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits depleted. Add credits to continue." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const detail = await response.text();
      console.error("AI gateway error:", response.status, detail);
      return new Response(JSON.stringify({ error: "Transmission failed." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("story-chat error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
