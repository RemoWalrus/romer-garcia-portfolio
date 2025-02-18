
import { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('facebook_url, twitter_url, instagram_url, linkedin_url, youtube_url')
        .eq('section_name', 'footer')
        .maybeSingle();
      
      if (data && !error) {
        setSocialLinks({
          facebook: data.facebook_url || '',
          twitter: data.twitter_url || '',
          instagram: data.instagram_url || '',
          linkedin: data.linkedin_url || '',
          youtube: data.youtube_url || ''
        });
      } else if (error) {
        console.error('Error fetching social links:', error);
      }
    };

    fetchSocialLinks();
  }, []);

  const socialIcons = [
    { icon: Facebook, link: socialLinks.facebook },
    { icon: Twitter, link: socialLinks.twitter },
    { icon: Instagram, link: socialLinks.instagram },
    { icon: Linkedin, link: socialLinks.linkedin },
    { icon: Youtube, link: socialLinks.youtube }
  ].filter(social => social.link);

  return (
    <footer className="bg-neutral-950 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          {socialIcons.length > 0 && (
            <div className="flex gap-6">
              {socialIcons.map(({ icon: Icon, link }) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          )}
          <div className="text-center text-neutral-500 text-sm">
            © {new Date().getFullYear()} Romer Garcia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
