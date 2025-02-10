
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface HeroBackgroundProps {
  showVideo: boolean;
  triggerNewBackground: number;
}

export const HeroBackground = ({ showVideo, triggerNewBackground }: HeroBackgroundProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const videoUrl = supabase.storage.from('graphics').getPublicUrl('staticglitchy.mp4').data.publicUrl;

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        console.log('Fetching hero images...');
        const { data: imageList, error } = await supabase
          .storage
          .from('images')
          .list('', {
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching hero images:', error);
          return;
        }

        if (imageList && imageList.length > 0) {
          const randomIndex = Math.floor(Math.random() * imageList.length);
          const randomImage = imageList[randomIndex];
          const imageUrl = supabase.storage.from('images').getPublicUrl(randomImage.name).data.publicUrl;
          console.log('Selected random image:', imageUrl);
          setBackgroundImage(imageUrl);
        } else {
          console.log('No images found, using fallback');
          const fallbackUrl = supabase.storage.from('images').getPublicUrl('dualshadow.jpg').data.publicUrl;
          setBackgroundImage(fallbackUrl);
        }
      } catch (error) {
        console.error('Error in fetchRandomImage:', error);
      }
    };

    fetchRandomImage();
  }, [triggerNewBackground]);

  return (
    <div className="absolute inset-0">
      {/* Subtle gradient overlay that fades to transparent */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent z-10" />
      
      {/* Show both video and image with different opacities based on showVideo state */}
      <div className="relative w-full h-full">
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="Hero Background" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-40'}`}
          />
        )}
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-20' : 'opacity-0'}`}
          src={videoUrl}
        />
      </div>
    </div>
  );
};
