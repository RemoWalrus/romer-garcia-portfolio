
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface HeroBackgroundProps {
  showVideo: boolean;
  heroImages: string[];
  currentImageIndex: number;
  isGlitching: boolean;
}

export const HeroBackground = ({ showVideo, heroImages, currentImageIndex, isGlitching }: HeroBackgroundProps) => {
  const videoUrl = supabase.storage.from('graphics').getPublicUrl('staticglitchy.mp4').data.publicUrl;

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
  );
};
