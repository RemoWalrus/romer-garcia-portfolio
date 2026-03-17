import { useEffect, useState } from 'react';
import { getProxyUrl } from '@/utils/supabaseProxy';
import { usePerformanceTier } from '@/hooks/use-performance';

interface HeroBackgroundProps {
  showVideo: boolean;
  triggerNewBackground: number;
}

const IMAGE_NAMES = [
  'dualshadow.jpg',
  'evenbrite-cover.jpg',
  'hautesummer.jpg',
  'militarychild.jpg',
  'remowalrusdiablo.jpg',
  'romergarciacover.jpg',
  'worldzoom.jpg',
];

export const HeroBackground = ({ showVideo, triggerNewBackground }: HeroBackgroundProps) => {
  const { tier, prefersReducedMotion, saveData } = usePerformanceTier();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const videoUrl = getProxyUrl('graphics', 'staticglitchy.mp4');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * IMAGE_NAMES.length);
    const randomImageName = IMAGE_NAMES[randomIndex];
    setBackgroundImage(getProxyUrl('images', randomImageName));
  }, [triggerNewBackground]);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (!showVideo || tier === 'lite' || prefersReducedMotion || saveData) {
      setShouldLoadVideo(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const enableVideo = () => setShouldLoadVideo(true);

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(enableVideo, { timeout: 1400 });
    } else {
      timeoutId = setTimeout(enableVideo, 700);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      }
    };
  }, [prefersReducedMotion, saveData, showVideo, tier]);

  if (!backgroundImage) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isDarkMode
            ? 'from-black/10 via-black/5 to-transparent mix-blend-multiply'
            : 'from-white/20 via-white/10 to-transparent mix-blend-overlay'
        } z-10`}
      />

      <div className="relative h-full w-full">
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            showVideo && shouldLoadVideo ? 'opacity-0' : isDarkMode ? 'opacity-40' : 'opacity-60'
          }`}
        />

        {shouldLoadVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={backgroundImage}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              showVideo ? (isDarkMode ? 'opacity-20' : 'opacity-30') : 'opacity-0'
            }`}
            src={videoUrl}
          />
        )}
      </div>
    </div>
  );
};
