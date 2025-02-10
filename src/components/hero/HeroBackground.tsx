
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface HeroBackgroundProps {
  showVideo: boolean;
}

export const HeroBackground = ({ showVideo }: HeroBackgroundProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const videoUrl = supabase.storage.from('graphics').getPublicUrl('staticglitchy.mp4').data.publicUrl;

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        // Get the specific background image
        const imageUrl = supabase.storage.from('images').getPublicUrl('romergarciacover.jpg').data.publicUrl;
        setBackgroundImage(imageUrl);
      } catch (error) {
        console.error('Error fetching background image:', error);
        // Fallback image if the specified one isn't available
        const fallbackUrl = supabase.storage.from('images').getPublicUrl('dualshadow.jpg').data.publicUrl;
        setBackgroundImage(fallbackUrl);
      }
    };

    fetchBackground();
  }, []);

  return (
    <div className="absolute inset-0">
      {/* Updated gradient to be more transparent at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950/10 z-10" />
      
      {/* Thicker scanline effect with increased opacity */}
      <div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-40">
        <div className="absolute inset-0 animate-scanline" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 4px)',
          backgroundSize: '100% 8px',
        }} />
      </div>

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
