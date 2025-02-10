
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
  const logoUrl = supabase.storage.from('graphics').getPublicUrl('romergarcialogo.svg').data.publicUrl;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      {/* Background overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#1A1F2C]/90 backdrop-blur-sm border-b border-purple-900/50'
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
              scrolled ? 'w-28 md:w-32 h-auto' : 'w-40 md:w-48 h-auto'
            }`}
          />
        </button>

        <button
          className="md:hidden text-white hover:text-neutral-300 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('portfolio')}
            className="text-sm text-white hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
          >
            Portfolio
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm text-white hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-sm text-white hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
          >
            Contact
          </button>
        </div>

        {/* Mobile menu overlay */}
        <div 
          className={`md:hidden fixed inset-0 bg-[#1A1F2C]/95 backdrop-blur-md z-40 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="container mx-auto px-4 py-20 flex flex-col items-center gap-8">
            <button
              onClick={() => {
                scrollToSection('portfolio');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-white hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              Portfolio
            </button>
            <button
              onClick={() => {
                scrollToSection('about');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-white hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              About
            </button>
            <button
              onClick={() => {
                scrollToSection('contact');
                setMobileMenuOpen(false);
              }}
              className="text-xl text-white hover:text-neutral-300 transition-colors uppercase tracking-wider font-roc"
            >
              Contact
            </button>
            <div className="absolute bottom-8 left-0 right-0 text-center text-neutral-400 text-sm">
              © {new Date().getFullYear()} Romer Garcia. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

