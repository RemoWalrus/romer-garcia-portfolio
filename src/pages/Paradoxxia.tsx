import { Helmet } from "react-helmet-async";
import { usePageMeta } from "@/hooks/use-page-meta";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ParadoxxiaLandingSchema } from "@/components/seo/ParadoxxiaSchemas";
import { motion, useAnimation, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import circuitBg from "@/assets/paradoxxia-bg.png";

const Paradoxxia = () => {
  const [intro, setIntro] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const [gi, setGi] = useState(0); // glitch intensity from scroll
  
  const scrollGlitch = useTransform(scrollY, [0, 500], [0, 1]);
  useMotionValueEvent(scrollGlitch, "change", (v) => setGi(v));
  
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
      <div ref={scrollRef} className="fixed inset-0 bg-background overflow-x-hidden overflow-y-auto">
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

      {/* Scrollable content — 2x viewport height to allow scroll */}
      <div className="min-h-[200vh] relative z-10">
        {/* Sticky title container */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
          <h1 className="flex flex-col items-center">
            <span className="relative inline-block">
              {/* --- Before switch: katakana. After switch: PARADOXXIA --- */}
              {(() => {
                const switchPoint = 0.5;
                const switched = gi >= switchPoint;
                // Glitch intensity peaks at the switch point
                const distFromSwitch = Math.abs(gi - switchPoint);
                const burstZone = Math.max(0, 1 - distFromSwitch / 0.15); // 1.0 at switch, 0 outside ±0.15
                const preGlitch = switched ? 0 : gi / switchPoint; // 0→1 approaching switch
                const postSettle = switched ? Math.min(1, (gi - switchPoint) / 0.3) : 0; // 0→1 settling after switch
                const chromatic = burstZone * 18 + (switched ? (1 - postSettle) * 6 : preGlitch * 8);
                const skew = burstZone * 6 * (switched ? -1 : 1);
                const scanOp = burstZone * 0.7 + (switched ? 0 : preGlitch * 0.15);

                const textClass = "text-[3.2rem] md:text-9xl";
                const mainColor = "text-[#0a1e5c] dark:text-[#00d4ff]";

                const currentFont = switched
                  ? { fontWeight: 800, fontFamily: '"roc-grotesk", sans-serif', letterSpacing: '-0.05em' }
                  : titleFont;
                const currentText = switched ? 'PARADOXXIA' : 'パラドクシア';

                return (
                  <>
                    {/* Red channel ghost */}
                    <span
                      className={`${textClass} absolute inset-0 pointer-events-none`}
                      aria-hidden
                      style={{
                        ...currentFont,
                        mixBlendMode: 'screen',
                        color: `rgba(255,0,0,${0.22 + burstZone * 0.5})`,
                        transform: `translateX(${2.5 + chromatic * 0.7}px) translateY(${burstZone * -3}px) skewX(${skew * 0.8}deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {currentText}
                    </span>

                    {/* Cyan channel ghost */}
                    <span
                      className={`${textClass} absolute inset-0 pointer-events-none`}
                      aria-hidden
                      style={{
                        ...currentFont,
                        mixBlendMode: 'screen',
                        color: `rgba(0,255,255,${0.18 + burstZone * 0.45})`,
                        transform: `translateX(${-2 - chromatic * 0.6}px) translateY(${burstZone * 2}px) skewX(${-skew * 0.6}deg)`,
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
                        filter: burstZone > 0.3 ? `url(#paradox-pixelate) hue-rotate(${burstZone * 40}deg)` : (preGlitch > 0.3 ? `hue-rotate(${preGlitch * 15}deg)` : undefined),
                        transform: `skewX(${skew}deg)`,
                        textShadow: `
                          ${chromatic * 0.5}px ${burstZone * 2}px 0 rgba(255,0,0,${0.35 + burstZone * 0.4}),
                          ${-chromatic * 0.5}px ${burstZone * -1}px 0 rgba(0,255,255,${0.35 + burstZone * 0.4})
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

                    {/* Scan line overlay — peaks at switch */}
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
                          transform: `translateX(${burstZone * 12 * (switched ? -1 : 1)}px)`,
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
        </div>
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
