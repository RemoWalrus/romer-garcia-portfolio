
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createMaskedUrl } from '@/utils/downloadHelper';

interface Metadata {
  [key: string]: string;
}

export const useMetadata = () => {
  const [metadata, setMetadata] = useState<Metadata>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('metadata')
          .select('meta_key, meta_value');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const metadataObj: Metadata = {};
          
          // Convert array to object with meta_key as property names
          data.forEach(item => {
            // Apply URL masking to image URLs
            let value = item.meta_value;
            
            // If this is an image URL from Supabase, mask it
            if ((item.meta_key.includes('image') || item.meta_key.includes('og_image') || item.meta_key.includes('twitter_image')) 
                && value.includes('supabase.co')) {
              // Extract bucket and file information
              try {
                const url = new URL(value);
                const pathParts = url.pathname.split('/');
                // Format: /storage/v1/object/public/BUCKET_NAME/FILE_PATH
                const bucketIndex = pathParts.indexOf('public') + 1;
                
                if (bucketIndex > 0 && bucketIndex < pathParts.length) {
                  const bucket = pathParts[bucketIndex];
                  // Join the remaining parts to form the fileKey
                  const fileKey = pathParts.slice(bucketIndex + 1).join('/');
                  value = `/api/image?bucket=${bucket}&file=${fileKey}`;
                }
              } catch (e) {
                console.error('Error parsing image URL:', e);
              }
            }
            
            metadataObj[item.meta_key] = value;
          });
          
          setMetadata(metadataObj);
        }
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching metadata'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // Function to update document metadata based on fetched values
  useEffect(() => {
    if (Object.keys(metadata).length > 0) {
      // Update <title> tag
      if (metadata.title) {
        document.title = metadata.title;
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = metadata.title;
        
        const metaTitle = document.getElementById('meta-title');
        if (metaTitle) metaTitle.setAttribute('content', metadata.title);
        
        const ogTitle = document.getElementById('og-title');
        if (ogTitle) ogTitle.setAttribute('content', metadata.title);
        
        const twitterTitle = document.getElementById('twitter-title');
        if (twitterTitle) twitterTitle.setAttribute('content', metadata.title);
      }
      
      // Update description metadata
      if (metadata.description) {
        const metaDesc = document.getElementById('meta-description');
        if (metaDesc) metaDesc.setAttribute('content', metadata.description);
        
        const ogDesc = document.getElementById('og-description');
        if (ogDesc) ogDesc.setAttribute('content', metadata.description);
        
        const twitterDesc = document.getElementById('twitter-description');
        if (twitterDesc) twitterDesc.setAttribute('content', metadata.description);
      }
      
      // Update keywords
      if (metadata.keywords) {
        const metaKeywords = document.getElementById('meta-keywords');
        if (metaKeywords) metaKeywords.setAttribute('content', metadata.keywords);
      }
      
      // Update Open Graph image
      if (metadata.og_image) {
        const ogImage = document.getElementById('og-image');
        if (ogImage) ogImage.setAttribute('content', metadata.og_image);
      }
      
      // Update Twitter image
      if (metadata.twitter_image) {
        const twitterImage = document.getElementById('twitter-image');
        if (twitterImage) twitterImage.setAttribute('content', metadata.twitter_image);
      }
    }
  }, [metadata]);

  return { metadata, isLoading, error };
};
