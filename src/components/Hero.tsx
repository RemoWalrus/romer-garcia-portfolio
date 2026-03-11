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
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [titleIndex, titles.length]);

  useEffect(() => {
    if (titles.length > 0 && titleIndex < titles.length - 1) {
      const timer = setTimeout(() => {
        setTitleIndex(prev => prev + 1);
      }, 800); // Increased slightly to give more time for easeOutQuart animation
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

  if (titles.length === 0) {
    return null;
  }

  return (
    <div className="h-screen relative cursor-default">
      <section className="fixed inset-0 h-screen flex items-center justify-center overflow-hidden">
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
