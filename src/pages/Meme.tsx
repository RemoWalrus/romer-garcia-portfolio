import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getProxiedStorageUrl, getProxiedData } from "@/utils/proxyHelper";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MemeData {
  id: number;
  meme_text: string;
  attribution: string;
  coding_tip: string;
  fun_fact: string;
  is_active: boolean;
}

const Meme = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [memeData, setMemeData] = useState<MemeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        console.log('Fetching random image for meme page...');
        
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
        console.log('Selected random image for meme page:', imageUrl);
        setBackgroundImage(imageUrl);

      } catch (error) {
        console.error('Error in fetchRandomImage:', error);
        const fallbackUrl = getProxiedStorageUrl('images', 'dualshadow.jpg');
        setBackgroundImage(fallbackUrl);
      }
    };

    fetchRandomImage();
  }, []);

  const fetchRandomMeme = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching random meme...');
      
      const memes = await getProxiedData('daily_memes', {
        columns: 'id,meme_text,attribution,coding_tip,fun_fact,is_active'
      });
      
      if (memes && memes.length > 0) {
        // Select a random meme from all memes (not just active ones)
        const randomIndex = Math.floor(Math.random() * memes.length);
        setMemeData(memes[randomIndex]);
        console.log('Selected random meme:', memes[randomIndex]);
      } else {
        // Fallback meme if database is empty
        setMemeData({
          id: 0,
          meme_text: "Hello World!",
          attribution: "The eternal first program greeting",
          coding_tip: "Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.",
          fun_fact: "The first \"Hello, World!\" program appeared in 1972 in a Bell Labs memo by Brian Kernighan.",
          is_active: false
        });
      }
    } catch (error) {
      console.error('Error fetching random meme:', error);
      // Fallback meme on error
      setMemeData({
        id: 0,
        meme_text: "404: Humor not found",
        attribution: "Classic HTTP error with a twist",
        coding_tip: "Debugging is twice as hard as writing the code in the first place.",
        fun_fact: "The HTTP 404 error was named after room 404 at CERN where the web was invented... just kidding, that's a myth!",
        is_active: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMeme();
  }, []);

  if (!backgroundImage) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <ThemeToggle />
      {/* Gradient overlay that changes based on color scheme */}
      <div className={`absolute inset-0 bg-gradient-to-b 
        ${isDarkMode 
          ? 'from-black/10 via-black/5 to-transparent mix-blend-multiply'
          : 'from-white/20 via-white/10 to-transparent mix-blend-overlay'
        } z-10`} 
      />
      
      {/* Background image */}
      {backgroundImage && (
        <img 
          src={backgroundImage} 
          alt="Meme Background" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 
            ${isDarkMode ? 'opacity-40' : 'opacity-60'}`}
        />
      )}
      
      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Random developer humor from the vault
            </p>
          </div>

          {/* Meme Content */}
          {isLoading ? (
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-white/20 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
                <div className="h-20 bg-white/20 rounded"></div>
                <div className="h-16 bg-white/20 rounded"></div>
              </div>
            </div>
          ) : memeData ? (
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 border border-white/10 space-y-6 animate-fade-in">
              {/* Meme Text */}
              <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-relaxed">
                  "{memeData.meme_text}"
                </h2>
                {memeData.attribution && (
                  <p className="text-lg text-white/70 italic">
                    — {memeData.attribution}
                  </p>
                )}
              </div>

              {/* Coding Tip */}
              {memeData.coding_tip && (
                <div className="bg-white/10 rounded-lg p-4 border-l-4 border-primary">
                  <h3 className="text-primary font-semibold mb-2">💡 Pro Tip</h3>
                  <p className="text-white/90">{memeData.coding_tip}</p>
                </div>
              )}

              {/* Fun Fact */}
              {memeData.fun_fact && (
                <div className="bg-white/10 rounded-lg p-4 border-l-4 border-secondary">
                  <h3 className="text-secondary font-semibold mb-2">🎯 Fun Fact</h3>
                  <p className="text-white/90">{memeData.fun_fact}</p>
                </div>
              )}
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={fetchRandomMeme}
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-300 hover-scale"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Another Meme'}
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-transparent text-white border-white/30 hover:bg-white/10 transition-all duration-300 hover-scale"
            >
              Back to Portfolio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meme;