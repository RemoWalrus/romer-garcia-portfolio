import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import circuitBg from "@/assets/paradoxxia-bg.png";

const titleStyle = {
  fontWeight: 400,
  fontFamily: '"ab-karuta-bold", sans-serif',
  letterSpacing: '-0.1em',
};

const Paradoxxia = () => {
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
      {/* Circuit board background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${circuitBg})` }}
      />
      {/* Lighten background in light mode */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-white/30 dark:bg-transparent" />

      {/* SVG pixelation filter */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <defs>
          <filter id="pixelate-in">
            <feFlood x="0" y="0" width="8" height="8" />
            <feComposite width="8" height="8" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="4" />
          </filter>
        </defs>
      </svg>

      <div className="min-h-full flex flex-col items-center justify-center relative z-10">
        <h1 className="flex flex-col items-center relative">
          <span className="relative inline-block">
            {/* Red channel ghost */}
            <motion.span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none text-[rgba(255,0,0,0.22)] dark:text-[rgba(255,0,0,0.4)]"
              aria-hidden
              initial={{ opacity: 0, x: 30, y: -0.5, skewX: 4, filter: 'url(#pixelate-in) blur(2px)' }}
              animate={{
                opacity: [0, 0.8, 0.6, 0.8, 1],
                x: [30, -12, 8, -4, 2.5],
                y: -0.5,
                skewX: [4, -2, 1.5, -0.5, 0.3],
                filter: [
                  'url(#pixelate-in) blur(2px)',
                  'url(#pixelate-in) blur(1px)',
                  'none',
                  'none',
                  'none',
                ],
              }}
              transition={{ duration: 0.8, ease: [0.16, 0.84, 0.44, 1], times: [0, 0.25, 0.5, 0.75, 1] }}
              style={{ ...titleStyle, mixBlendMode: 'screen' }}
            >
              パラドクシア
            </motion.span>

            {/* Cyan channel ghost */}
            <motion.span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none text-[rgba(0,255,255,0.18)] dark:text-[rgba(0,255,255,0.35)]"
              aria-hidden
              initial={{ opacity: 0, x: -30, y: 0.5, skewX: -4, filter: 'url(#pixelate-in) blur(2px)' }}
              animate={{
                opacity: [0, 0.7, 0.5, 0.7, 1],
                x: [-30, 10, -6, 3, -2],
                y: 0.5,
                skewX: [-4, 2, -1, 0.4, -0.2],
                filter: [
                  'url(#pixelate-in) blur(2px)',
                  'url(#pixelate-in) blur(1px)',
                  'none',
                  'none',
                  'none',
                ],
              }}
              transition={{ duration: 0.8, ease: [0.16, 0.84, 0.44, 1], times: [0, 0.25, 0.5, 0.75, 1] }}
              style={{ ...titleStyle, mixBlendMode: 'screen' }}
            >
              パラドクシア
            </motion.span>

            {/* Main title */}
            <motion.span
              className="text-[3.2rem] md:text-9xl text-[#0a1e5c] dark:text-[#00d4ff] relative z-10"
              initial={{ opacity: 0, filter: 'url(#pixelate-in)' }}
              animate={{
                opacity: [0, 0, 0.6, 1],
                filter: [
                  'url(#pixelate-in)',
                  'url(#pixelate-in)',
                  'none',
                  'none',
                ],
              }}
              transition={{ duration: 0.9, ease: [0.16, 0.84, 0.44, 1], times: [0, 0.3, 0.6, 1] }}
              style={{
                ...titleStyle,
                textShadow: '0.5px 0 0 rgba(255,0,0,0.25), -0.5px 0 0 rgba(0,255,255,0.25)',
              }}
            >
              パラドクシア
            </motion.span>
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
