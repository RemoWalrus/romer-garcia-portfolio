
import { MoveRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { pixelGlitch } from './hero/animation-variants';

export const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (data) {
      setProjects(data);
    }
  };

  const handleImageClick = (index: number) => {
    setHeroImageIndex(index);
  };

  const handleExternalLink = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <section id="portfolio" className="relative bg-neutral-950 py-32">
      <div 
        className="absolute inset-0 bg-fixed opacity-10"
        style={{
          backgroundImage: `url(${supabase.storage.from('graphics').getPublicUrl('RomerGarcia-cover.png').data.publicUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-white mb-16 text-center">
          FEATURED WORK
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative aspect-square cursor-pointer overflow-hidden bg-neutral-900"
            >
              <img 
                src={project.hero_image_url} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <p className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">{project.category}</p>
                <h3 className="text-xl md:text-2xl font-roc font-extralight text-white mb-4">{project.title}</h3>
                <p className="text-sm text-neutral-300 mb-6">{project.description.split('.')[0]}.</p>
                <div className="flex items-center text-neutral-400 group-hover:text-white transition-colors text-sm font-roc">
                  Explore More <MoveRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => {
        setSelectedProject(null);
        setHeroImageIndex(0);
      }}>
        <DialogContent className="bg-neutral-900 text-white border-neutral-800 w-[95vw] max-w-7xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="mb-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                {selectedProject?.category}
              </span>
            </div>
            <DialogTitle className="text-2xl font-roc font-extralight mb-4">
              {selectedProject?.title}
            </DialogTitle>
            <DialogDescription className="text-neutral-300 font-arial mb-8">
              {selectedProject?.description}
            </DialogDescription>
            <div className="grid grid-cols-4 gap-4">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={heroImageIndex}
                  initial="initial"
                  animate="animate"
                  variants={pixelGlitch}
                  className="col-span-4 h-96 mb-4 relative group"
                >
                  <img
                    src={selectedProject?.image_url}
                    alt={selectedProject?.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {selectedProject?.ext_url && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExternalLink(selectedProject.ext_url);
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="text-white flex items-center">
                        View Project <MoveRight className="ml-2 w-4 h-4" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {selectedProject?.additional_images && selectedProject.additional_images.length > 0 && (
                <div className="col-span-4 grid grid-cols-3 gap-4">
                  {selectedProject.additional_images.map((image: string, index: number) => (
                    <div 
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className="cursor-pointer h-32"
                    >
                      <img
                        src={image}
                        alt={`${selectedProject.title} preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg transition-opacity hover:opacity-80"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};
