const SUPABASE_FUNCTIONS_URL = 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1';

// Use relative path on Netlify (production) and Vite dev server, absolute URL elsewhere (Lovable preview)
const isNetlifyOrVite = typeof window !== 'undefined' && (
  window.location.hostname === 'romergarcia.com' ||
  window.location.hostname === 'www.romergarcia.com' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname.endsWith('.netlify.app')
);

export const PROXY_BASE = isNetlifyOrVite ? '/api/download-file' : `${SUPABASE_FUNCTIONS_URL}/download-file`;
const SUPABASE_STORAGE_PREFIX = 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/';

/**
 * Generate a proxy URL for a Supabase storage file.
 * @param bucket - Storage bucket name (images, graphics, projects, profile, etc.)
 * @param file - File path/name within the bucket
 * @param download - If true, forces download instead of inline display
 */
export const getProxyUrl = (bucket: string, file: string, download = false): string => {
  const params = new URLSearchParams();
  params.set('bucket', bucket);
  params.set('file', file);
  if (download) params.set('download', 'true');
  return `${PROXY_BASE}?${params.toString()}`;
};

/**
 * Converts a direct Supabase storage URL to a proxied URL.
 * Useful for dynamic URLs returned from the database.
 */
export const toProxyUrl = (url: string, download = false): string => {
  if (!url || !url.startsWith(SUPABASE_STORAGE_PREFIX)) {
    return url;
  }
  const parsed = parseSupabaseUrl(url);
  if (!parsed) return url;
  return getProxyUrl(parsed.bucket, parsed.file, download);
};

/**
 * Extract bucket and file from a direct Supabase storage URL.
 * Example: '.../storage/v1/object/public/images/photo.jpg'
 * Returns: { bucket: 'images', file: 'photo.jpg' }
 */
export const parseSupabaseUrl = (supabaseUrl: string): { bucket: string; file: string } | null => {
  const match = supabaseUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (match) {
    let file = match[2];
    // Handle double-slash case (e.g. "projects//Hairwars16.jpg")
    if (file.startsWith('/')) file = file.slice(1);
    return { bucket: match[1], file };
  }
  return null;
};
