
import { Menu, X, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface NavigationProps {
  scrolled: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
}

interface SocialLinks {
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
}

export const Navigation = ({ scrolled, scrollToSection, scrollToTop }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
    youtube_url: ''
  });
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const logoUrl = supabase.storage.from('graphics').getPublicUrl(
    scrolled && !prefersDarkMode ? 'romergarcialogoinv.svg' : 'romergarcialogo.svg'
  ).data.publicUrl;

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('facebook_url, twitter_url, linkedin_url, instagram_url, youtube_url')
        .eq('section_name', 'social')
        .maybeSingle();
      
      if (data && !error) {
        setSocialLinks(data);
      }
    };

    fetchSocialLinks();
  }, []);

  const SocialIcon = ({ url, icon: Icon, label }: { url: string; icon: typeof Facebook; label: string }) => {
    if (!url) return null;
    
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-500 hover:text-neutral-300 transition-colors"
        aria-label={label}
      >
        <Icon className="w-5 h-5" />
      </a>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      <div className={`absolute inset-0 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-neutral-200 dark:border-white/10 shadow-sm'
          : 'bg-transparent'
      }`} />

      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-50">
        <button 
          onClick={scrollToTop}
          className="cursor-pointer flex items-center"
          aria-label="Scroll to top"
        >
          <img 
            src={logoUrl} 
            alt="Romer Garcia Logo" 
            className={`transition-all duration-300 ${
              scrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'
            } w-auto object-contain`}
            style={{ maxHeight: 'none' }}
          />
        </button>

        <button
          className={`md:hidden ${scrolled ? 'text-neutral-900 dark:text-white' : 'text-white'} hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('portfolio')}
            className={`text-sm md:text-lg ${scrolled ? 'text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300' : 'text-white hover:text-white/80'} transition-colors uppercase tracking-wider font-roc`}
          >
            Portfolio
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`text-sm md:text-lg ${scrolled ? 'text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300' : 'text-white hover:text-white/80'} transition-colors uppercase tracking-wider font-roc`}
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className={`text-sm md:text-lg ${scrolled ? 'text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300' : 'text-white hover:text-white/80'} transition-colors uppercase tracking-wider font-roc`}
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`text-sm md:text-lg ${scrolled ? 'text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300' : 'text-white hover:text-white/80'} transition-colors uppercase tracking-wider font-roc`}
          >
            Contact
          </button>
        </div>

        <div 
          className={`md:hidden fixed inset-0 bg-white/95 dark:bg-[#070a0f]/95 backdrop-blur-md z-40 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-8">
            <button
              onClick={() => {
                scrollToSection('portfolio');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              Portfolio
            </button>
            <button
              onClick={() => {
                scrollToSection('about');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              About
            </button>
            <button
              onClick={() => {
                scrollToSection('gallery');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              Gallery
            </button>
            <button
              onClick={() => {
                scrollToSection('contact');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              Contact
            </button>
            <div className="flex gap-6 mt-auto mb-4">
              <SocialIcon url={socialLinks.facebook_url} icon={Facebook} label="Facebook" />
              <SocialIcon url={socialLinks.twitter_url} icon={Twitter} label="Twitter" />
              <SocialIcon url={socialLinks.linkedin_url} icon={Linkedin} label="LinkedIn" />
              <SocialIcon url={socialLinks.instagram_url} icon={Instagram} label="Instagram" />
              <SocialIcon url={socialLinks.youtube_url} icon={Youtube} label="YouTube" />
            </div>
            <div className="text-center text-neutral-500 dark:text-neutral-400 text-sm">
              © {new Date().getFullYear()} Romer Garcia. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
