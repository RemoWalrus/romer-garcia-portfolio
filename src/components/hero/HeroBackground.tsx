
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getSafeImageUrl } from '@/utils/downloadHelper';

interface HeroBackgroundProps {
  showVideo: boolean;
  triggerNewBackground: number;
}

export const HeroBackground = ({ showVideo, triggerNewBackground }: HeroBackgroundProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Create a direct link to the video to ensure it works properly
    const fetchVideoUrl = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('graphics')
          .createSignedUrl('staticglitchy.mp4', 3600);
          
        if (data && !error) {
          setVideoUrl(data.signedUrl);
        } else {
          console.error('Error fetching video URL:', error);
          // Fallback to masked URL if direct access fails
          setVideoUrl('/api/video?bucket=graphics&file=staticglitchy.mp4');
        }
      } catch (err) {
        console.error('Error getting video URL:', err);
        setVideoUrl('/api/video?bucket=graphics&file=staticglitchy.mp4');
      }
    };
    
    fetchVideoUrl();
  }, []);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        console.log('Fetching hero images...');
        
        // First try to get all images from the 'images' bucket
        const { data: imageList, error: listError } = await supabase
          .storage
          .from('images')
          .list('');

        if (listError) {
          console.error('Error listing images:', listError);
          // Fallback to default image - but use masked URL
          setBackgroundImage('/api/image?bucket=images&file=dualshadow.jpg');
          return;
        }

        if (!imageList || imageList.length === 0) {
          console.log('No images found, using fallback');
          setBackgroundImage('/api/image?bucket=images&file=dualshadow.jpg');
          return;
        }

        // Select a random image from the list
        const randomIndex = Math.floor(Math.random() * imageList.length);
        const randomImage = imageList[randomIndex];
        
        // Use masked URL instead of direct Supabase URL
        const maskedImageUrl = `/api/image?bucket=images&file=${randomImage.name}`;
        console.log('Selected random image:', maskedImageUrl);
        setBackgroundImage(maskedImageUrl);

      } catch (error) {
        console.error('Error in fetchRandomImage:', error);
        // Fallback to default image in case of any error - but use masked URL
        setBackgroundImage('/api/image?bucket=images&file=dualshadow.jpg');
      }
    };

    fetchRandomImage();
  }, [triggerNewBackground]);

  if (!backgroundImage && !videoUrl) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      {/* Gradient overlay that changes based on color scheme */}
      <div className={`absolute inset-0 bg-gradient-to-b 
        ${isDarkMode 
          ? 'from-black/10 via-black/5 to-transparent mix-blend-multiply'
          : 'from-white/20 via-white/10 to-transparent mix-blend-overlay'
        } z-10`} 
      />
      
      {/* Show both video and image with different opacities based on showVideo state */}
      <div className="relative w-full h-full">
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="Hero Background" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 
              ${showVideo ? 'opacity-0' : isDarkMode ? 'opacity-40' : 'opacity-60'}`}
          />
        )}
        {videoUrl && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 
              ${showVideo ? (isDarkMode ? 'opacity-20' : 'opacity-30') : 'opacity-0'}`}
            src={videoUrl}
          />
        )}
      </div>
    </div>
  );
};
