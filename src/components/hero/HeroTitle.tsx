
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useAnimation } from 'framer-motion';
import type { TitleConfig } from './title-config';

interface HeroTitleProps {
  title: TitleConfig;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  const { scrollY } = useScroll();
  const [gi, setGi] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const redControls = useAnimation();
  const cyanControls = useAnimation();

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const intensity = useTransform(scrollY, [0, viewportHeight * 0.7], [0, 1]);
  useMotionValueEvent(intensity, "change", (v) => setGi(v));

  // Random zoom punch on each word switch
  const [zoomPunch, setZoomPunch] = useState(1);

  // Transition burst: animate ghost layers in then settle
  useEffect(() => {
    setIsTransitioning(true);
    // Random zoom: either punch in (1.06-1.12) or out (0.88-0.94)
    const zoomIn = Math.random() > 0.5;
    const magnitude = zoomIn ? 1.06 + Math.random() * 0.06 : 0.88 + Math.random() * 0.06;
    setZoomPunch(magnitude);
    // Snap back after one frame
    requestAnimationFrame(() => setZoomPunch(1));

    const run = async () => {
      await Promise.all([
        redControls.start({
          x: [18, -8, 4, -1, 3],
          y: [-4, 2, -1, 0, -0.5],
          opacity: [0.75, 0.6, 0.45, 0.35, 0.25],
          transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.2, 0.45, 0.7, 1] },
        }),
        cyanControls.start({
          x: [-16, 7, -3, 1, -2.5],
          y: [3, -2, 0.5, 0, 0.5],
          opacity: [0.7, 0.55, 0.4, 0.3, 0.2],
          transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.2, 0.45, 0.7, 1] },
        }),
      ]);
      setZoomPunch(1);
      setIsTransitioning(false);
    };
    run();
  }, [title.text]);

  // Scroll-driven chromatic aberration (Paradoxxia style)
  const preGlitch = Math.min(1, gi / 0.5);
  const burstZone = Math.max(0, 1 - Math.abs(gi - 0.5) / 0.2);
  const chromatic = burstZone * 8 + preGlitch * 3;
  const scrollSkew = burstZone * 4; // only for scroll-out
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

  // Ghost layer base offsets when scroll is involved
  const scrollRedX = 3 + chromatic * 1.2;
  const scrollCyanX = -3 - chromatic * 1.2;

  return (
    <div className="relative" style={{ opacity: titleOpacity, transform: `scale(${zoomPunch})` }}>
      {/* Red ghost layer */}
      <motion.span
        className={`${textClass} absolute inset-0 pointer-events-none text-center whitespace-nowrap`}
        aria-hidden
        animate={redControls}
        style={{
          color: `rgba(255,20,20,${isTransitioning ? 1 : (0.25 + preGlitch * 0.2 + burstZone * 0.4)})`,
          mixBlendMode: 'screen',
          transform: isTransitioning ? undefined : `translateX(${scrollRedX}px) translateY(${burstZone * 3}px)`,
          fontFeatureSettings: '"ss01"',
        }}
      >
        {renderTitle(title.text, title.weights)}
      </motion.span>

      {/* Cyan ghost layer */}
      <motion.span
        className={`${textClass} absolute inset-0 pointer-events-none text-center whitespace-nowrap`}
        aria-hidden
        animate={cyanControls}
        style={{
          color: `rgba(0,255,255,${isTransitioning ? 1 : (0.2 + preGlitch * 0.18 + burstZone * 0.35)})`,
          mixBlendMode: 'screen',
          transform: isTransitioning ? undefined : `translateX(${scrollCyanX}px) translateY(${burstZone * -2}px)`,
          fontFeatureSettings: '"ss01"',
        }}
      >
        {renderTitle(title.text, title.weights)}
      </motion.span>

      {/* Main title */}
      <motion.h1
        className={`${textClass} text-white mb-8 relative text-center z-10`}
        style={{
          fontFeatureSettings: '"ss01"',
          transform: `skewX(${scrollSkew}deg)`,
          textShadow: `
            ${3 + chromatic * 1.2}px ${burstZone * 3}px 0 rgba(255,20,20,${0.45 + preGlitch * 0.2 + burstZone * 0.35}),
            ${-3 - chromatic * 1.2}px ${burstZone * -2}px 0 rgba(0,255,255,${0.4 + preGlitch * 0.18 + burstZone * 0.35})
          `,
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

      {/* Horizontal glitch slice during transition burst */}
      {isTransitioning && (
        <motion.span
          className={`${textClass} absolute inset-0 pointer-events-none text-center whitespace-nowrap z-20`}
          aria-hidden
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.3, 0] }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            color: 'white',
            mixBlendMode: 'difference',
            clipPath: 'inset(35% 0 40% 0)',
            transform: 'translateX(12px)',
            fontFeatureSettings: '"ss01"',
          }}
        >
          {renderTitle(title.text, title.weights)}
        </motion.span>
      )}
    </div>
  );
};
