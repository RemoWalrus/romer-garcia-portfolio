import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { glitchVariants, pixelGlitch } from "@/components/hero/animation-variants";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import circuitBg from "@/assets/paradoxxia-bg.png";

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

      <div className="min-h-full flex flex-col items-center justify-center relative z-10">
        <h1 className="flex flex-col items-center">
          <span className="relative inline-block">
            {/* Red channel ghost */}
            <span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none text-[rgba(255,0,0,0.22)] dark:text-[rgba(255,0,0,0.4)]"
              aria-hidden
              style={{
                fontWeight: 400,
                fontFamily: '"ab-karuta-bold", sans-serif',
                letterSpacing: '-0.1em',
                transform: 'translateX(2.5px) translateY(-0.5px) skewX(0.3deg)',
                mixBlendMode: 'screen',
              }}
            >
              パラドクシア
            </span>
            {/* Cyan channel ghost */}
            <span
              className="text-[3.2rem] md:text-9xl absolute inset-0 pointer-events-none text-[rgba(0,255,255,0.18)] dark:text-[rgba(0,255,255,0.35)]"
              aria-hidden
              style={{
                fontWeight: 400,
                fontFamily: '"ab-karuta-bold", sans-serif',
                letterSpacing: '-0.1em',
                transform: 'translateX(-2px) translateY(0.5px) skewX(-0.2deg)',
                mixBlendMode: 'screen',
              }}
            >
              パラドクシア
            </span>
            {/* Main title */}
            <span
              className="text-[3.2rem] md:text-9xl text-[#0a1e5c] dark:text-[#00d4ff] relative z-10"
              style={{
                fontWeight: 400,
                fontFamily: '"ab-karuta-bold", sans-serif',
                letterSpacing: '-0.1em',
                textShadow: '0.5px 0 0 rgba(255,0,0,0.25), -0.5px 0 0 rgba(0,255,255,0.25)',
              }}
            >
              パラドクシア
            </span>
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
