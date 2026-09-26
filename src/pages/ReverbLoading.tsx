import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1583183641070-7886c3520620?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&h=900&fit=crop",
  "https://images.unsplash.com/photo-1578321272176-ffa6c0e83d42?w=1400&h=900&fit=crop",
];

const ReverbLoading = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [fontWeight, setFontWeight] = useState(800);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontSize, setFontSize] = useState(200);
  const [randomImage, setRandomImage] = useState("");
  const [letterDistances, setLetterDistances] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    // Set a random gallery image
    const randomIndex = Math.floor(Math.random() * GALLERY_IMAGES.length);
    setRandomImage(GALLERY_IMAGES[randomIndex]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      const distX = (pointerX - centerX) / centerX;
      const distY = (pointerY - centerY) / centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // Font weight variation: 700-900 based on horizontal mouse position (defaults to 800 at center)
      const weight = Math.max(700, Math.min(900, 800 + distX * 100));
      setFontWeight(Math.round(weight));

      // Letter spacing variation: based on distance from center (tighter than before)
      const spacing = Math.max(-2, Math.min(4, -0.5 + distance * 3));
      setLetterSpacing(Math.round(spacing * 100) / 100);

      // Subtle font size variation
      const size = Math.max(160, Math.min(240, 200 + distY * 40));
      setFontSize(Math.round(size));

      // Calculate individual distance for each letter
      const distances = letterRefs.current.map((letterEl) => {
        if (!letterEl) return 0;
        const letterRect = letterEl.getBoundingClientRect();
        const letterCenterX = letterRect.left - rect.left + letterRect.width / 2;
        const letterCenterY = letterRect.top - rect.top + letterRect.height / 2;
        const dx = pointerX - letterCenterX;
        const dy = pointerY - letterCenterY;
        return Math.sqrt(dx * dx + dy * dy);
      });
      setLetterDistances(distances);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const ReverbWordmark = ({ style }: { style?: React.CSSProperties }) => {
    const word = "REVERB".split("");

    return (
      <span
        ref={wordmarkRef}
        className="inline-flex gap-0 font-roc font-extrabold italic uppercase tracking-normal transition-all duration-75"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          letterSpacing: `${letterSpacing}px`,
          color: "var(--reverb-wordmark)",
          lineHeight: 1,
          ...style,
        }}
        aria-label="Reverb"
      >
        {word.map((letter, index) => {
          // Calculate individual letter reactivity based on pointer distance
          const letterDist = letterDistances[index] || 0;
          // Normalize distance (0-500px) to a scale factor
          const proximityScale = Math.max(0.8, Math.min(1.2, 1 - letterDist / 600));

          // Build transforms for each letter
          let transform = `scale(${proximityScale})`;
          let marginStyle: React.CSSProperties = {};

          if (index === 1) {
            // Reversed E: scaleX(-1), skew, and subtle rotation, and scale
            transform = `scaleX(-1) skewX(10deg) rotate(-2deg) scale(${proximityScale})`;
            marginStyle = { marginLeft: "0.14em", marginRight: "0.04em" };
          } else if (index === 2) {
            // V: tight negative margin from ReverbHeader
            marginStyle = { marginLeft: "-0.27em" };
          }

          return (
            <span
              key={`${letter}-${index}`}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              className="inline-block"
              style={{
                ...marginStyle,
                transform,
                willChange: "transform",
                transformOrigin: "center",
              }}
              aria-hidden="true"
            >
              {letter}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <>
      <Helmet>
        <title>Loading — Reverb</title>
        <meta name="description" content="Reverb is loading..." />
      </Helmet>

      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-background transition-colors"
      >
        {/* Background image with frosted glass effect */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('${randomImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.7) contrast(1.1) blur(8px)",
          }}
        />

        {/* Frosted glass overlay */}
        <div
          className="absolute inset-0 w-full h-full backdrop-blur-xl transition-colors"
          style={{
            background:
              "var(--reverb-wordmark) === '225 80% 20%' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.35)'",
            WebkitBackdropFilter: "blur(12px)",
            backdropFilter: "blur(12px)",
          }}
        />

        {/* CSS-based frosted glass with theme support */}
        <style>{`
          :root.light {
            --glass-bg: rgba(255, 255, 255, 0.15);
          }
          :root.dark,
          :root[data-theme="dark"] {
            --glass-bg: rgba(0, 0, 0, 0.35);
          }
          @media (prefers-color-scheme: light) {
            :root:not([data-theme="dark"]) {
              --glass-bg: rgba(255, 255, 255, 0.15);
            }
          }
          @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) {
              --glass-bg: rgba(0, 0, 0, 0.35);
            }
          }
        `}</style>

        <div
          className="absolute inset-0"
          style={{
            background: "var(--glass-bg, rgba(255, 255, 255, 0.15))",
            WebkitBackdropFilter: "blur(12px)",
            backdropFilter: "blur(12px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center pointer-events-none select-none">
          <ReverbWordmark />
          <div className="mt-12 text-sm md:text-base uppercase tracking-widest text-foreground/70 animate-pulse font-roc">
            Loading frequency...
          </div>
        </div>
      </div>
    </>
  );
};

export default ReverbLoading;
