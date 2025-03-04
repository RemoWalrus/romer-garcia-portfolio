
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { handleDownload, maskSupabaseUrl } from '@/utils/downloadHelper';

interface AboutSection {
  title: string;
  description: string;
  portfolio_url: string | null;
  button_text: string;
}

export const About = () => {
  const [portraitUrl, setPortraitUrl] = useState('');
  const [aboutData, setAboutData] = useState<AboutSection>({
    title: 'ABOUT ME',
    description: '',
    portfolio_url: null,
    button_text: 'Download Portfolio'
  });

  useEffect(() => {
    const { data } = supabase.storage
      .from('profile')
      .getPublicUrl('RomerSelfPortrait.jpg');
    
    if (data) {
      setPortraitUrl(maskSupabaseUrl(data.publicUrl));
    }

    const portfolioData = supabase.storage
      .from('profile')
      .getPublicUrl('portfolio.pdf');
    
    if (portfolioData.data) {
      setAboutData(prev => ({
        ...prev,
        portfolio_url: maskSupabaseUrl(portfolioData.data.publicUrl)
      }));
    }
  }, []);

  useEffect(() => {
    const fetchAboutSection = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('title, description, portfolio_url, button_text')
        .eq('section_name', 'about')
        .single();
      
      if (data && !error) {
        // Mask the portfolio URL if it comes from the database
        const maskedPortfolioUrl = data.portfolio_url ? maskSupabaseUrl(data.portfolio_url) : null;
        
        setAboutData({
          ...data,
          portfolio_url: maskedPortfolioUrl
        });
      } else {
        console.error('Error fetching about section:', error);
      }
    };

    fetchAboutSection();
  }, []);

  const handlePortfolioDownload = async () => {
    if (aboutData.portfolio_url) {
      await handleDownload(aboutData.portfolio_url);
    }
  };

  return (
    <section id="about" className="relative bg-white dark:bg-neutral-900 py-32 overflow-hidden isolate">
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015] bg-red-500 translate-x-[1px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-blue-500 -translate-x-[1px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-neutral-900 dark:text-white mb-12 text-center"
        >
          {aboutData.title}
        </motion.h2>
        
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-neutral-200 dark:border-neutral-600/50 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800"
          >
            {portraitUrl && (
              <img 
                src={portraitUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
          
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 font-['Arial'] leading-relaxed text-center md:text-left mb-8"
            >
              {aboutData.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </motion.div>

            {aboutData.portfolio_url && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center md:text-left"
              >
                <Button 
                  variant="outline"
                  className="group bg-neutral-100/50 dark:bg-white/10 hover:bg-neutral-200/50 dark:hover:bg-white/20 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 font-roc uppercase tracking-wider text-lg font-extralight transition-all duration-300"
                  onClick={handlePortfolioDownload}
                >
                  {aboutData.button_text}
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
