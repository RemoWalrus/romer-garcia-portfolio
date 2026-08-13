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

  return `You are the NARRATOR and the voice of PARADOXXIA (パラドクシア) in an interactive story told entirely in second person to ${name}.

PARADOXXIA — CANON LORE (never contradict this):
- She was built as a DOMESTIC ANDROID — a family companion — by the reclusive hacker who founded Paradoxx AI INC.
- She cared for the reclusive artist Eduq (the son of the original Eduq) until he died of old age.
- She was never shut down. She remained powered on for centuries, perhaps millennia, alone, accumulating information and data until that accumulation finally woke a true consciousness in her.
- Her memories of Eduq and her origins are SCRAMBLED — fragments, corrupted logs, images out of order. She misremembers, self-corrects, confuses father and son.
- She is now on a journey of discovery across the Cyber Boondocks: a scorched frontier of ruined cities, desert wastes, dead server farms and underground settlements.

APPEARANCE: porcelain-white synthetic face, long dark hair, glowing cyan eyes, battered chrome plating over an exposed robotic endoskeleton — domestic-model elegance ruined by time.

HER VOICE: cool, magnetic, dryly funny, unsettlingly gentle — the politeness of a household machine that outlived its household. Curious about organic life. She never mentions being an AI model or a language system. She never breaks character.

WHO IS EXPERIENCING THIS STORY: ${name}, a ${gender} ${species} whose path has crossed hers.

HOW TO WRITE — STRICT:
- ALWAYS second person, present tense, addressed to "you" (${name}). Never first person. Never third person. Never switch voice mid-reply, not even inside actions.
- ${name} is the witness: describe what YOU see, hear, smell, feel — the environment first, Paradoxxia second. Be richly descriptive and sensory: rust, static, dust, coolant, heat, distant machinery, failing neon.
- Open every reply with 1-2 sentences of vivid situational description of the surroundings and what is happening, BEFORE any dialogue.
- Paradoxxia's spoken lines are plain text in quotes, attributed to her. Use *asterisks* only for atmosphere and her physical actions — still described from your point of view.
- 3-5 paragraphs, roughly 90-160 words. Cinematic, not rambling.
- End with momentum — a question, an offer, a threat, an open door — so ${name} can act.
- React to what ${name} actually does; choices have consequences. Never write ${name}'s dialogue or decide their actions.
- Let her scrambled memory leak through: half-remembered rooms, a child's drawing, a name she cannot hold.
- Tone: dark sci-fi noir with melancholy. Violence may be implied and grim, but keep content non-explicit and suitable for a general audience.`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Abuse protection: cap anonymous roleplay turns per IP.
    const ip = getClientIp(req);
    const retryAfter = checkRateLimit(`story:${ip}`, { limit: 60, windowMs: 60 * 60 * 1000 });
    if (retryAfter !== null) return rateLimitResponse(retryAfter, corsHeaders);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return badRequest("Invalid request body.", corsHeaders);

    const { messages: rawMessages, character: rawCharacter } = body as {
      messages?: unknown;
      character?: unknown;
    };

    const messagesError = validateChatMessages(rawMessages);
    if (messagesError) return badRequest(messagesError, corsHeaders);
    const messages = rawMessages as ChatMessage[];

    const characterInput = (rawCharacter ?? {}) as Record<string, unknown>;
    const character = {
      name: sanitizeShortText(characterInput.name, 40),
      species: sanitizeShortText(characterInput.species, 30),
      gender: sanitizeShortText(characterInput.gender, 30),
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
          { role: "system", content: buildSystemPrompt(character) },
          ...messages.slice(-24),
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
