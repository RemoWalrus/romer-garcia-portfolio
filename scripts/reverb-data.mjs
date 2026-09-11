// Shared Supabase reads for the sitemap generator and the Reverb pre-renderer.
// Uses the publishable anon key, same as the browser client.

const SUPABASE_URL = "https://xxigtbxqgbdcfpmnrzvp.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aWd0YnhxZ2JkY2ZwbW5yenZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNzQyNjUsImV4cCI6MjA1NDY1MDI2NX0.N9TKpkYmeitE3kthByFOnmR0gKBvBrMshEXez6D5IU8";

export const SITE = "https://romergarcia.com";
export const STORAGE_PROXY = `${SITE}/api/proxy-storage?bucket=images&file=`;

async function rest(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase ${path} -> ${res.status}`);
  return res.json();
}

/** Reverb characters, in roster order. */
export async function fetchCharacters() {
  try {
    return await rest("reverb_characters?select=*&order=sort_order.asc");
  } catch (e) {
    console.warn("[reverb-data] characters unavailable:", e.message);
    return [];
  }
}

/** Published transmissions only. */
export async function fetchTransmissions() {
  try {
    return await rest(
      "reverb_transmissions?select=slug,title,subtitle,excerpt,cover_image_url,character_slug,published_at,updated_at,transmission_number&status=eq.published&order=published_at.desc",
    );
  } catch (e) {
    console.warn("[reverb-data] transmissions unavailable:", e.message);
    return [];
  }
}

/** Editable head metadata rows (`reverb.*`, `reverb.<id>.*`, ...). */
export async function fetchMetadata() {
  try {
    const rows = await rest("metadata?select=meta_key,meta_value");
    return Object.fromEntries(rows.map((r) => [r.meta_key, r.meta_value]));
  } catch (e) {
    console.warn("[reverb-data] metadata unavailable:", e.message);
    return {};
  }
}

export const imageUrl = (file) =>
  file ? (/^https?:/.test(file) ? file : `${STORAGE_PROXY}${encodeURIComponent(file)}`) : undefined;

export const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
