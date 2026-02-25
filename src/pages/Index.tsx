
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
import { PersonSchema } from '@/components/seo/JsonLdSchemas';
import { getProxiedData } from '@/utils/proxyHelper';

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProxiedData('projects', {
          order: 'sort_order:asc'
        });
        if (data) setProjects(data);
      } catch (error) {
        console.error('Error fetching projects for schema:', error);
      }
    };
    fetchProjects();
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
        <title>Romer Garcia | Design Lead & AI-Driven Multimedia Strategist</title>
        <meta name="description" content="Romer Garcia is a U.S. Army veteran turned Design Lead specializing in AI-assisted design, multimedia strategy, and brand transformation. Explore his portfolio of high-impact digital campaigns." />
        <meta name="keywords" content="Romer Garcia, Design Lead, Multimedia Designer, AI Design, Digital Media, Brand Transformation, U.S. Army Veteran, Creative Strategy, Digital Campaigns, Generative AI" />
        <link rel="canonical" href="https://romergarcia.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Romer Garcia | Design Lead & AI-Driven Multimedia Strategist" />
        <meta property="og:description" content="U.S. Army veteran turned Design Lead. Explore high-impact digital campaigns blending AI, strategy, and visual storytelling." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://romergarcia.com" />
        <meta property="og:image" content="https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/graphics/RomerGarcia-cover.svg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Romer Garcia | Design Lead & AI-Driven Multimedia Strategist" />
        <meta name="twitter:description" content="U.S. Army veteran turned Design Lead. Explore high-impact digital campaigns blending AI, strategy, and visual storytelling." />
        <meta name="twitter:image" content="https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/graphics/RomerGarcia-cover.svg" />
      </Helmet>
      <PersonSchema projects={projects} />
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
      
      <main>
        <Hero scrollToSection={scrollToSection} />
        <Portfolio />
        <About />
        <ImageGallery />
        <Contact />
        <Quote />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
