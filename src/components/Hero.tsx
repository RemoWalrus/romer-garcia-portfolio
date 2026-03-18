import { useEffect, useState, useCallback, useRef } from 'react';
import { getProxiedData } from "@/utils/proxyHelper";
import type { TitleConfig } from './hero/title-config';
import { HeroBackground } from './hero/HeroBackground';
import { HeroContent } from './hero/HeroContent';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
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
          order: 'sort_order:asc'
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
        setTitleIndex(prev => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [titleIndex, titles.length]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY === 0 && lastScrollY > 50) {
          setTriggerNewBackground(prev => prev + 1);
        }
        lastScrollY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll snap: hero ↔ portfolio
  useEffect(() => {
    const heroEl = document.querySelector('.h-screen');
    const heroHeight = heroEl ? heroEl.getBoundingClientRect().height : window.innerHeight;

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
      }, 1000);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isSnapping.current) {
        e.preventDefault();
        return;
      }
      const scrollY = window.scrollY;
      const portfolioTop = getPortfolioTop();
      // In hero zone scrolling down
      if (scrollY < portfolioTop * 0.5 && e.deltaY > 0) {
        e.preventDefault();
        snapTo(portfolioTop);
      }
      // Near portfolio top scrolling up
      else if (scrollY <= portfolioTop + 100 && scrollY > 0 && e.deltaY < 0) {
        e.preventDefault();
        snapTo(0);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSnapping.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const delta = touchStartY - touchEndY;
      const scrollY = window.scrollY;
      const portfolioTop = getPortfolioTop();

      // Swipe down (scroll content down) from hero
      if (delta > 30 && scrollY < portfolioTop * 0.5) {
        snapTo(portfolioTop);
      }
      // Swipe up (scroll content up) near portfolio
      else if (delta < -30 && scrollY <= portfolioTop + 100 && scrollY > 0) {
        snapTo(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (snapCooldown.current) clearTimeout(snapCooldown.current);
    };
  }, []);

  if (titles.length === 0) {
    return null;
  }

  return (
    <div className="h-screen relative cursor-default">
      <section id="hero" className="fixed inset-0 h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground showVideo={showVideo} triggerNewBackground={triggerNewBackground} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] to-transparent via-transparent h-1/2 mix-blend-multiply pointer-events-none z-10" />
        <HeroContent
          titles={titles}
          titleIndex={titleIndex}
          scrollToSection={scrollToSection}
        />
      </section>
    </div>
  );
};