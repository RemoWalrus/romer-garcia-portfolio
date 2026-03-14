
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

  const renderTitle = (text: string, weights: string[], inheritColor = false) => {
    if (text === "romergarcia") {
      return (
        <span className="inline-flex items-baseline">
          <span className="font-medium">romer</span>
          <span className={`font-thin ${inheritColor ? '' : 'text-neutral-200'}`} style={inheritColor ? { color: 'inherit' } : undefined}>garcia</span>
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

  // Glitch intensity peaks around the midpoint then snaps out
  const burstZone = Math.max(0, 1 - Math.abs(gi - 0.5) / 0.2); // peaks at 0.5, ±0.2 range
  const preGlitch = Math.min(1, gi / 0.5); // 0→1 approaching burst
  const chromatic = burstZone * 10 + preGlitch * 4;
  const skew = burstZone * 4;
  const scanOp = burstZone * 0.8 + preGlitch * 0.15;
  // Hard cutoff — title disappears at 0.55
  const visible = gi < 0.55;
  const titleOpacity = gi < 0.4 ? 1 : gi < 0.55 ? Math.max(0, 1 - (gi - 0.4) / 0.15) : 0;

  if (!visible && burstZone === 0) return null;

  const textClass = "text-6xl md:text-7xl lg:text-9xl font-roc py-2 tracking-tighter mb-8";

  return (
    <>
      {/* SVG pixelation filter */}
      {burstZone > 0.2 && (
        <svg className="absolute w-0 h-0" aria-hidden>
          <filter id="pixelate">
            <feFlood x="0" y="0" width={Math.max(1, Math.round(burstZone * 14))} height={Math.max(1, Math.round(burstZone * 14))} />
            <feComposite width={Math.max(1, Math.round(burstZone * 14))} height={Math.max(1, Math.round(burstZone * 14))} />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius={Math.max(1, Math.round(burstZone * 6))} />
          </filter>
        </svg>
      )}

      {/* Red channel ghost */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
        style={{
          mixBlendMode: 'screen',
          transform: `translateX(${1.5 + chromatic * 0.5}px) translateY(${burstZone * -2}px) skewX(${skew * 0.6}deg)`,
          opacity: titleOpacity,
        }}
      >
        <div
          className={`${textClass}`}
          style={{ color: `rgba(255, 0, 0, ${0.2 + burstZone * 0.5})` }}
        >
          {renderTitle(title.text, title.weights, true)}
        </div>
      </div>

      {/* Cyan channel ghost */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
        style={{
          mixBlendMode: 'screen',
          transform: `translateX(${-2.5 - chromatic * 0.5}px) translateY(${burstZone * 1.5}px) skewX(${-skew * 0.5}deg)`,
          opacity: titleOpacity,
        }}
      >
        <div
          className={`${textClass}`}
          style={{ color: `rgba(0, 255, 255, ${0.18 + burstZone * 0.45})` }}
        >
          {renderTitle(title.text, title.weights, true)}
        </div>
      </div>

      {/* Main title */}
      <motion.h1
        variants={pixelGlitch}
        initial={{ scale: 0.5 }}
        animate={{
          scale: 1,
          transition: { duration: 0.6, ease: "easeOut" },
        }}
        className={`${textClass} text-white mb-8 relative text-center`}
        style={{
          fontFeatureSettings: '"ss01"',
          filter: burstZone > 0.3 ? `url(#pixelate) hue-rotate(${burstZone * 40}deg)` : (preGlitch > 0.3 ? `hue-rotate(${preGlitch * 15}deg)` : undefined),
          transform: `skewX(${skew}deg)`,
          textShadow: `
            ${chromatic * 0.35}px ${burstZone * 1.5}px 0 rgba(255,0,0,${0.3 + burstZone * 0.35}),
            ${-chromatic * 0.35}px ${burstZone * -0.8}px 0 rgba(0,255,255,${0.3 + burstZone * 0.35})
          `,
          opacity: titleOpacity,
        }}
      >
        {renderTitle(title.text, title.weights)}

        {/* Scan lines */}
        <span
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${scanOp * 0.4}) 2px, rgba(0,0,0,${scanOp * 0.4}) 4px)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            opacity: scanOp > 0.05 ? 1 : 0,
          }}
        >
          {renderTitle(title.text, title.weights)}
        </span>
      </motion.h1>

      {/* Horizontal glitch slice at burst */}
      {burstZone > 0.3 && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
          style={{
            mixBlendMode: 'difference',
            clipPath: `inset(${30 + burstZone * 15}% 0 ${35 - burstZone * 10}% 0)`,
            transform: `translateX(${burstZone * 14}px)`,
            opacity: titleOpacity,
          }}
        >
          <div className={`${textClass} text-white`}>
            {renderTitle(title.text, title.weights, true)}
          </div>
        </div>
      )}
    </>
  );
};

