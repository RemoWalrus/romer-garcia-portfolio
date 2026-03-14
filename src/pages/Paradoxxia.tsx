import { Helmet } from "react-helmet-async";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import circuitBg from "@/assets/paradoxxia-bg.png";

const Paradoxxia = () => {
  const [intro, setIntro] = useState(true);
  const redControls = useAnimation();
  const cyanControls = useAnimation();
  const mainControls = useAnimation();
  const scanControls = useAnimation();

  const titleFont = {
    fontWeight: 400,
    fontFamily: '"ab-karuta-bold", sans-serif',
    letterSpacing: '-0.15em',
  };

  // Idle glitch — random micro-burst, occasionally heavy
  const triggerGlitch = useCallback(async (heavy = false) => {
    const intensity = heavy ? 3.5 : 1;
    const rx = (Math.random() - 0.5) * 10 * intensity;
    const ry = (Math.random() - 0.5) * 4 * intensity;
    const sk = (Math.random() - 0.5) * 3 * intensity;
    const dur = heavy ? 0.25 + Math.random() * 0.1 : 0.12 + Math.random() * 0.1;
    const peakRedOp = heavy ? 0.7 : 0.5;
    const peakCyanOp = heavy ? 0.6 : 0.45;
    const peakShadow = heavy ? Math.abs(rx) * 0.6 : Math.abs(rx) * 0.4;

    const promises = [
      redControls.start({
        x: heavy ? [2.5, 2.5 + rx * 1.2, 2.5 - rx * 0.8, 2.5 + rx * 0.3, 2.5] : [2.5, 2.5 + rx * 1.2, 2.5 - rx * 0.6, 2.5],
        y: [-0.5, -0.5 + ry, -0.5 - ry * 0.3, -0.5],
        skewX: heavy ? [0.3, 0.3 + sk, 0.3 - sk * 0.5, 0.3] : [0.3, 0.3 + sk, 0.3],
        opacity: heavy ? [0.38, peakRedOp, 0.55, peakRedOp * 0.6, 0.38] : [0.38, peakRedOp, 0.38],
        transition: { duration: dur, ease: 'easeInOut' },
      }),
      cyanControls.start({
        x: heavy ? [-2, -2 - rx * 1.1, -2 + rx * 0.7, -2 - rx * 0.2, -2] : [-2, -2 - rx * 1.1, -2 + rx * 0.5, -2],
        y: [0.5, 0.5 - ry, 0.5 + ry * 0.3, 0.5],
        skewX: heavy ? [-0.2, -0.2 - sk, -0.2 + sk * 0.5, -0.2] : [-0.2, -0.2 - sk, -0.2],
        opacity: heavy ? [0.32, peakCyanOp, 0.4, peakCyanOp * 0.5, 0.32] : [0.32, peakCyanOp, 0.32],
        transition: { duration: dur, ease: 'easeInOut' },
      }),
      mainControls.start({
        skewX: heavy ? [0, sk * 0.6, -sk * 0.3, 0] : [0, sk * 0.5, 0],
        textShadow: [
          '1.5px 0 0 rgba(255,0,0,0.35), -1.5px 0 0 rgba(0,255,255,0.35)',
          `${peakShadow}px 0 0 rgba(255,0,0,0.5), ${-peakShadow}px 0 0 rgba(0,255,255,0.5)`,
          '1.5px 0 0 rgba(255,0,0,0.35), -1.5px 0 0 rgba(0,255,255,0.35)',
        ],
        transition: { duration: dur, ease: 'easeInOut' },
      }),
    ];

    // Heavy glitch also flashes scan lines
    if (heavy) {
      promises.push(
        scanControls.start({
          opacity: [0, 0.35, 0.15, 0],
          transition: { duration: dur * 1.2, ease: 'easeOut' },
        })
      );
    }

    await Promise.all(promises);
  }, [redControls, cyanControls, mainControls, scanControls]);

  // Schedule random idle glitches
  useEffect(() => {
    if (intro) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2000 + Math.random() * 5000;
      timeout = setTimeout(async () => {
        const isHeavy = Math.random() < 0.15;
        await triggerGlitch(isHeavy);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [intro, triggerGlitch]);

  // Intro animation sequence — smooth continuous
  useEffect(() => {
    const run = async () => {
      // Start from glitchy state, animate to rest
      await Promise.all([
        redControls.start({
          x: [18, -8, 5, -2, 2.5],
          y: [-6, 3, -1.5, 0.5, -0.5],
          skewX: [4, -2, 1, -0.3, 0.3],
          opacity: [0.65, 0.55, 0.4, 0.38, 0.38],
          color: [
            'rgba(255,0,0,0.6)', 'rgba(255,0,0,0.5)',
            'rgba(255,0,0,0.35)', 'rgba(255,0,0,0.22)',
          ],
          transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.25, 0.5, 0.75, 1] },
        }),
        cyanControls.start({
          x: [-15, 7, -4, 1, -2],
          y: [5, -2, 1, -0.3, 0.5],
          skewX: [-3, 1.8, -0.8, 0.3, -0.2],
          opacity: [0.6, 0.5, 0.35, 0.32, 0.32],
          color: [
            'rgba(0,255,255,0.55)', 'rgba(0,255,255,0.45)',
            'rgba(0,255,255,0.3)', 'rgba(0,255,255,0.18)',
          ],
          transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.25, 0.5, 0.75, 1] },
        }),
        mainControls.start({
          opacity: [0, 0.6, 0.85, 1],
          skewX: [3, -1, 0.5, 0],
          textShadow: [
            '5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)',
            '2px 0 0 rgba(255,0,0,0.35), -2px 0 0 rgba(0,255,255,0.35)',
            '1.5px 0 0 rgba(255,0,0,0.35), -1.5px 0 0 rgba(0,255,255,0.35)',
          ],
          transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
        }),
        scanControls.start({
          opacity: [0.5, 0.3, 0],
          transition: { duration: 1, ease: 'easeOut' },
        }),
      ]);
      setIntro(false);
    };
    run();
  }, []);

  return (
    <div className="fixed inset-0 bg-background overflow-x-hidden overflow-y-auto">
      <Helmet>
        <title>パラドクシア | Paradoxxia Universe</title>
        <meta name="description" content="Explore パラドクシア (Paradoxxia) — an original cinematic sci-fi universe by Romer Garcia. A post-apocalyptic world where technology and poetry collide, featuring AI-powered character generation, immersive worldbuilding, and stories born from the ruins of civilization." />
        <meta name="keywords" content="パラドクシア, Paradoxxia, Paradoxxia universe, cinematic sci-fi world, romergarcia, post-apocalyptic worldbuilding, AI character generator, original sci-fi IP, futuristic storytelling" />
        <meta property="og:title" content="パラドクシア | Paradoxxia Universe" />
        <meta property="og:description" content="An original cinematic sci-fi universe by Romer Garcia — post-apocalyptic worldbuilding where technology and poetry collide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://romergarcia.com/paradoxxia" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="パラドクシア | Paradoxxia Universe" />
        <meta name="twitter:description" content="Enter the パラドクシア universe — a cinematic sci-fi world where science meets poetry." />
      </Helmet>
      <GoogleAnalytics />
      <ThemeToggle />

      {/* Circuit board background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${circuitBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-white/60 dark:bg-transparent" />

      <div className="min-h-full flex flex-col items-center justify-center relative z-10">
        <h1 className="flex flex-col items-center">
          <span className="relative inline-block">
            {/* Red channel ghost */}
            <motion.span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none"
              aria-hidden
              style={{ ...titleFont, mixBlendMode: 'screen', color: 'rgba(255,0,0,0.6)' }}
              initial={{ x: 18, y: -6, skewX: 4, opacity: 0.65 }}
              animate={redControls}
            >
              パラドクシア
            </motion.span>

            {/* Cyan channel ghost */}
            <motion.span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none"
              aria-hidden
              style={{ ...titleFont, mixBlendMode: 'screen', color: 'rgba(0,255,255,0.55)' }}
              initial={{ x: -15, y: 5, skewX: -3, opacity: 0.6 }}
              animate={cyanControls}
            >
              パラドクシア
            </motion.span>

            {/* Main title */}
            <motion.span
              className="text-[3.2rem] md:text-9xl text-[#0a1e5c] dark:text-[#00d4ff] relative z-10"
              style={{ ...titleFont }}
              initial={{
                opacity: 0,
                skewX: 3,
                textShadow: '5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)',
              }}
              animate={mainControls}
            >
              パラドクシア
            </motion.span>

            {/* Scan line overlay */}
            <motion.span
              className="absolute inset-0 pointer-events-none z-20"
              aria-hidden
              initial={{ opacity: 0.5 }}
              animate={scanControls}
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
              }}
            />
          </span>
        </h1>
      </div>
      <footer className="absolute bottom-0 left-0 right-0 z-10 py-6 text-center">
        <p className="text-sm text-muted-foreground dark:text-[#00d4ff] font-roc">
          © {new Date().getFullYear()} Romer Garcia. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Paradoxxia;
