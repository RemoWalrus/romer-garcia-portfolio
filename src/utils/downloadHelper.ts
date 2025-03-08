
import { supabase } from '@/integrations/supabase/client';

// Function to create domain-masked URLs that hide Supabase references
export const createMaskedUrl = (fileKey: string, bucket: string): string => {
  // Create a domain-masked URL format that doesn't expose Supabase
  return `/api/download?file=${encodeURIComponent(fileKey)}&bucket=${encodeURIComponent(bucket)}`;
};

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

export const getMaskedImageUrl = (bucket: string, fileKey: string): string => {
  // Return a domain-masked URL for images
  // This will be used for display purposes
  return `/api/image?bucket=${encodeURIComponent(bucket)}&file=${encodeURIComponent(fileKey)}`;
};

export const getPublicUrl = (bucket: string, fileKey: string): string => {
  // Create a masked URL to hide the Supabase origin
  return createMaskedUrl(fileKey, bucket);
};

export const handleDownload = async (maskedUrl: string) => {
  try {
    if (!maskedUrl) return;
    
    // If it's our domain-masked URL
    if (maskedUrl.startsWith('/api/download')) {
      const params = new URLSearchParams(maskedUrl.split('?')[1]);
      const fileKey = params.get('file');
      const bucket = params.get('bucket');
      
      if (!fileKey || !bucket) {
        throw new Error('Invalid download URL');
      }
      
      // Get the actual download URL
      const downloadUrl = await getDownloadUrl(fileKey, bucket);
      
      // Open the URL in a new tab
      window.open(downloadUrl, '_blank');
    } else {
      // If it's already a direct URL
      window.open(maskedUrl, '_blank');
    }
  } catch (error) {
    console.error('Download error:', error);
  }
};

// Function to safely get image URL without exposing Supabase
export const getSafeImageUrl = (imageUrl: string | null): string => {
  if (!imageUrl) return '';
  
  // If it's already a relative URL (already masked), return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // If it contains Supabase URL, convert to masked URL
  if (imageUrl.includes('supabase.co')) {
    try {
      // Extract bucket and file path from Supabase URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      // Format: /storage/v1/object/public/BUCKET_NAME/FILE_PATH
      const bucketIndex = pathParts.indexOf('public') + 1;
      
      if (bucketIndex > 0 && bucketIndex < pathParts.length) {
        const bucket = pathParts[bucketIndex];
        // Join the remaining parts to form the fileKey
        const fileKey = pathParts.slice(bucketIndex + 1).join('/');
        return createMaskedUrl(fileKey, bucket);
      }
    } catch (e) {
      console.error('Error parsing Supabase URL:', e);
    }
  }
  
  // Return original if we couldn't mask it
  return imageUrl;
};
