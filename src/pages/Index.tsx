
import { useEffect, useState } from 'react';
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

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const meta = usePageMeta(undefined, {
    title: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
    description: 'Romer Garcia is a Design Lead and AI-driven multimedia strategist with a U.S. Army background. Browse his portfolio of digital campaigns, brand identity systems, AI-powered creative tools, and multimedia projects that blend strategy with visual storytelling.',
    keywords: 'Romer Garcia, Design Lead, Multimedia Designer, AI Design, Digital Media, Brand Transformation, U.S. Army Veteran, Creative Strategy, Digital Campaigns, Generative AI',
    ogTitle: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
    ogDescription: 'Design Lead & AI-driven multimedia strategist. Browse his portfolio of digital campaigns, AI-powered tools, and brand identity projects.',
    ogUrl: 'https://romergarcia.com',
    ogImage: getProxyUrl('profile', 'RomerSelfPortrait.jpg'),
    twitterTitle: 'Romer Garcia | Design Lead & AI-Driven Multimedia Strategist',
    twitterDescription: 'U.S. Army veteran turned Design Lead. Explore high-impact digital campaigns blending AI, strategy, and visual storytelling.',
    twitterImage: getProxyUrl('profile', 'RomerSelfPortrait.jpg'),
  });

  useEffect(() => {
    console.log(`
                                              *                            
                                @@@-%@@@@@@@@@@  =@@@                         
                              @@% +@@ @@@@@+%@@@@@@@@@@@                        
                            %@@@@@@  : @ : @@@ @@@@+  -                            
                          @ @.*:@@@  @ @@ ##@@@@%@@@@@                              
                          @-@ # .  #@@@+.%          @@@@                             
                       @@@@. *@ @@@-   @                 %                             
                      @@@@ @ :    @ @@@               @@*@@+                            
                     @@ .@@@ @ @:@@ @#            @@@@@@=#@                             
                     @ @ #:@ @@ @-@ @  -  =     -@@*#@+  @@@@-@@@                        
                     @@% -@%@  @@#:@ .  .#     = %%@* @@@* @@   @                          
                    @@@-=@ @ @  @ @:  %-.   -@@@@@ @  @@@  @   :@                            
                    @@.@++ * %@+* @:= *.@@@ ..      + :   @@    *                            
                     @=@%*@%@@ @#@@@@@@@@@        @@@@.  = @  @@@                             
                     @@%#%%% %#@     @  @              @@@ @@@@                                
                      @@##@+*- #@@@@@+ + @..     :...   --@@. .:@@                               
                       @@#%-@@@@  %@@    @ :      .     #* @% @@%@                               
                        @#%#%%%** %@@ %  -@ @ . . .   ..=    @@*%                                
                        @@@%%%#@@ .     . .#.+=.@  @. . :%.%@%##@@*                              
                          @@@%-%@@@@: .%=  +:+*- % *+*%@*@@%##%#%@@                              
                            @@@@#%#@+@@@@.:@+*#@@@#%#@%@@#+%###:#%@                              
                              =@@@%@* @@@%*+*@%%##@%#%%%+%%%%#%*%+@                              
                                 @@@@.. .+@#%#%%%#%%%%%%%%##%%##%@@                              
                                   @@+++.-=%%%%:%%#%##%=%#%%#%@@@@                               
                                     %==+--+#%%%%%%%##%%%#####@                                  
                                     @--=-=-+%#%%####%%%@%%%##@@@@                               
                                    @@:=:--::+#%%%%#%%#*--#%####%@@@@@@@@@@@@@@@ .               
                                  @@@.-=-=--+ --##%%%#-+=#%%##################%@@@@@@@@@@@       
                                 @@%@:=.=::--=-==-+#*+++%%%######%###############%%#%#*-#@@      
                                @@%%%::-:--=+%%##%+#**%%%########################%#=%+*@#*%@     
                               @@##%%@::--=+=*++++=:*%%@@@%%%############%%%%%%%%%%*%%%#=%#@@@   
                            @@@@#####%@@:-+-==+-+==-@@@#*%@@@############%*#####*###%%###%##%@@  
                          @@@#########%%@+=-==+-=+-+@       @#############%%%#%%######%**#%%#%@@ 
                      @@@@@#############%%@----====+#-:..   @###############%###%#%###%%#%#%#%#@%
                     @@%%#################%@@#---::-===--: @@############%#########%#%#%*%##%###*
                  @@@@######################%%@@@@@%===-=::@###########################%#%######*
               @@@@%##############################%%@@@+++@%####################################*
             @@@%#####################################%@#*%#####################################*
            @@%########################################%%%%#####################################*
            @###################################################################################*
           @@###################################################################################*
           @%###################################################################################*
           @####################################################################################*
          @@************************************************************************************+
                                               RomerGarcia.com
`);
  }, []);

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

    const fetchSocialLinks = async () => {
      try {
        const data = await getProxiedData('sections', {
          columns: 'facebook_url,twitter_url,linkedin_url,instagram_url,youtube_url',
          filter: 'section_name:eq:social'
        });
        if (data && data.length > 0) setSocialLinks(data[0]);
      } catch (error) {
        console.error('Error fetching social links for schema:', error);
      }
    };

    fetchProjects();
    fetchSocialLinks();
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
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.ogUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.ogUrl} />
        {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        {meta.twitterImage && <meta name="twitter:image" content={meta.twitterImage} />}
      </Helmet>
      <PersonSchema projects={projects} socialLinks={socialLinks} />
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
        <div className="relative z-10 bg-background">
          <Portfolio />
          <About />
          <ImageGallery />
          <Contact />
          <Quote />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
