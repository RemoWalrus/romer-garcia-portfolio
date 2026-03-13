import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import circuitBg from "@/assets/paradoxxia-bg.png";

const Paradoxxia = () => {
  const [phase, setPhase] = useState(0); // 0=glitchy, 1=settling, 2=done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const titleFont = {
    fontWeight: 400,
    fontFamily: '"ab-karuta-bold", sans-serif',
    letterSpacing: '-0.1em',
  };

  return (
    <div className="fixed inset-0 bg-background overflow-x-hidden overflow-y-auto">
      <Helmet>
        <title>パラドクシア | Paradoxxia Universe</title>
        <meta name="description" content="Enter the パラドクシア universe — a cinematic sci-fi world where science meets poetry, and stories are born from the ruins." />
        <meta name="keywords" content="パラドクシア, Paradoxxia universe, cinematic sci-fi, romergarcia, post-apocalyptic world, worldbuilding" />
        <meta property="og:title" content="パラドクシア | Paradoxxia Universe" />
        <meta property="og:description" content="Enter the パラドクシア universe — a cinematic sci-fi world where science meets poetry." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://romergarcia.com/paradoxxia" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="パラドクシア | Paradoxxia Universe" />
        <meta name="twitter:description" content="Enter the パラドクシア universe — a cinematic sci-fi world where science meets poetry." />
      </Helmet>
      <GoogleAnalytics />
      <ThemeToggle />

      {/* SVG pixelation filter */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <filter id="pdx-pixelate">
          <feFlood x="0" y="0" width={phase === 0 ? 12 : phase === 1 ? 4 : 1} height={phase === 0 ? 12 : phase === 1 ? 4 : 1} />
          <feComposite width={phase === 0 ? 12 : phase === 1 ? 4 : 1} height={phase === 0 ? 12 : phase === 1 ? 4 : 1} />
          <feTile result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feMorphology operator="dilate" radius={phase === 0 ? 5 : phase === 1 ? 2 : 0} />
        </filter>
      </svg>

      {/* Circuit board background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${circuitBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-white/30 dark:bg-transparent" />

      <div className="min-h-full flex flex-col items-center justify-center relative z-10">
        <h1 className="flex flex-col items-center">
          <span className="relative inline-block">
            {/* Red channel ghost */}
            <motion.span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none"
              aria-hidden
              style={{ ...titleFont, mixBlendMode: 'screen' }}
              initial={{
                x: 18, y: -6, skewX: 4, opacity: 0.7,
                color: 'rgba(255,0,0,0.6)',
              }}
              animate={{
                x: phase === 0 ? [18, -12, 8, -5, 2.5] : 2.5,
                y: phase === 0 ? [-6, 4, -3, 1, -0.5] : -0.5,
                skewX: phase === 0 ? [4, -3, 2, -1, 0.3] : 0.3,
                opacity: phase === 2 ? 0.22 : 0.6,
                color: phase === 2
                  ? 'rgba(255,0,0,0.22)'
                  : 'rgba(255,0,0,0.6)',
              }}
              transition={{
                duration: phase === 0 ? 0.4 : 0.4,
                ease: [0.165, 0.84, 0.44, 1],
              }}
            >
              パラドクシア
            </motion.span>

            {/* Cyan channel ghost */}
            <motion.span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none"
              aria-hidden
              style={{ ...titleFont, mixBlendMode: 'screen' }}
              initial={{
                x: -15, y: 5, skewX: -3, opacity: 0.6,
                color: 'rgba(0,255,255,0.55)',
              }}
              animate={{
                x: phase === 0 ? [-15, 10, -7, 4, -2] : -2,
                y: phase === 0 ? [5, -3, 2, -1, 0.5] : 0.5,
                skewX: phase === 0 ? [-3, 2.5, -1.5, 0.8, -0.2] : -0.2,
                opacity: phase === 2 ? 0.18 : 0.55,
                color: phase === 2
                  ? 'rgba(0,255,255,0.18)'
                  : 'rgba(0,255,255,0.55)',
              }}
              transition={{
                duration: phase === 0 ? 0.4 : 0.4,
                ease: [0.165, 0.84, 0.44, 1],
              }}
            >
              パラドクシア
            </motion.span>

            {/* Main title */}
            <motion.span
              className="text-[3.2rem] md:text-9xl text-[#0a1e5c] dark:text-[#00d4ff] relative z-10"
              style={{ ...titleFont }}
              initial={{
                opacity: 0,
                filter: 'url(#pdx-pixelate) blur(2px)',
                skewX: 3,
                textShadow: '4px 0 0 rgba(255,0,0,0.5), -4px 0 0 rgba(0,255,255,0.5)',
              }}
              animate={{
                opacity: 1,
                filter: phase < 2 ? 'url(#pdx-pixelate) blur(0px)' : 'none',
                skewX: phase === 0 ? [3, -2, 1.5, -0.5, 0] : 0,
                textShadow: phase === 2
                  ? '0.5px 0 0 rgba(255,0,0,0.25), -0.5px 0 0 rgba(0,255,255,0.25)'
                  : '3px 0 0 rgba(255,0,0,0.4), -3px 0 0 rgba(0,255,255,0.4)',
              }}
              transition={{
                duration: phase === 0 ? 0.35 : 0.45,
                ease: [0.165, 0.84, 0.44, 1],
              }}
            >
              パラドクシア
            </motion.span>

            {/* Scan line overlay during glitch */}
            {phase < 2 && (
              <motion.span
                className="absolute inset-0 pointer-events-none z-20"
                aria-hidden
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                }}
              />
            )}
          </span>
        </h1>
      </div>
      <footer className="absolute bottom-0 left-0 right-0 z-10 py-6 text-center">
        <p className="text-sm text-muted-foreground font-roc">
          © {new Date().getFullYear()} Romer Garcia. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Paradoxxia;
