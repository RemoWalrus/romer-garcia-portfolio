
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

interface SocialLinks {
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
}

export const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
    youtube_url: ''
  });

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
    <footer className="bg-neutral-950 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <SocialIcon url={socialLinks.facebook_url} icon={Facebook} label="Facebook" />
            <SocialIcon url={socialLinks.twitter_url} icon={Twitter} label="Twitter" />
            <SocialIcon url={socialLinks.linkedin_url} icon={Linkedin} label="LinkedIn" />
            <SocialIcon url={socialLinks.instagram_url} icon={Instagram} label="Instagram" />
            <SocialIcon url={socialLinks.youtube_url} icon={Youtube} label="YouTube" />
          </div>
          <div className="text-center text-neutral-500 text-sm">
            © {new Date().getFullYear()} Romer Garcia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
