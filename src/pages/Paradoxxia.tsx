import { Helmet } from "react-helmet-async";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ParadoxxiaLandingSchema, SpotifyIcon, AppleMusicIcon } from "@/components/seo/ParadoxxiaSchemas";
import { MoveRight } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import circuitBg from "@/assets/paradoxxia-bg.png";

const Paradoxxia = () => {
  const [intro, setIntro] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [burst, setBurst] = useState(0);
  const isAnimating = useRef(false);
  const isMobile = useIsMobile();
  const speed = isMobile ? 0.65 : 0.8; // multiplier for all timings

  // Map phase to base glitch intensity + burst overlay
  const gi = (phase === 0 ? 0 : phase === 1 ? 0.5 : 1) + burst * 0.5;

  const goToPhase = useCallback((target: number) => {
    if (isAnimating.current) return;
    const clamped = Math.max(0, Math.min(2, target));
    if (clamped === phase) return;
    isAnimating.current = true;

    // Subtle glitch burst with pixelation
    setBurst(0.5);
    const s = speed;
    const burstSteps = [
      { delay: 60 * s, value: 0.4 },
      { delay: 120 * s, value: 0.5 },
      { delay: 200 * s, value: 0.25 },
      { delay: 300 * s, value: 0.08 },
      { delay: 380 * s, value: 0 },
    ];
    burstSteps.forEach(({ delay, value }) => {
      setTimeout(() => setBurst(value), delay);
    });

    setTimeout(() => setPhase(clamped), 120 * s);
    setTimeout(() => { isAnimating.current = false; }, 480 * s);
  }, [phase]);

  // Wheel handler — any scroll snaps to next/prev phase
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (e.deltaY > 0) goToPhase(phase + 1);
      else if (e.deltaY < 0) goToPhase(phase - 1);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [phase, goToPhase]);

  // Touch swipe handler for mobile
  const touchStart = useRef(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const diff = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 30) {
        if (diff > 0) goToPhase(phase + 1);
        else goToPhase(phase - 1);
      }
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchend', onEnd); };
  }, [phase, goToPhase]);
  
  const redControls = useAnimation();
  const cyanControls = useAnimation();
  const mainControls = useAnimation();
  const scanControls = useAnimation();
  const meta = usePageMeta('paradoxxia', {
    title: 'Paradoxxia | AI Character Generator & Multimedia Artist',
    description: 'Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring an interactive character generator and AI-synthesized music on Spotify and Apple Music.',
    keywords: 'Paradoxxia, パラドクシア, AI multimedia artist, AI character generator, Paradoxxia Spotify, Paradoxxia Apple Music, romergarcia, AI-synthesized music, cinematic sci-fi',
    ogTitle: 'Paradoxxia | AI Character Generator & Multimedia Artist',
    ogDescription: 'Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring an interactive character generator and AI-synthesized music on Spotify and Apple Music.',
    ogUrl: 'https://romergarcia.com/paradoxxia',
    twitterTitle: 'Paradoxxia | AI Character Generator & Multimedia Artist',
    twitterDescription: 'Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring an interactive character generator and AI-synthesized music on Spotify and Apple Music.',
  });

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
    const dur = (heavy ? 0.2 + Math.random() * 0.08 : 0.09 + Math.random() * 0.07) * speed;
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
          transition: { duration: 0.7 * speed, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.25, 0.5, 0.75, 1] },
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
          transition: { duration: 0.7 * speed, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.25, 0.5, 0.75, 1] },
        }),
        mainControls.start({
          opacity: [0, 0.6, 0.85, 1],
          skewX: [3, -1, 0.5, 0],
          textShadow: [
            '5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)',
            '2px 0 0 rgba(255,0,0,0.35), -2px 0 0 rgba(0,255,255,0.35)',
            '1.5px 0 0 rgba(255,0,0,0.35), -1.5px 0 0 rgba(0,255,255,0.35)',
          ],
          transition: { duration: 0.7 * speed, ease: [0.25, 0.1, 0.25, 1] },
        }),
        scanControls.start({
          opacity: [0.5, 0.3, 0],
          transition: { duration: 0.8 * speed, ease: 'easeOut' },
        }),
      ]);
      setIntro(false);
    };
    run();
  }, []);

  return (
      <div ref={scrollRef} className="fixed inset-0 bg-background overflow-hidden">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:type" content="website" />
        {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
      </Helmet>
      <ParadoxxiaLandingSchema />
      <GoogleAnalytics />
      <ThemeToggle />

      {/* Circuit board background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${circuitBg})` }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-white/60 dark:bg-transparent" />

      {/* SVG pixelation filter */}
      {gi > 0.05 && (
        <svg className="absolute w-0 h-0" aria-hidden>
          <filter id="paradox-pixelate">
            <feFlood x="0" y="0" width={Math.max(1, Math.round(gi * 12))} height={Math.max(1, Math.round(gi * 12))} />
            <feComposite width={Math.max(1, Math.round(gi * 12))} height={Math.max(1, Math.round(gi * 12))} />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius={Math.max(1, Math.round(gi * 5))} />
          </filter>
        </svg>
      )}

      {/* Sticky title container */}

        {/* Sticky title container */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center">
          <h1 className="flex flex-col items-center">
            <span className="relative inline-block">
              {(() => {
                const currentPhase = phase;
                
                // Subtle glitch burst — vertical only, no horizontal jump
                const burstZone = burst;
                const chromatic = burstZone * 6;
                const skew = burstZone * 1.5 * (currentPhase === 1 ? -1 : 1);
                const scanOp = burstZone * 0.4;
                const pixelate = burstZone > 0.2;

                const textClass = currentPhase === 2 ? "text-[2rem] md:text-6xl" : "text-[3.2rem] md:text-9xl";
                const mainColor = "text-[#0a1e5c] dark:text-[#00d4ff]";

                let currentFont: React.CSSProperties;
                let currentText: string;

                if (currentPhase === 0) {
                  currentFont = titleFont;
                  currentText = 'パラドクシア';
                } else if (currentPhase === 1) {
                  currentFont = { fontWeight: 800, fontFamily: '"roc-grotesk", sans-serif', letterSpacing: '-0.05em' };
                  currentText = 'PARADOXXIA';
                } else {
                  currentFont = { fontWeight: 500, fontFamily: '"roc-grotesk", sans-serif', letterSpacing: '-0.02em' };
                  currentText = 'coming soon';
                }

                return (
                  <>
                    {/* Red channel ghost — vertical offset only */}
                    <span
                      className={`${textClass} absolute inset-0 pointer-events-none`}
                      aria-hidden
                      style={{
                        ...currentFont,
                        mixBlendMode: 'screen',
                        color: `rgba(255,0,0,${0.22 + burstZone * 0.5})`,
                        transform: `translateY(${burstZone * -2}px) skewX(${skew * 0.5}deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {currentText}
                    </span>

                    {/* Cyan channel ghost — vertical offset only */}
                    <span
                      className={`${textClass} absolute inset-0 pointer-events-none`}
                      aria-hidden
                      style={{
                        ...currentFont,
                        mixBlendMode: 'screen',
                        color: `rgba(0,255,255,${0.18 + burstZone * 0.45})`,
                        transform: `translateY(${burstZone * 1.5}px) skewX(${-skew * 0.4}deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {currentText}
                    </span>

                    {/* Main title */}
                    <motion.span
                      className={`${textClass} ${mainColor} relative z-10`}
                      style={{
                        ...currentFont,
                        filter: pixelate ? `url(#paradox-pixelate) hue-rotate(${burstZone * 35}deg)` : undefined,
                        transform: `skewX(${skew * 0.5}deg)`,
                        textShadow: `
                          0px ${burstZone * 2}px 0 rgba(255,0,0,${0.35 + burstZone * 0.4}),
                          0px ${burstZone * -1}px 0 rgba(0,255,255,${0.35 + burstZone * 0.4})
                        `,
                      }}
                      initial={{
                        opacity: 0,
                        skewX: 3,
                        textShadow: '5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)',
                      }}
                      animate={mainControls}
                    >
                      {currentText}
                    </motion.span>

                    {/* Scan line overlay */}
                    <motion.span
                      className="absolute inset-0 pointer-events-none z-20"
                      aria-hidden
                      initial={{ opacity: 0.5 }}
                      animate={scanControls}
                      style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${0.12 + scanOp * 0.4}) 2px, rgba(0,0,0,${0.12 + scanOp * 0.4}) 4px)`,
                        opacity: scanOp,
                      }}
                    />

                    {/* Horizontal glitch slices at burst moment */}
                    {burstZone > 0.3 && (
                      <span
                        className={`${textClass} ${mainColor} absolute inset-0 pointer-events-none z-15`}
                        aria-hidden
                        style={{
                          ...currentFont,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mixBlendMode: 'difference',
                          clipPath: `inset(${30 + burstZone * 15}% 0 ${35 - burstZone * 10}% 0)`,
                          transform: `translateX(${burstZone * 8 * (currentPhase % 2 === 0 ? 1 : -1)}px)`,
                        }}
                      >
                        {currentText}
                      </span>
                    )}
                  </>
                );
              })()}
            </span>
          </h1>

          {/* Music links — visible on coming soon phase */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div
                className="flex flex-wrap justify-center gap-4 mt-6 pointer-events-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <a 
                  href="https://open.spotify.com/artist/11NJVIZgdYbPyz9igDKTBr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-roc font-bold uppercase"
                >
                  <SpotifyIcon className="w-5 h-5" />
                  Meet Paradoxxia on Spotify
                  <MoveRight className="w-4 h-4" />
                </a>
                <a 
                  href="https://music.apple.com/us/artist/paradoxxia/1803632666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-roc font-bold uppercase"
                >
                  <AppleMusicIcon className="w-5 h-5" />
                  Apple Music
                  <MoveRight className="w-4 h-4" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Scroll indicator — hidden on last phase */}
          <AnimatePresence>
            {phase < 2 && (
              <motion.div
                className="absolute bottom-20 flex flex-col items-center pointer-events-auto cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => goToPhase(phase + 1)}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Mouse icon */}
                  <svg width="24" height="36" viewBox="0 0 24 36" fill="none" className="text-muted-foreground dark:text-[#00d4ff]/60">
                    <rect x="1" y="1" width="22" height="34" rx="11" stroke="currentColor" strokeWidth="1.5" />
                    <motion.line
                      x1="12" y1="8" x2="12" y2="14"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      animate={{ y1: [8, 12, 8], y2: [14, 18, 14] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      <footer className="fixed bottom-0 left-0 right-0 z-10 py-6 text-center">
        <p className="text-sm text-muted-foreground dark:text-[#00d4ff] font-roc">
          © {new Date().getFullYear()} Romer Garcia. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Paradoxxia;
