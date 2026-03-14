
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import type { TitleConfig } from './title-config';

interface HeroTitleProps {
  title: TitleConfig;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  const { scrollY } = useScroll();
  const [gi, setGi] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const intensity = useTransform(scrollY, [0, viewportHeight * 0.7], [0, 1]);
  useMotionValueEvent(intensity, "change", (v) => setGi(v));

  // Scroll-driven chromatic aberration (Paradoxxia style)
  const preGlitch = Math.min(1, gi / 0.5);
  const burstZone = Math.max(0, 1 - Math.abs(gi - 0.5) / 0.2);
  const chromatic = burstZone * 8 + preGlitch * 3;
  const skew = burstZone * 4;
  const scanOp = burstZone * 0.7 + preGlitch * 0.12;
  const titleOpacity = gi < 0.4 ? 1 : gi < 0.55 ? Math.max(0, 1 - (gi - 0.4) / 0.15) : 0;

  if (gi >= 0.55 && burstZone === 0) return null;

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

  const textClass = "text-6xl md:text-7xl lg:text-9xl font-roc py-2 tracking-tighter mb-8";

  return (
    <motion.h1
      className={`${textClass} text-white mb-8 relative text-center`}
      style={{
        fontFeatureSettings: '"ss01"',
        transform: `skewX(${skew}deg)`,
        textShadow: `
          ${0.5 + chromatic * 0.7}px ${burstZone * 2}px 0 rgba(255,0,0,${0.15 + preGlitch * 0.15 + burstZone * 0.4}),
          ${-0.5 - chromatic * 0.7}px ${burstZone * -1}px 0 rgba(0,255,255,${0.12 + preGlitch * 0.12 + burstZone * 0.35})
        `,
        opacity: titleOpacity,
        filter: preGlitch > 0.3 ? `hue-rotate(${preGlitch * 12 + burstZone * 30}deg)` : undefined,
      }}
    >
      {renderTitle(title.text, title.weights)}

      {/* Scan lines on scroll */}
      {scanOp > 0.05 && (
        <span
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${scanOp * 0.35}) 2px, rgba(0,0,0,${scanOp * 0.35}) 4px)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          {renderTitle(title.text, title.weights)}
        </span>
      )}
    </motion.h1>
  );
};
