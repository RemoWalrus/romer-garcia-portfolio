
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from 'react';
import { glitchVariants } from './hero/animation-variants';
import { titles } from './hero/title-config';
import { HeroTitle } from './hero/HeroTitle';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [showVideo, setShowVideo] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const videoUrl = supabase.storage.from('graphics').getPublicUrl('staticglitchy.mp4').data.publicUrl;

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        console.log('Fetching hero images...');
        const { data: imageList, error } = await supabase
          .storage
          .from('images')
          .list('hero', {
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching hero images:', error);
          return;
        }

        console.log('Found images:', imageList);

        if (imageList && imageList.length > 0) {
          const imageUrls = imageList.map(file => {
            const url = supabase.storage.from('images').getPublicUrl(`hero/${file.name}`).data.publicUrl;
            console.log('Generated URL:', url);
            return url;
          });
          setHeroImages(imageUrls);
        } else {
          console.log('No images found, using fallback');
          const fallbackUrl = supabase.storage.from('images').getPublicUrl('dualshadow.jpg').data.publicUrl;
          setHeroImages([fallbackUrl]);
        }
      } catch (error) {
        console.error('Error in fetchHeroImages:', error);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (titleIndex === titles.length - 1) {
      const timer = setTimeout(() => {
        setShowVideo(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  useEffect(() => {
    if (titleIndex < titles.length - 1) {
      const timer = setTimeout(() => {
        setTitleIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  useEffect(() => {
    if (!showVideo && heroImages.length > 1) {
      console.log('Starting carousel with images:', heroImages);
      const glitchTimer = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % heroImages.length;
            console.log('Updating image index from', prevIndex, 'to', nextIndex);
            return nextIndex;
          });
          setTimeout(() => {
            setIsGlitching(false);
          }, 150);
        }, 150);
      }, 5000);

      return () => clearInterval(glitchTimer);
    }
  }, [showVideo, heroImages.length]);

  const glitchTransitionVariants = {
    initial: { opacity: 1 },
    glitch: {
      opacity: 1,
      filter: [
        'none',
        'url(#glitch)',
        'none',
        'url(#glitch)',
        'none'
      ],
      x: [0, -10, 5, -5, 0],
      y: [0, 5, -10, 5, 0],
      transition: {
        duration: 0.3,
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    },
    exit: { 
      opacity: 0,
      filter: 'url(#glitch)',
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950/20 z-10" />
        {showVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
            src={videoUrl}
          />
        ) : (
          <>
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <defs>
                <filter id="glitch">
                  <feColorMatrix
                    type="matrix"
                    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="r"
                  />
                  <feOffset in="r" result="r" dx="-2" dy="3">
                    <animate attributeName="dx" values="-2;2;-2" dur="0.1s" repeatCount="indefinite"/>
                  </feOffset>
                  <feColorMatrix
                    type="matrix"
                    in="SourceGraphic"
                    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                    result="g"
                  />
                  <feOffset in="g" result="g" dx="2" dy="-3">
                    <animate attributeName="dx" values="2;-2;2" dur="0.1s" repeatCount="indefinite"/>
                  </feOffset>
                  <feColorMatrix
                    type="matrix"
                    in="SourceGraphic"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                    result="b"
                  />
                  <feOffset in="b" result="b" dx="2" dy="3">
                    <animate attributeName="dy" values="3;-3;3" dur="0.1s" repeatCount="indefinite"/>
                  </feOffset>
                  <feBlend in="r" in2="g" mode="screen" result="rg"/>
                  <feBlend in="rg" in2="b" mode="screen" result="rgb"/>
                </filter>
              </defs>
            </svg>
            <AnimatePresence mode="wait">
              <motion.img 
                key={heroImages[currentImageIndex]}
                src={heroImages[currentImageIndex]} 
                alt="Background" 
                className="w-full h-full object-cover opacity-40"
                initial="initial"
                animate={isGlitching ? "glitch" : "initial"}
                exit="exit"
                variants={glitchTransitionVariants}
              />
            </AnimatePresence>
          </>
        )}
      </div>
      
      <div className="container relative z-20 px-4 py-32 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
          
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-12 font-roc">
            I create immersive digital experiences that blend storytelling with cutting-edge technology
          </p>

          <Button 
            onClick={() => scrollToSection('portfolio')}
            variant="outline" 
            className="group bg-white/20 border-white/20 hover:bg-white/30 text-white text-lg md:text-xl font-roc px-8 py-6"
          >
            View My Work
            <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
