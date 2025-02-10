
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { titles } from './hero/title-config';
import { HeroBackground } from './hero/HeroBackground';
import { HeroContent } from './hero/HeroContent';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

export const Hero = ({ scrollToSection }: HeroProps) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [showVideo, setShowVideo] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        console.log('Fetching hero images...');
        const { data: imageList, error } = await supabase
          .storage
          .from('images')
          .list('hero', {
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching hero images:', error);
          return;
        }

        console.log('Found images:', imageList);

        if (imageList && imageList.length > 0) {
          const imageUrls = imageList.map(file => {
            const url = supabase.storage.from('images').getPublicUrl(`hero/${file.name}`).data.publicUrl;
            console.log('Generated URL:', url);
            return url;
          });
          // Randomly shuffle the array of images
          const shuffledImages = [...imageUrls].sort(() => Math.random() - 0.5);
          setHeroImages(shuffledImages);
        } else {
          console.log('No images found, using fallback');
          const fallbackUrl = supabase.storage.from('images').getPublicUrl('dualshadow.jpg').data.publicUrl;
          setHeroImages([fallbackUrl]);
        }
      } catch (error) {
        console.error('Error in fetchHeroImages:', error);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (titleIndex === titles.length - 1) {
      const timer = setTimeout(() => {
        setShowVideo(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  useEffect(() => {
    if (titleIndex < titles.length - 1) {
      const timer = setTimeout(() => {
        setTitleIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [titleIndex]);

  useEffect(() => {
    if (!showVideo && heroImages.length > 1) {
      console.log('Starting carousel with images:', heroImages);
      const glitchTimer = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % heroImages.length;
            console.log('Updating image index from', prevIndex, 'to', nextIndex);
            return nextIndex;
          });
          setTimeout(() => {
            setIsGlitching(false);
          }, 150);
        }, 150);
      }, 5000);

      return () => clearInterval(glitchTimer);
    }
  }, [showVideo, heroImages.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroBackground
        showVideo={showVideo}
        heroImages={heroImages}
        currentImageIndex={currentImageIndex}
        isGlitching={isGlitching}
      />
      <HeroContent
        titles={titles}
        titleIndex={titleIndex}
        scrollToSection={scrollToSection}
      />
    </section>
  );
};
