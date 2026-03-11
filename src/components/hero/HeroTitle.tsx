
import React from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { pixelGlitch } from './animation-variants';
import type { TitleConfig } from './title-config';
import { useState } from 'react';

interface HeroTitleProps {
  title: TitleConfig;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  const { scrollY } = useScroll();
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  // Map scroll position to glitch intensity (0-1)
  const intensity = useTransform(scrollY, [0, 400], [0, 1]);

  useMotionValueEvent(intensity, "change", (v) => {
    setGlitchIntensity(v);
  });

  const renderTitle = (text: string, weights: string[]) => {
    if (text === "romergarcia") {
      return (
        <span className="inline-flex items-baseline">
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

  const gi = glitchIntensity;

  return (
    <>
      <motion.h1
        variants={pixelGlitch}
        initial={{ scale: 0.5 }}
        animate={{ 
          scale: 1,
          transition: {
            duration: 0.6,
            ease: "easeOut"
          }
        }}
        className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8 py-2 relative"
        style={{
          textShadow: `
            ${2 + gi * 8}px ${gi * 2}px 0 rgba(255,0,0,${0.3 + gi * 0.5}),
            ${-2 - gi * 8}px ${gi * -1}px 0 rgba(0,255,255,${0.3 + gi * 0.5})
          `,
          fontFeatureSettings: '"ss01"',
          transform: `skewX(${gi * -2}deg)`,
          filter: `hue-rotate(${gi * 15}deg)`,
        }}
      >
        {renderTitle(title.text, title.weights)}
      </motion.h1>

      {/* Red channel ghost */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gi * 0.6,
          transform: `translateX(${gi * 12}px) translateY(${gi * -3}px) skewX(${gi * 1.5}deg)`,
          mixBlendMode: "screen",
        }}
        aria-hidden
      >
        <h1
          className="text-6xl md:text-7xl lg:text-9xl font-roc mb-8 py-2"
          style={{ color: `rgba(255, 0, 0, ${gi * 0.4})` }}
        >
          {renderTitle(title.text, title.weights)}
        </h1>
      </motion.div>

      {/* Cyan channel ghost */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gi * 0.6,
          transform: `translateX(${gi * -10}px) translateY(${gi * 2}px) skewX(${gi * -1}deg)`,
          mixBlendMode: "screen",
        }}
        aria-hidden
      >
        <h1
          className="text-6xl md:text-7xl lg:text-9xl font-roc mb-8 py-2"
          style={{ color: `rgba(0, 255, 255, ${gi * 0.35})` }}
        >
          {renderTitle(title.text, title.weights)}
        </h1>
      </motion.div>

      {/* Pixelated mosaic overlay on scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: gi * 0.5 }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent ${Math.max(2, gi * 12)}px, rgba(255,255,255,${gi * 0.1}) ${Math.max(2, gi * 12)}px, rgba(255,255,255,${gi * 0.1}) ${Math.max(4, gi * 14)}px),
              repeating-linear-gradient(90deg, transparent, transparent ${Math.max(4, gi * 16)}px, rgba(255,255,255,${gi * 0.06}) ${Math.max(4, gi * 16)}px, rgba(255,255,255,${gi * 0.06}) ${Math.max(6, gi * 18)}px)
            `,
            backdropFilter: gi > 0.15 ? `blur(${gi * 1.5}px)` : undefined,
          }}
        />
        {/* Block glitch strips */}
        {gi > 0.2 && (
          <>
            <div
              className="absolute left-0 right-0"
              style={{
                top: `${20 + gi * 15}%`,
                height: `${gi * 8}px`,
                background: `rgba(255,255,255,${gi * 0.08})`,
                transform: `translateX(${gi * 20}px)`,
              }}
            />
            <div
              className="absolute left-0 right-0"
              style={{
                top: `${55 + gi * 10}%`,
                height: `${gi * 5}px`,
                background: `rgba(255,255,255,${gi * 0.06})`,
                transform: `translateX(${gi * -15}px)`,
              }}
            />
          </>
        )}
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "difference",
          textShadow: "none",
          clipPath: gi > 0.1
            ? `inset(${30 + gi * 20}% 0 ${40 - gi * 15}% 0)`
            : undefined,
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
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8 py-2">
          {renderTitle(title.text, title.weights)}
        </h1>
      </motion.div>
    </>
  );
};

