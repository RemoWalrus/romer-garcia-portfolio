const PROXY_BASE = 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/download-file';
const SUPABASE_STORAGE_PREFIX = 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/';

/**
 * Constructs a proxy URL for Supabase storage files.
 * Routes all storage requests through the download-file edge function
 * so the domain shown to users is romergarcia.com instead of supabase.co.
 *
 * @param bucket - The storage bucket name (e.g. 'images', 'graphics', 'profile')
 * @param file - The file path within the bucket
 * @param download - If true, adds download=true param for PDFs/attachments
 */
export const getProxyUrl = (bucket: string, file: string, download = false): string => {
  const params = new URLSearchParams({ bucket, file });
  if (download) {
    params.set('download', 'true');
  }
  return `${PROXY_BASE}?${params.toString()}`;
};

/**
 * Converts a direct Supabase storage URL to a proxied URL.
 * Useful for dynamic URLs returned from the database.
 *
 * @param url - A direct Supabase storage public URL
 * @param download - If true, adds download=true param
 * @returns The proxied URL, or the original URL if it doesn't match
 */
export const toProxyUrl = (url: string, download = false): string => {
  if (!url || !url.startsWith(SUPABASE_STORAGE_PREFIX)) {
    return url;
  }
  const path = url.slice(SUPABASE_STORAGE_PREFIX.length);
  const slashIndex = path.indexOf('/');
  if (slashIndex === -1) return url;

  const bucket = path.slice(0, slashIndex);
  let file = path.slice(slashIndex + 1);
  if (file.startsWith('/')) {
    file = file.slice(1);
  }

  return getProxyUrl(bucket, file, download);
};
