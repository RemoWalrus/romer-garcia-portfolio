import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getProxiedData } from "@/utils/proxyHelper";
import { useNavigate, Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import circuitBg from "@/assets/circuit-background.png";

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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [memeData, setMemeData] = useState<MemeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
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

  const renderBackButton = () => {
    return (
      <span className="inline-flex items-baseline">
        <span style={{ fontWeight: 100 }}>← back</span>
        <span style={{ fontWeight: 500 }} className="ml-2">to</span>
        <span style={{ fontWeight: 100 }} className="ml-2">home</span>
      </span>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <ThemeToggle />
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border relative">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {renderBackButton()}
          </Link>
        </div>
      </nav>
      
      {/* Circuit board background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${circuitBg})` }}
      />
      
      {/* Gradient overlay that changes based on color scheme */}
      <div className={`absolute inset-0 bg-gradient-to-b 
        ${isDarkMode 
          ? 'from-black/10 via-black/5 to-transparent mix-blend-multiply'
          : 'from-white/20 via-white/10 to-transparent mix-blend-overlay'
        } z-10`} 
      />
      
      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto font-roc">
              <span className="font-thin">random</span>{" "}
              <span className="font-medium">developer humor</span>{" "}
              <span className="font-thin">from the vault</span>
            </p>
          </div>

          {/* Meme Content */}
          {isLoading ? (
            <div className="bg-card/30 backdrop-blur-sm rounded-lg p-8 border border-border/30">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-foreground/20 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-foreground/20 rounded w-1/2 mx-auto"></div>
                <div className="h-20 bg-foreground/20 rounded"></div>
                <div className="h-16 bg-foreground/20 rounded"></div>
              </div>
            </div>
          ) : memeData ? (
            <div className="bg-card/30 backdrop-blur-sm rounded-lg p-8 border border-border/30 space-y-6 animate-fade-in">
              {/* Meme Text */}
              <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl font-thin text-foreground leading-relaxed font-roc">
                  "{memeData.meme_text}"
                </h2>
                {memeData.attribution && (
                  <p className="text-lg text-muted-foreground italic font-roc font-extralight">
                    — {memeData.attribution}
                  </p>
                )}
              </div>

              {/* Coding Tip */}
              {memeData.coding_tip && (
                <div className="bg-card/50 rounded-lg p-4 border-l-4 border-primary">
                  <h3 className="text-primary font-medium mb-2 font-roc">💡 pro tip</h3>
                  <p className="text-foreground font-roc font-extralight">{memeData.coding_tip}</p>
                </div>
              )}

              {/* Fun Fact */}
              {memeData.fun_fact && (
                <div className="bg-card/50 rounded-lg p-4 border-l-4 border-secondary">
                  <h3 className="text-foreground font-medium mb-2 font-roc">🎯 fun fact</h3>
                  <p className="text-foreground/90 font-roc font-extralight">{memeData.fun_fact}</p>
                </div>
              )}
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={fetchRandomMeme}
              variant="outline"
              className="bg-neutral-100/50 dark:bg-white/10 hover:bg-neutral-200/50 dark:hover:bg-white/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700 font-roc uppercase tracking-wider text-lg font-extralight transition-all duration-300"
              size="lg"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'loading...' : 'another meme'}
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="bg-neutral-100/50 dark:bg-white/10 hover:bg-neutral-200/50 dark:hover:bg-white/20 text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-700 font-roc uppercase tracking-wider text-lg font-extralight transition-all duration-300"
              size="lg"
            >
              back to portfolio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meme;