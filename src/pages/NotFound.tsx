
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProxiedStorageUrl } from "@/utils/proxyHelper";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        console.log('Fetching random image for error page...');
        
        // Use a predefined list of image names to randomly select from
        const imageNames = [
          'dualshadow.jpg',
          'evenbrite-cover.jpg', 
          'hautesummer.jpg',
          'militarychild.jpg',
          'remowalrusdiablo.jpg',
          'romergarciacover.jpg',
          'worldzoom.jpg'
        ];

        const randomIndex = Math.floor(Math.random() * imageNames.length);
        const randomImageName = imageNames[randomIndex];
        const imageUrl = getProxiedStorageUrl('images', randomImageName);
        console.log('Selected random image for error page:', imageUrl);
        setBackgroundImage(imageUrl);

      } catch (error) {
        console.error('Error in fetchRandomImage:', error);
        const fallbackUrl = getProxiedStorageUrl('images', 'dualshadow.jpg');
        setBackgroundImage(fallbackUrl);
      }
    };

    fetchRandomImage();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Gradient overlay that changes based on color scheme */}
        <div className={`absolute inset-0 bg-gradient-to-b 
          ${isDarkMode 
            ? 'from-black/10 via-black/5 to-transparent mix-blend-multiply'
            : 'from-white/20 via-white/10 to-transparent mix-blend-overlay'
          } z-10`} 
        />
        
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="Error Page Background" 
            className={`absolute inset-0 w-full h-full object-cover 
              ${isDarkMode ? 'opacity-40' : 'opacity-60'}`}
          />
        )}
      </div>

      {/* Additional gradient overlay like homepage */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] to-transparent via-transparent h-1/2 mix-blend-multiply pointer-events-none z-10" />

      {/* Content */}
      <div className="container relative z-20 px-4 mx-auto text-center">
        <div className="flex flex-col items-center">
          {/* Romer Garcia Title - slightly smaller than homepage */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-roc text-white mb-6 py-2"
            style={{
              textShadow: `
                2px 0 0 rgba(255,0,0,0.3),
                -2px 0 0 rgba(0,255,255,0.3)
              `,
              fontFeatureSettings: '"ss01"'
            }}
          >
            <span className="inline-flex items-baseline">
              <span className="font-medium">romer</span>
              <span className="font-thin text-neutral-200">garcia</span>
            </span>
          </h1>

          {/* Error Code - big and very thick */}
          <h2 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white mb-8 leading-none">
            404
          </h2>

          {/* Error Message */}
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-roc mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>

          {/* Home Button */}
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline" 
            className="group bg-white/20 border-white/20 hover:bg-white/30 text-white text-lg md:text-xl font-roc px-8 py-6 uppercase tracking-wider"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
