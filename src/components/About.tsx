
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AboutSection {
  title: string;
  description: string;
  portfolio_url: string | null;
}

export const About = () => {
  const [portraitUrl, setPortraitUrl] = useState('');
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
            className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-neutral-600/50 flex-shrink-0 bg-neutral-800"
          >
            {portraitUrl && (
              <img 
                src={portraitUrl} 
                alt="Romer Garcia" 
                className="w-full h-full object-cover"
              />
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
                  className="group bg-[#9b87f5] hover:bg-[#8a74f2] text-white border-0 font-roc uppercase tracking-wider text-lg"
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
