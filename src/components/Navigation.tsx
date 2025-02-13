
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface NavigationProps {
  scrolled: boolean;
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
}

export const Navigation = ({ scrolled, scrollToSection, scrollToTop }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const logoUrl = supabase.storage.from('graphics').getPublicUrl(
    scrolled && !prefersDarkMode ? 'romergarcialogoinv.svg' : 'romergarcialogo.svg'
  ).data.publicUrl;

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
          className="cursor-pointer"
          aria-label="Scroll to top"
        >
          <img 
            src={logoUrl} 
            alt="Romer Garcia Logo" 
            className={`transition-all duration-300 ${
              scrolled ? 'w-36 md:w-48 h-auto' : 'w-44 md:w-60 h-auto'
            }`}
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
            onClick={() => scrollToSection('about')}
            className={`text-sm md:text-lg ${scrolled ? 'text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300' : 'text-white hover:text-white/80'} transition-colors uppercase tracking-wider font-roc`}
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('portfolio')}
            className={`text-sm md:text-lg ${scrolled ? 'text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300' : 'text-white hover:text-white/80'} transition-colors uppercase tracking-wider font-roc`}
          >
            Portfolio
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
                scrollToSection('about');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              About
            </button>
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
            <div className="absolute bottom-8 left-0 right-0 text-center text-neutral-500 dark:text-neutral-400 text-sm">
              © {new Date().getFullYear()} Romer Garcia. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
