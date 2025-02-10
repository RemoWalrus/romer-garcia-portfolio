
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const About = () => {
  const [portraitUrl, setPortraitUrl] = useState('');

  useEffect(() => {
    const { data } = supabase.storage
      .from('graphics')
      .getPublicUrl('RomerSelfPortrait.jpg');
    
    if (data) {
      setPortraitUrl(data.publicUrl);
    }
  }, []);

  return (
    <section id="about" className="relative bg-neutral-900 py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-white mb-12 text-center">
          ABOUT ME
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-neutral-600/50 flex-shrink-0 bg-neutral-800">
            {portraitUrl && (
              <img 
                src={portraitUrl} 
                alt="Romer Garcia" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <p className="text-sm md:text-base text-neutral-300 font-['Arial'] leading-relaxed text-center md:text-left">
            With over a decade of experience in digital design and development, I specialize in creating 
            meaningful digital experiences that bridge the gap between functionality and aesthetics. 
            My approach combines technical expertise with creative vision, ensuring each project 
            not only meets its objectives but also delivers an exceptional user experience.
          </p>
        </div>
      </div>
    </section>
  );
};
