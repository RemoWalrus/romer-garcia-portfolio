
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroTitle } from './HeroTitle';
import { TitleConfig } from './title-config';
import { glitchVariants } from './animation-variants';
import { useEffect, useState } from 'react';
import { getProxiedData } from "@/utils/proxyHelper";

interface HeroContentProps {
  titles: TitleConfig[];
  titleIndex: number;
  scrollToSection: (sectionId: string) => void;
}

export const HeroContent = ({ titles, titleIndex, scrollToSection }: HeroContentProps) => {
  const [subtitle, setSubtitle] = useState("I create immersive digital experiences that blend storytelling with cutting-edge technology");
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        const data = await getProxiedData('sections', {
          columns: 'description',
          filter: 'section_name:eq:hero'
        });
        
        if (data && data.length > 0) {
          setSubtitle(data[0].description || subtitle);
        }
      } catch (error) {
        console.error('Error fetching hero section:', error);
      }
    };

    fetchHeroSection();
  }, []);

  useEffect(() => {
    setShowSubtitle(false);
    const timer = setTimeout(() => {
      setShowSubtitle(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [titleIndex]);

  return (
    <div className="container relative z-20 px-4 py-32 mx-auto text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={titles[titleIndex].text}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={glitchVariants}
            className="relative mb-8"
          >
            <HeroTitle title={titles[titleIndex]} />
          </motion.div>
        </AnimatePresence>
        
        <div className="h-24 mb-8"> {/* Fixed height container for subtitle */}
          <AnimatePresence mode="wait">
            {showSubtitle && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-roc"
              >
                {subtitle}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

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
