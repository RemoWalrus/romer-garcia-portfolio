
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a masked URL for downloads using the website's domain
 * @param fileKey - The file key in the storage bucket
 * @param bucket - The storage bucket name
 * @returns A masked URL with the website's domain
 */
export const createMaskedUrl = (fileKey: string, bucket: string): string => {
  return `/api/download?file=${encodeURIComponent(fileKey)}&bucket=${encodeURIComponent(bucket)}`;
};

/**
 * Gets a direct download URL from Supabase storage
 * @param fileKey - The file key in the storage bucket
 * @param bucket - The storage bucket name
 * @returns A signed URL valid for 1 hour
 */
export const getDownloadUrl = async (fileKey: string, bucket: string): Promise<string> => {
  try {
    // In development or client-side only environments, we'll get the URL directly
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileKey, 3600); // URL valid for 1 hour
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw new Error('Failed to generate download link');
    }
    
    if (!data || !data.signedUrl) {
      throw new Error('File not found');
    }
    
    return data.signedUrl;
  } catch (err) {
    console.error('Download helper error:', err);
    throw err;
  }
};

/**
 * Extracts the file key and bucket from a Supabase public URL
 * @param supabaseUrl - The Supabase public URL
 * @returns An object containing the file key and bucket name
 */
export const extractFileInfoFromUrl = (supabaseUrl: string): { fileKey: string, bucket: string } | null => {
  try {
    // Format: https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/bucket-name/file-key
    const urlObj = new URL(supabaseUrl);
    const pathParts = urlObj.pathname.split('/');
    
    // Looking for pattern: /storage/v1/object/public/{bucketName}/{fileKey}
    const publicIndex = pathParts.findIndex(part => part === 'public');
    
    if (publicIndex !== -1 && pathParts.length > publicIndex + 2) {
      const bucket = pathParts[publicIndex + 1];
      const fileKey = pathParts.slice(publicIndex + 2).join('/');
      
      return { fileKey, bucket };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse Supabase URL:', error);
    return null;
  }
};

/**
 * Handles downloading a file from either a masked URL or a direct Supabase URL
 * @param url - Either a masked URL or a direct Supabase URL
 */
export const handleDownload = async (url: string) => {
  try {
    if (!url) return;
    
    // If it's our domain-masked URL
    if (url.startsWith('/api/download')) {
      const params = new URLSearchParams(url.split('?')[1]);
      const fileKey = params.get('file');
      const bucket = params.get('bucket');
      
      if (!fileKey || !bucket) {
        throw new Error('Invalid download URL');
      }
      
      // Get the actual download URL
      const downloadUrl = await getDownloadUrl(fileKey, bucket);
      
      // Open the URL in a new tab
      window.open(downloadUrl, '_blank');
    } 
    // If it's a direct Supabase URL, convert it to a masked URL first
    else if (url.includes('supabase.co/storage')) {
      const fileInfo = extractFileInfoFromUrl(url);
      
      if (fileInfo) {
        const maskedUrl = createMaskedUrl(fileInfo.fileKey, fileInfo.bucket);
        await handleDownload(maskedUrl);
      } else {
        // Fallback to opening directly if we can't parse it
        window.open(url, '_blank');
      }
    } 
    // For any other URL
    else {
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error('Download error:', error);
  }
};

/**
 * Masks a Supabase URL with the website's domain if it's a Supabase storage URL
 * @param url - The URL to potentially mask
 * @returns A masked URL or the original URL if not from Supabase
 */
export const maskSupabaseUrl = (url: string): string => {
  if (!url || !url.includes('supabase.co/storage')) {
    return url;
  }
  
  const fileInfo = extractFileInfoFromUrl(url);
  if (fileInfo) {
    return createMaskedUrl(fileInfo.fileKey, fileInfo.bucket);
  }
  
  return url;
};
