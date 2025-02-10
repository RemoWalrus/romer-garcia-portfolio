
/*
██████╗  ██████╗ ███╗   ███╗███████╗██████╗ GARCIA
██╔══██╗██╔═══██╗████╗ ████║██╔════╝██╔══██╗
██████╔╝██║   ██║██╔████╔██║█████╗  ██████╔╝
██╔══██╗██║   ██║██║╚██╔╝██║██╔══╝  ██╔══██╗
██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝
*/

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-neutral-950">
      <div className="fixed inset-0 pointer-events-none z-[1] mix-blend-overlay opacity-5">
        <div className="absolute inset-0 animate-scanline" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 2px)',
          backgroundSize: '100% 4px',
        }} />
      </div>

      <Navigation 
        scrolled={scrolled} 
        scrollToSection={scrollToSection}
        scrollToTop={scrollToTop}
      />
      
      <Hero scrollToSection={scrollToSection} />
      <Portfolio />
      <About />
      <Contact />
    </div>
  );
};

export default Index;
