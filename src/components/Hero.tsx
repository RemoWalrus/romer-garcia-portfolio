
import { ArrowDown } from 'lucide-react';
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from 'react';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
  const [titleIndex, setTitleIndex] = useState(0);
  
  const titles = [
    "Multimedia Artist",
    "Illustrator",
    "Photographer",
    "Video Editor",
    "Five Tool Player",
    "Art Director",
    "Web Master",
    "Social Media Manager",
    "romergarcia"
  ];

  const backgroundImageUrl = supabase.storage.from('graphics').getPublicUrl('dualshadow.jpg').data.publicUrl;

  useEffect(() => {
    if (titleIndex < titles.length - 1) {
      const timer = setTimeout(() => {
        setTitleIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  const glitchVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(0px)",
      x: 0,
    },
    animate: {
      opacity: 1,
      scale: [0.98, 1.01, 0.99, 1],
      filter: [
        "blur(0px) brightness(100%) contrast(100%)",
        "blur(2px) brightness(150%) contrast(90%) hue-rotate(2deg)",
        "blur(0px) brightness(100%) contrast(100%)",
        "blur(1px) brightness(120%) contrast(95%) hue-rotate(-2deg)",
        "blur(0px) brightness(100%) contrast(100%)"
      ],
      x: [0, -2, 2, -1, 1, 0],
      transition: {
        duration: 0.4,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeInOut",
        staggerChildren: 0.05,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      filter: [
        "blur(0px) brightness(100%) contrast(100%)",
        "blur(3px) brightness(200%) contrast(80%) hue-rotate(5deg)",
        "blur(0px) brightness(100%) contrast(100%)"
      ],
      x: [0, 2, -2, 1, -1, 0],
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    }
  };

  const pixelGlitch: Variants = {
    initial: { 
      clipPath: "inset(0 0 0 0)" 
    },
    animate: {
      clipPath: [
        "inset(0 0 0 0)",
        "inset(10% 15% 25% 5%)",
        "inset(25% 5% 15% 10%)",
        "inset(15% 25% 5% 20%)",
        "inset(5% 10% 20% 15%)",
        "inset(0 0 0 0)"
      ],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        repeat: 1,
        repeatType: "reverse",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950/20 z-10" />
        <img 
          src={backgroundImageUrl} 
          alt="Background" 
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="container relative z-20 px-4 py-32 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={titles[titleIndex]}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={glitchVariants}
              className="relative"
            >
              <motion.h1
                variants={pixelGlitch}
                className="text-5xl md:text-6xl lg:text-8xl font-roc text-white mb-8"
                style={{
                  textShadow: `
                    2px 0 0 rgba(255,0,0,0.3),
                    -2px 0 0 rgba(0,255,255,0.3)
                  `,
                  fontFeatureSettings: '"ss01"'
                }}
              >
                {titles[titleIndex] === "romergarcia" ? (
                  <span>
                    <span className="font-medium">romer</span>
                    <span className="font-thin">garcia</span>
                  </span>
                ) : (
                  <span className="font-roc">{titles[titleIndex]}</span>
                )}
              </motion.h1>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  mixBlendMode: "difference",
                  textShadow: "none"
                }}
                animate={{
                  clipPath: [
                    "inset(50% 0 50% 0)",
                    "inset(0% 0 0% 0)",
                    "inset(50% 0 50% 0)"
                  ],
                  transition: {
                    duration: 0.4,
                    ease: "easeInOut",
                    times: [0, 0.5, 1],
                    repeat: 1,
                    repeatType: "reverse"
                  }
                }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-roc text-white mb-8">
                  {titles[titleIndex] === "romergarcia" ? (
                    <span>
                      <span className="font-medium">romer</span>
                      <span className="font-thin">garcia</span>
                    </span>
                  ) : (
                    <span className="font-roc">{titles[titleIndex]}</span>
                  )}
                </h1>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-12 font-roc">
            I create immersive digital experiences that blend storytelling with cutting-edge technology
          </p>

          <Button 
            onClick={() => scrollToSection('portfolio')}
            variant="outline" 
            className="group bg-white/20 border-white/20 hover:bg-white/30 text-white text-lg md:text-xl font-roc"
          >
            View My Work
            <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
