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
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setTriggerNewBackground(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (titles.length === 0) {
    return null;
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground showVideo={showVideo} triggerNewBackground={triggerNewBackground} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] to-transparent via-transparent h-1/2 mix-blend-multiply pointer-events-none z-10" />
      <HeroContent
        titles={titles}
        titleIndex={titleIndex}
        scrollToSection={scrollToSection}
      />
    </section>
  );
};
