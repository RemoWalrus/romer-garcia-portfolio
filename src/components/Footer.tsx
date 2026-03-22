
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { useSection } from '@/hooks/use-home-data';

export const Footer = () => {
  const socialSection = useSection('social');

  const socialLinks = {
    facebook_url: socialSection?.facebook_url || '',
    twitter_url: socialSection?.twitter_url || '',
    linkedin_url: socialSection?.linkedin_url || '',
    instagram_url: socialSection?.instagram_url || '',
    youtube_url: socialSection?.youtube_url || '',
  };

  const SocialIcon = ({ url, icon: Icon, label }: { url: string; icon: typeof Facebook; label: string }) => {
    if (!url) return null;
    
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 transition-colors"
        aria-label={label}
      >
        <Icon className="w-5 h-5" />
      </a>
    );
  };

  return (
    <footer className="bg-background py-8 mt-auto hidden md:block relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <SocialIcon url={socialLinks.facebook_url} icon={Facebook} label="Facebook" />
            <SocialIcon url={socialLinks.twitter_url} icon={Twitter} label="Twitter" />
            <SocialIcon url={socialLinks.linkedin_url} icon={Linkedin} label="LinkedIn" />
            <SocialIcon url={socialLinks.instagram_url} icon={Instagram} label="Instagram" />
            <SocialIcon url={socialLinks.youtube_url} icon={Youtube} label="YouTube" />
          </div>
          <div className="text-center text-neutral-500 text-sm space-y-2">
            <div className="flex gap-6 justify-center">
              <a 
                href="/meme" 
                className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-300 story-link text-sm"
              >
                Random Developer Meme
              </a>
              <a 
                href="/char-gen" 
                className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-300 story-link text-sm"
              >
                パラドクシア
              </a>
            </div>
            <div>
              © {new Date().getFullYear()} Romer Garcia. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
