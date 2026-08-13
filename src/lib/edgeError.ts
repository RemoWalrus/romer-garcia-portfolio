/**
 * supabase.functions.invoke() surfaces non-2xx responses as a generic
 * "Edge Function returned a non-2xx status code" error. This reads the JSON
 * body off the attached response so users see the real reason (rate limit,
 * invalid input, etc.).
 */
export async function edgeErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): Promise<string> {
  const ctx = (error as { context?: unknown })?.context;
  const response = ctx instanceof Response ? ctx : undefined;

  if (response) {
    try {
      const body = await response.clone().json();
      if (body && typeof body.error === "string") {
        if (response.status === 429) {
          const retryAfter = Number(response.headers.get("Retry-After") || 0);
          const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 0;
          return minutes
            ? `${body.error} (about ${minutes} minute${minutes === 1 ? "" : "s"})`
            : body.error;
        }
        return body.error;
      }
    } catch {
      // ignore body parse issues and fall through
    }
  }

  const message = (error as { message?: unknown })?.message;
  if (typeof message === "string" && !message.includes("non-2xx")) return message;
  return fallback;
}
