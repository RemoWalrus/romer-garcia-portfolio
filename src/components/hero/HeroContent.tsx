
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroTitle } from './HeroTitle';
import { TitleConfig } from './title-config';
import { glitchVariants } from './animation-variants';
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface HeroContentProps {
  titles: TitleConfig[];
  titleIndex: number;
  scrollToSection: (sectionId: string) => void;
}

export const HeroContent = ({ titles, titleIndex, scrollToSection }: HeroContentProps) => {
  const [subtitle, setSubtitle] = useState("I create immersive digital experiences that blend storytelling with cutting-edge technology");

  useEffect(() => {
    const fetchHeroSection = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('description')
        .eq('section_name', 'hero')
        .single();
      
      if (data && !error) {
        setSubtitle(data.description || subtitle);
      } else {
        console.error('Error fetching hero section:', error);
      }
    };

    fetchHeroSection();
  }, []);

  return (
    <div className="container relative z-20 px-4 py-32 mx-auto text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={titles[titleIndex].text}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={glitchVariants}
            className="relative"
          >
            <HeroTitle title={titles[titleIndex]} />
          </motion.div>
        </AnimatePresence>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-12 font-roc"
        >
          {subtitle}
        </motion.p>

        <Button 
          onClick={() => scrollToSection('portfolio')}
          variant="outline" 
          className="group bg-white/20 border-white/20 hover:bg-white/30 text-white text-lg md:text-xl font-roc px-8 py-6 uppercase tracking-wider"
        >
          View My Work
          <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </Button>
      </motion.div>
    </div>
  );
};

