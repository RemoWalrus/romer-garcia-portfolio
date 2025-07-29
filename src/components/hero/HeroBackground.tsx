
import { useEffect, useState } from 'react';
import { getProxiedStorageUrl } from "@/utils/proxyHelper";

interface HeroBackgroundProps {
  showVideo: boolean;
  triggerNewBackground: number;
}

export const HeroBackground = ({ showVideo, triggerNewBackground }: HeroBackgroundProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [videoUrl] = useState<string>(getProxiedStorageUrl('graphics', 'staticglitchy.mp4'));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        console.log('Fetching hero images...');
        
        // For now, use a predefined list of image names to randomly select from
        const imageNames = [
          'dualshadow.jpg',
          'evenbrite-cover.jpg', 
          'hautesummer.jpg',
          'militarychild.jpg',
          'remowalrusdiablo.jpg',
          'romergarciacover.jpg',
          'worldzoom.jpg'
        ];

        // Select a random image from the list
        const randomIndex = Math.floor(Math.random() * imageNames.length);
        const randomImageName = imageNames[randomIndex];
        const imageUrl = getProxiedStorageUrl('images', randomImageName);
        console.log('Selected random image:', imageUrl);
        setBackgroundImage(imageUrl);

      } catch (error) {
        console.error('Error in fetchRandomImage:', error);
        // Fallback to default image in case of any error
        const fallbackUrl = getProxiedStorageUrl('images', 'dualshadow.jpg');
        setBackgroundImage(fallbackUrl);
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
