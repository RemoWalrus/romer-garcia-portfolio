import { useEffect, useState } from "react";

interface GlitchTitleProps {
  /** Subtitle rendered under the title, alternating weights per word */
  subtitleWords: string[];
  compact?: boolean;
}

const titleFont = {
  fontWeight: 400,
  fontFamily: '"ab-karuta-bold", sans-serif',
  letterSpacing: '-0.15em',
};

const englishFont = {
  fontWeight: 800,
  fontFamily: '"roc-grotesk", sans-serif',
  letterSpacing: '-0.05em',
};

/**
 * Paradoxxia chromatic-glitch wordmark that randomly swaps between
 * katakana and latin spellings. Presentation only.
 */
const GlitchTitle = ({ subtitleWords, compact = false }: GlitchTitleProps) => {
  const [titleText, setTitleText] = useState<'katakana' | 'english'>('katakana');
  const [titleZoom, setTitleZoom] = useState(1);
  const [switchBurst, setSwitchBurst] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 10000 + Math.random() * 20000;
      timeout = setTimeout(() => {
        setTitleZoom(Math.random() > 0.5 ? 1.15 + Math.random() * 0.1 : 0.78 + Math.random() * 0.08);
        setSwitchBurst(1);
        setTimeout(() => setTitleText((p) => (p === 'katakana' ? 'english' : 'katakana')), 40);
        setTimeout(() => {
          setSwitchBurst(0);
          setTitleZoom(1);
        }, 120);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  const currentText = titleText === 'katakana' ? 'パラドクシア' : 'PARADOXXIA';
  const currentFont = titleText === 'katakana' ? titleFont : englishFont;

  const b = switchBurst;
  const chromatic = b * 18;
  const skew = b * 6 * (titleText === 'english' ? -1 : 1);
  const scanOp = b * 0.7;
  const textSizeClass = compact
    ? 'text-3xl md:text-5xl'
    : 'text-5xl md:text-7xl lg:text-9xl';
  const mainColor = 'text-[#0a1e5c] dark:text-[#00d4ff]';

  return (
    <span className="flex flex-col items-center" style={{ transform: `scale(${titleZoom})` }}>
      <span className="relative inline-block">
        <span
          className={`${textSizeClass} absolute inset-0 pointer-events-none`}
          aria-hidden
          style={{
            ...currentFont,
            mixBlendMode: 'screen',
            color: `rgba(255,0,0,${0.22 + b * 0.5})`,
            transform: `translateX(${2.5 + chromatic * 0.7}px) translateY(${b * -3}px) skewX(${skew * 0.8}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentText}
        </span>

        <span
          className={`${textSizeClass} absolute inset-0 pointer-events-none`}
          aria-hidden
          style={{
            ...currentFont,
            mixBlendMode: 'screen',
            color: `rgba(0,255,255,${0.18 + b * 0.45})`,
            transform: `translateX(${-2 - chromatic * 0.6}px) translateY(${b * 2}px) skewX(${-skew * 0.6}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentText}
        </span>

        <span
          className={`${textSizeClass} ${mainColor} relative z-10`}
          style={{
            ...currentFont,
            filter: b > 0.3 ? `hue-rotate(${b * 40}deg)` : undefined,
            transform: `skewX(${skew}deg)`,
            textShadow: `${chromatic * 0.5}px ${b * 2}px 0 rgba(255,0,0,${0.35 + b * 0.4}), ${-chromatic * 0.5}px ${b * -1}px 0 rgba(0,255,255,${0.35 + b * 0.4})`,
          }}
        >
          {currentText}
        </span>

        <span
          className="absolute inset-0 pointer-events-none z-20"
          aria-hidden
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${0.12 + scanOp * 0.4}) 2px, rgba(0,0,0,${0.12 + scanOp * 0.4}) 4px)`,
            opacity: scanOp,
          }}
        />
      </span>
      <span className="inline-flex items-baseline flex-wrap justify-center">
        {subtitleWords.map((word, i) => (
          <span
            key={`${word}-${i}`}
            style={{ fontWeight: i % 2 === 0 ? 100 : 500 }}
            className={i === 0 ? '' : 'ml-2'}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
};

export default GlitchTitle;
