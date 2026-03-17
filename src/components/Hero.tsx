import { useEffect, useRef, useState } from 'react';
import { getProxiedData } from '@/utils/proxyHelper';
import type { TitleConfig } from './hero/title-config';
import { HeroBackground } from './hero/HeroBackground';
import { HeroContent } from './hero/HeroContent';
import { usePerformanceTier } from '@/hooks/use-performance';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
  const { tier, prefersReducedMotion } = usePerformanceTier();
  const [titleIndex, setTitleIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [triggerNewBackground, setTriggerNewBackground] = useState(0);
  const [titles, setTitles] = useState<TitleConfig[]>([]);
  const isSnapping = useRef(false);
  const snapCooldown = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const data = await getProxiedData('hero_titles', {
          order: 'sort_order:asc',
        });

        if (data) {
          setTitles(data);
        }
      } catch (error) {
        console.error('Error fetching hero titles:', error);
      }
    };

    fetchTitles();
  }, []);

  useEffect(() => {
    if (titles.length > 0 && titleIndex === titles.length - 1) {
      const timer = setTimeout(() => {
        setShowVideo(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [titleIndex, titles.length]);

  useEffect(() => {
    if (titles.length > 0 && titleIndex < titles.length - 1) {
      const timer = setTimeout(() => {
        setTitleIndex((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [titleIndex, titles.length]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let raf = 0;

    const handleScroll = () => {
      if (raf) return;

      raf = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY === 0 && lastScrollY > 50) {
          setTriggerNewBackground((prev) => prev + 1);
        }
        lastScrollY = currentY;
        raf = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const pointerIsFine = window.matchMedia('(pointer: fine)').matches;
    const enableSnap = tier === 'full' && !prefersReducedMotion && pointerIsFine;

    if (!enableSnap) {
      return;
    }

    const heroEl = document.getElementById('hero');
    const heroHeight = heroEl ? heroEl.getBoundingClientRect().height : window.innerHeight;
    let settleTimeout: ReturnType<typeof setTimeout> | null = null;

    const getPortfolioTop = () => {
      const el = document.getElementById('portfolio');
      if (!el) return heroHeight;
      return el.getBoundingClientRect().top + window.scrollY;
    };

    const snapTo = (targetY: number) => {
      if (isSnapping.current) return;
      isSnapping.current = true;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      if (snapCooldown.current) clearTimeout(snapCooldown.current);
      snapCooldown.current = setTimeout(() => {
        isSnapping.current = false;
      }, 700);
    };

    const handleScrollEnd = () => {
      if (settleTimeout) clearTimeout(settleTimeout);

      settleTimeout = setTimeout(() => {
        if (isSnapping.current) return;

        const scrollY = window.scrollY;
        const portfolioTop = getPortfolioTop();

        if (scrollY > 120 && scrollY < portfolioTop * 0.4) {
          snapTo(portfolioTop);
          return;
        }

        if (scrollY > 0 && scrollY < 48) {
          snapTo(0);
          return;
        }

        if (scrollY > portfolioTop - 120 && scrollY < portfolioTop + 80) {
          snapTo(portfolioTop);
        }
      }, 120);
    };

    window.addEventListener('scroll', handleScrollEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollEnd);
      if (settleTimeout) clearTimeout(settleTimeout);
      if (snapCooldown.current) clearTimeout(snapCooldown.current);
    };
  }, [prefersReducedMotion, tier]);

  if (titles.length === 0) {
    return <div className="h-screen" aria-hidden="true" />;
  }

  return (
    <div className="relative h-screen cursor-default">
      <section id="hero" className="fixed inset-0 flex h-screen items-center justify-center overflow-hidden">
        <HeroBackground showVideo={showVideo} triggerNewBackground={triggerNewBackground} />
        <div className="pointer-events-none absolute inset-0 z-10 h-1/2 bg-gradient-to-b from-black/[0.03] via-transparent to-transparent mix-blend-multiply" />
        <HeroContent titles={titles} titleIndex={titleIndex} scrollToSection={scrollToSection} />
      </section>
    </div>
  );
};
