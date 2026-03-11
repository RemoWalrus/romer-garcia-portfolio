
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { pixelGlitch } from './animation-variants';
import type { TitleConfig } from './title-config';

interface HeroTitleProps {
  title: TitleConfig;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  const { scrollY } = useScroll();
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Fade fully by the time portfolio section covers the hero
  const intensity = useTransform(scrollY, [0, viewportHeight * 0.7], [0, 1]);

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
      {/* Main title - fades and pixelates on scroll */}
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
          opacity: 1 - gi,
        }}
      >
        {renderTitle(title.text, title.weights)}

        {/* Scan lines masked to text via background-clip */}
        <span
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${gi * 0.35}) 2px, rgba(0,0,0,${gi * 0.35}) 4px)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            opacity: gi > 0.05 ? 1 : 0,
          }}
        >
          {renderTitle(title.text, title.weights)}
        </span>
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
        <div
          className="text-6xl md:text-7xl lg:text-9xl font-roc mb-8 py-2 text-center"
          style={{ color: `rgba(255, 0, 0, ${gi * 0.4})` }}
        >
          {renderTitle(title.text, title.weights)}
        </div>
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
        <div
          className="text-6xl md:text-7xl lg:text-9xl font-roc mb-8 py-2"
          style={{ color: `rgba(0, 255, 255, ${gi * 0.35})` }}
        >
          {renderTitle(title.text, title.weights)}
        </div>
      </motion.div>

      {/* Pixelation overlay - SVG filter applied to text clone */}
      {gi > 0.08 && (
        <>
          <svg className="absolute w-0 h-0" aria-hidden>
            <filter id="pixelate">
              <feFlood x="0" y="0" width={Math.max(1, Math.round(gi * 10))} height={Math.max(1, Math.round(gi * 10))} />
              <feComposite width={Math.max(1, Math.round(gi * 10))} height={Math.max(1, Math.round(gi * 10))} />
              <feTile result="a" />
              <feComposite in="SourceGraphic" in2="a" operator="in" />
              <feMorphology operator="dilate" radius={Math.max(1, Math.round(gi * 4))} />
            </filter>
          </svg>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: 'url(#pixelate)',
              opacity: gi * 0.7,
              mixBlendMode: 'overlay',
            }}
            aria-hidden
          >
            <div
              className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8 py-2"
              style={{ opacity: 0.6 }}
            >
              {renderTitle(title.text, title.weights)}
            </div>
          </div>
        </>
      )}

      {/* Difference blend glitch slice */}
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
        <div className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8 py-2">
          {renderTitle(title.text, title.weights)}
        </div>
      </motion.div>
    </>
  );
};

