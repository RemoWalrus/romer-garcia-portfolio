import { useEffect, useState } from 'react';
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
    const handleScroll = () => {
      const currentY = window.scrollY;
      // Only trigger new background when user scrolls back to top (not on initial load or downward scroll)
      if (currentY === 0 && lastScrollY > 50) {
        setTriggerNewBackground(prev => prev + 1);
      }
      lastScrollY = currentY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Snap scroll: any downward scroll from hero snaps to portfolio
  useEffect(() => {
    let snapping = false;
    let wasAtTop = true;

    const snapToPortfolio = () => {
      if (snapping) return;
      snapping = true;
      const portfolio = document.getElementById('portfolio');
      if (portfolio) {
        const offsetPosition = portfolio.getBoundingClientRect().top + window.pageYOffset - 50;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      setTimeout(() => { snapping = false; }, 1000);
    };

    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // If user is in the hero zone (scrolled a little but not past hero)
      // and was previously at top, snap to portfolio
      if (wasAtTop && scrollY > 5 && scrollY < heroHeight * 0.8) {
        snapToPortfolio();
      }

      wasAtTop = scrollY < 5;
    };

    // Also handle wheel to prevent partial scrolling
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY < 5 && e.deltaY > 0) {
        e.preventDefault();
        snapToPortfolio();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
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
