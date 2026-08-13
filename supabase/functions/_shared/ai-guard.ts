/**
 * Shared abuse-protection helpers for the AI generation edge functions.
 * Provides per-IP rate limiting, prompt validation and image-URL origin
 * allowlisting so anonymous callers cannot drain AI credits or use the
 * functions as an SSRF proxy.
 */

export const MAX_PROMPT_LENGTH = 24000;
export const MAX_IMAGE_DATA_URL_BYTES = 8 * 1024 * 1024; // ~8MB base64 payload

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Fixed-window-free sliding window limiter kept in instance memory.
 * Returns null when allowed, or the number of seconds to wait.
 */
export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): number | null {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    const retryMs = windowMs - (now - bucket.hits[0]);
    return Math.max(1, Math.ceil(retryMs / 1000));
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  // Opportunistic cleanup so the map cannot grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.hits.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return null;
}

export function rateLimitResponse(retryAfterSeconds: number, corsHeaders: Record<string, string>) {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

export function badRequest(message: string, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Validates a text prompt. Returns an error message or null. */
export function validatePrompt(
  prompt: unknown,
  { maxLength = MAX_PROMPT_LENGTH }: { maxLength?: number } = {},
): string | null {
  if (typeof prompt !== "string") return "prompt must be a string.";
  const trimmed = prompt.trim();
  if (trimmed.length === 0) return "prompt is required.";
  if (trimmed.length > maxLength) return `prompt must be ${maxLength} characters or fewer.`;
  return null;
}

const ALLOWED_IMAGE_HOSTS = [
  "romergarcia.com",
  "www.romergarcia.com",
  "romer-garcia-portfolio.lovable.app",
  "lovable.app",
  "lovableproject.com",
  "xxigtbxqgbdcfpmnrzvp.supabase.co",
  "localhost",
];

/**
 * Validates a reference image reference. Accepts inline data URLs (camera and
 * gallery uploads) and https URLs on an explicit host allowlist only.
 * Returns an error message or null.
 */
export function validateImageUrl(imageUrl: unknown): string | null {
  if (imageUrl === undefined || imageUrl === null || imageUrl === "") return null;
  if (typeof imageUrl !== "string") return "imageUrl must be a string.";

  if (imageUrl.startsWith("data:")) {
    if (!/^data:image\/(png|jpe?g|webp|heic|heif);base64,/i.test(imageUrl)) {
      return "imageUrl must be a base64 image data URL.";
    }
    if (imageUrl.length > MAX_IMAGE_DATA_URL_BYTES) return "Reference image is too large.";
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return "imageUrl is not a valid URL.";
  }

  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
    return "imageUrl must use https.";
  }

  const host = parsed.hostname.toLowerCase();
  const allowed = ALLOWED_IMAGE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  if (!allowed) return "imageUrl host is not allowed.";

  return null;
}

/** Validates a roleplay chat transcript. Returns an error message or null. */
export function validateChatMessages(messages: unknown, maxMessages = 40): string | null {
  if (!Array.isArray(messages)) return "messages must be an array.";
  if (messages.length === 0) return "messages is required.";
  if (messages.length > maxMessages) return "Conversation is too long.";

  for (const message of messages) {
    if (typeof message !== "object" || message === null) return "Invalid message entry.";
    const { role, content } = message as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return "Invalid message role.";
    const error = validatePrompt(content, { maxLength: 4000 });
    if (error) return error;
  }

  return null;
}

/** Trims a free-text field to a safe length, returning undefined when absent. */
export function sanitizeShortText(value: unknown, maxLength = 60): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
  return cleaned.length ? cleaned : undefined;
}
