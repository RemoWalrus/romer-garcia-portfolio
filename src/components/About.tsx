
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';

interface AboutSection {
  title: string;
  description: string;
  portfolio_url: string | null;
}

interface TriviaFact {
  fact: string;
}

export const About = () => {
  const [portraitUrl, setPortraitUrl] = useState('');
  const [showTrivia, setShowTrivia] = useState(false);
  const [triviaFact, setTriviaFact] = useState<string>('');
  const [aboutData, setAboutData] = useState<AboutSection>({
    title: 'ABOUT ME',
    description: '',
    portfolio_url: null
  });

  useEffect(() => {
    const { data } = supabase.storage
      .from('graphics')
      .getPublicUrl('RomerSelfPortrait.jpg');
    
    if (data) {
      setPortraitUrl(data.publicUrl);
    }

    // Get portfolio PDF URL
    const portfolioData = supabase.storage
      .from('graphics')
      .getPublicUrl('portfolio.pdf');
    
    if (portfolioData.data) {
      setAboutData(prev => ({
        ...prev,
        portfolio_url: portfolioData.data.publicUrl
      }));
    }
  }, []);

  useEffect(() => {
    const fetchAboutSection = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('title, description, portfolio_url')
        .eq('section_name', 'about')
        .single();
      
      if (data && !error) {
        setAboutData(data);
      } else {
        console.error('Error fetching about section:', error);
      }
    };

    fetchAboutSection();
  }, []);

  const handleEyeClick = async () => {
    if (!showTrivia) {
      // Get count first
      const { count } = await supabase
        .from('trivia_facts')
        .select('*', { count: 'exact', head: true });

      if (count) {
        // Get random fact using the count
        const randomId = Math.floor(Math.random() * count) + 1;
        const { data, error } = await supabase
          .from('trivia_facts')
          .select('fact')
          .eq('id', randomId)
          .maybeSingle();

        if (data && !error) {
          setTriviaFact(data.fact);
          setShowTrivia(true);
          setTimeout(() => setShowTrivia(false), 5000); // Hide after 5 seconds
        }
      }
    }
  };

  return (
    <section id="about" className="relative bg-neutral-900 py-32 overflow-hidden">
      {/* Pixelated Noise Effect */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          filter: 'contrast(170%) brightness(170%)',
        }}
      />

      {/* Chromatic Aberration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 mix-blend-multiply opacity-20" style={{ backgroundColor: '#ff0000', transform: 'translate(-2px, 0)' }} />
        <div className="absolute inset-0 mix-blend-multiply opacity-20" style={{ backgroundColor: '#00ff00', transform: 'translate(2px, 0)' }} />
        <div className="absolute inset-0 mix-blend-multiply opacity-20" style={{ backgroundColor: '#0000ff', transform: 'translate(0, 2px)' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-white mb-12 text-center"
        >
          {aboutData.title}
        </motion.h2>
        
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-neutral-600/50 flex-shrink-0 bg-neutral-800 relative"
          >
            {portraitUrl && (
              <>
                <img 
                  src={portraitUrl} 
                  alt="Romer Garcia" 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleEyeClick}
                  className="absolute top-[30%] left-1/2 w-8 h-8 transform -translate-x-1/2 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  aria-label="Click for a surprise"
                >
                  <div className="w-full h-full rounded-full border-2 border-white/50 hover:border-white/80 transition-colors" />
                </button>
                <AnimatePresence>
                  {showTrivia && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute top-[-80px] left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-lg shadow-xl w-64"
                      style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 55% 75%, 50% 100%, 45% 75%, 0% 75%)"
                      }}
                    >
                      <p className="text-sm text-center pb-4">{triviaFact}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
          
          <div className="flex-1">
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-neutral-300 font-['Arial'] leading-relaxed text-center md:text-left mb-8"
            >
              {aboutData.description}
            </motion.p>

            {aboutData.portfolio_url && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center md:text-left"
              >
                <Button 
                  variant="outline"
                  className="group bg-white/10 hover:bg-white/20 text-white border-0 font-roc uppercase tracking-wider text-lg font-extralight transition-all duration-300"
                  onClick={() => window.open(aboutData.portfolio_url || '', '_blank')}
                >
                  Download Portfolio
                  <DownloadIcon className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
