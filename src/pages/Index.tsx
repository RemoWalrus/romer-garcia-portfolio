
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Quote } from '@/components/Quote';
import { ImageGallery } from '@/components/ImageGallery';
import { GoogleAnalytics, trackEvent } from '@/components/GoogleAnalytics';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    if (section) {
      const headerOffset = 50;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Track section visit
      trackEvent('Navigation', 'Section Visit', sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('Navigation', 'Scroll to Top');
  };

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col overflow-x-hidden">
      <Helmet>
        <title>Romer Garcia | Strategic Thinker | Design Innovator | Digital Media Leader</title>
        <meta name="description" content="STRATEGIC THINKER | DESIGN INNOVATOR | DIGITAL MEDIA LEADER. Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations. Known as a visionary problem solver, seamlessly blending strategy, creativity, and technology to craft compelling visual narratives." />
        <meta name="keywords" content="Design Lead, Multimedia Designer, Digital Media, Brand Transformation, Visual Narrative, Creative Strategy, Digital Campaigns" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Romer Garcia | Strategic Thinker | Design Innovator | Digital Media Leader" />
        <meta property="og:description" content="Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://romergarcia.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Romer Garcia | Strategic Thinker | Design Innovator" />
        <meta name="twitter:description" content="Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations." />
      </Helmet>
      <ThemeToggle />
      <GoogleAnalytics />
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
      <ImageGallery />
      <Contact />
      <Quote />
      <Footer />
    </div>
  );
};

export default Index;
