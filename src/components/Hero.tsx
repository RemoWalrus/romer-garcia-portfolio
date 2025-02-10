
import { useEffect, useState } from 'react';
import { titles } from './hero/title-config';
import { HeroBackground } from './hero/HeroBackground';
import { HeroContent } from './hero/HeroContent';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    if (titleIndex === titles.length - 1) {
      const timer = setTimeout(() => {
        setShowVideo(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  useEffect(() => {
    if (titleIndex < titles.length - 1) {
      const timer = setTimeout(() => {
        setTitleIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground showVideo={showVideo} />
      <HeroContent
        titles={titles}
        titleIndex={titleIndex}
        scrollToSection={scrollToSection}
      />
    </section>
  );
};
