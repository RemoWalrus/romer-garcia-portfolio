
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface HeroBackgroundProps {
  showVideo: boolean;
}

export const HeroBackground = ({ showVideo }: HeroBackgroundProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const videoUrl = supabase.storage.from('graphics').getPublicUrl('staticglitchy.mp4').data.publicUrl;

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        console.log('Fetching hero images...');
        const { data: imageList, error } = await supabase
          .storage
          .from('images')
          .list('hero', {
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching hero images:', error);
          return;
        }

        if (imageList && imageList.length > 0) {
          // Get a random image from the list
          const randomIndex = Math.floor(Math.random() * imageList.length);
          const randomImage = imageList[randomIndex];
          const imageUrl = supabase.storage.from('images').getPublicUrl(`hero/${randomImage.name}`).data.publicUrl;
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
  }, []);

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950/20 z-10" />
      
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-10">
        <div className="absolute inset-0 animate-scanline" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 2px)',
          backgroundSize: '100% 4px',
        }} />
      </div>

      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
          src={videoUrl}
        />
      ) : backgroundImage && (
        <img 
          src={backgroundImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-40"
        />
      )}
    </div>
  );
};
