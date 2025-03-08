
import { supabase } from '@/integrations/supabase/client';

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
