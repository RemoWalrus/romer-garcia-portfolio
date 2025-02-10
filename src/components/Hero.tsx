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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  
  const titles = [
    { text: "Multimedia Artist", weights: ["font-thin", "font-bold"] },
    { text: "Illustrator", weights: ["font-thin"] },
    { text: "Photographer", weights: ["font-thin"] },
    { text: "Video Editor", weights: ["font-thin", "font-bold"] },
    { text: "Five Tool Player", weights: ["font-thin", "font-medium", "font-bold"] },
    { text: "Art Director", weights: ["font-thin", "font-bold"] },
    { text: "Web Master", weights: ["font-thin", "font-bold"] },
    { text: "Social Media Manager", weights: ["font-thin", "font-medium", "font-bold"] },
    { text: "romergarcia", weights: ["font-medium", "font-thin"] } // Special case
  ];

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data: imageList, error } = await supabase
        .storage
        .from('images')
        .list('hero');

      if (error) {
        console.error('Error fetching hero images:', error);
        return;
      }

      if (imageList && imageList.length > 0) {
        const imageUrls = imageList.map(file => 
          supabase.storage.from('images').getPublicUrl(`hero/${file.name}`).data.publicUrl
        );
        setHeroImages(imageUrls);
      } else {
        // Fallback to the original image if no images in the hero folder
        const fallbackUrl = supabase.storage.from('images').getPublicUrl('dualshadow.jpg').data.publicUrl;
        setHeroImages([fallbackUrl]);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (titleIndex < titles.length - 1) {
      const timer = setTimeout(() => {
        setTitleIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  useEffect(() => {
    if (heroImages.length > 1) {
      const imageTimer = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(imageTimer);
    }
  }, [heroImages]);

  useEffect(() => {
    const updateFavicon = async () => {
      const { data: faviconData } = supabase.storage
        .from('images')
        .getPublicUrl('favicon.ico');
      
      if (faviconData?.publicUrl) {
        const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (favicon) {
          favicon.href = faviconData.publicUrl;
        } else {
          const newFavicon = document.createElement('link');
          newFavicon.rel = 'icon';
          newFavicon.href = faviconData.publicUrl;
          document.head.appendChild(newFavicon);
        }
      }
    };

    updateFavicon();
  }, []);

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

  const renderTitle = (text: string, weights: string[]) => {
    if (text === "romergarcia") {
      return (
        <span>
          <span className="font-medium">romer</span>
          <span className="font-thin text-neutral-200">garcia</span>
        </span>
      );
    }

    const words = text.split(" ");
    if (words.length === 1) {
      return <span className="font-thin">{text}</span>;
    }

    return (
      <span>
        {words.map((word, index) => (
          <span
            key={index}
            className={`${weights[index % weights.length]} ${index > 0 ? "ml-4" : ""}`}
          >
            {word}
          </span>
        ))}
      </span>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950/20 z-10" />
        {heroImages.length > 0 && (
          <motion.img 
            key={heroImages[currentImageIndex]}
            src={heroImages[currentImageIndex]} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
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
              <motion.h1
                variants={pixelGlitch}
                className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8"
                style={{
                  textShadow: `
                    2px 0 0 rgba(255,0,0,0.3),
                    -2px 0 0 rgba(0,255,255,0.3)
                  `,
                  fontFeatureSettings: '"ss01"'
                }}
              >
                {renderTitle(titles[titleIndex].text, titles[titleIndex].weights)}
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
                <h1 className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8">
                  {renderTitle(titles[titleIndex].text, titles[titleIndex].weights)}
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
