import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageMeta } from '@/hooks/use-page-meta';
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
import { getProxyUrl } from '@/utils/supabaseProxy';

const deferredSectionStyle = {
  contentVisibility: 'auto' as const,
  containIntrinsicSize: '900px',
};

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const scrollRaf = useRef<number>(0);
  const meta = usePageMeta(undefined, {
    title: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
    description:
      'Romer Garcia is a Design Lead and AI-driven multimedia strategist with a U.S. Army background. Browse his portfolio of digital campaigns, brand identity systems, AI-powered creative tools, and multimedia projects that blend strategy with visual storytelling.',
    keywords:
      'Romer Garcia, Design Lead, Multimedia Designer, AI Design, Digital Media, Brand Transformation, U.S. Army Veteran, Creative Strategy, Digital Campaigns, Generative AI',
    ogTitle: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
    ogDescription:
      'Design Lead & AI-driven multimedia strategist. Browse his portfolio of digital campaigns, AI-powered tools, and brand identity projects.',
    ogUrl: 'https://romergarcia.com',
    ogImage: getProxyUrl('graphics', 'RomerGarcia-cover.svg'),
    twitterTitle: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
    twitterDescription:
      'U.S. Army veteran turned Design Lead. Explore high-impact digital campaigns blending AI, strategy, and visual storytelling.',
    twitterImage: getProxyUrl('graphics', 'RomerGarcia-cover.svg'),
  });

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('RomerGarcia.com');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRaf.current) return;

      scrollRaf.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        scrollRaf.current = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    };
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [projectsData, socialData] = await Promise.all([
          getProxiedData('projects', {
            order: 'sort_order:asc',
          }),
          getProxiedData('sections', {
            columns: 'facebook_url,twitter_url,linkedin_url,instagram_url,youtube_url',
            filter: 'section_name:eq:social',
          }),
        ]);

        if (projectsData) setProjects(projectsData);
        if (socialData && socialData.length > 0) setSocialLinks(socialData[0]);
      } catch (error) {
        console.error('Error fetching index page data:', error);
      }
    };

    fetchPageData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 50;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      trackEvent('Navigation', 'Section Visit', sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('Navigation', 'Scroll to Top');
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-neutral-950">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.ogUrl} />

        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.ogUrl} />
        {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        {meta.twitterImage && <meta name="twitter:image" content={meta.twitterImage} />}
      </Helmet>
      <PersonSchema projects={projects} socialLinks={socialLinks} />
      <ThemeToggle />
      <GoogleAnalytics />
      <div className="fixed inset-0 z-[1] pointer-events-none mix-blend-overlay opacity-5">
        <div
          className="absolute inset-0 animate-scanline"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 2px)',
            backgroundSize: '100% 4px',
          }}
        />
      </div>

      <Navigation scrolled={scrolled} scrollToSection={scrollToSection} scrollToTop={scrollToTop} />

      <main>
        <Hero scrollToSection={scrollToSection} />
        <div className="relative z-10 bg-background">
          <div style={deferredSectionStyle}>
            <Portfolio />
          </div>
          <div style={deferredSectionStyle}>
            <About />
          </div>
          <div style={deferredSectionStyle}>
            <ImageGallery />
          </div>
          <div style={deferredSectionStyle}>
            <Contact />
          </div>
          <div style={deferredSectionStyle}>
            <Quote />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
