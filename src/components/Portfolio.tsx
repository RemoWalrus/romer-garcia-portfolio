
import { MoveRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';

export const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const isMobile = useIsMobile();

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
    <section id="portfolio" className="relative bg-white dark:bg-neutral-950 py-32">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-neutral-900 dark:text-white mb-16 text-center uppercase">
          Featured Work
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative cursor-pointer overflow-hidden bg-neutral-900"
              style={{ aspectRatio: '4/3' }} // Changed from aspect-square to a 4:3 ratio
            >
              <img 
                src={project.hero_image_url} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <p className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">{project.category}</p>
                <h3 className="text-xl md:text-2xl font-roc font-extralight text-white mb-4 uppercase">{project.title}</h3>
                <p className="text-sm text-neutral-300 mb-6">{project.description.split('.')[0]}.</p>
                <div className="flex items-center text-neutral-400 group-hover:text-white transition-colors text-sm font-roc uppercase">
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
        <DialogContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white w-[95vw] max-w-7xl h-[90vh] overflow-y-auto md:overflow-hidden p-0">
          <button 
            onClick={() => {
              setSelectedProject(null);
              setHeroImageIndex(0);
            }}
            className="absolute right-4 top-4 z-50 p-2 rounded-full bg-black/80 hover:bg-black/90 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          <div className="h-full flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 md:p-12 overflow-y-auto">
              <DialogHeader>
                <div className="mb-2">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {selectedProject?.category}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-roc font-extralight mb-4 uppercase">
                  {selectedProject?.title}
                </DialogTitle>
                <DialogDescription className="text-neutral-800 dark:text-neutral-100 font-arial mb-8 text-base whitespace-pre-line leading-relaxed">
                  {selectedProject?.description}
                </DialogDescription>
              </DialogHeader>
              
              {selectedProject?.ext_url && (
                <div 
                  onClick={() => handleExternalLink(selectedProject.ext_url)}
                  className="inline-flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-sm font-roc uppercase mt-4"
                >
                  View Project <MoveRight className="ml-2 w-4 h-4" />
                </div>
              )}
            </div>

            <div className="md:w-1/2 bg-neutral-900 dark:bg-neutral-950 min-h-[50vh] md:min-h-0 md:h-full flex flex-col">
              {selectedProject?.additional_images?.length > 0 ? (
                <>
                  <motion.div 
                    key={heroImageIndex}
                    className={`w-full ${isMobile ? 'h-[50vh]' : 'h-[75vh]'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={selectedProject.additional_images[heroImageIndex]}
                      alt={`${selectedProject?.title} - Featured`}
                      className="w-full h-full object-contain bg-neutral-900 dark:bg-neutral-950"
                    />
                  </motion.div>
                  <div className="flex overflow-x-auto h-[15vh] md:h-[25%] bg-neutral-900 dark:bg-neutral-950">
                    {selectedProject.additional_images.map((image: string, index: number) => (
                      <div 
                        key={index}
                        onClick={() => handleImageClick(index)}
                        className={`cursor-pointer h-full flex-shrink-0 w-1/4 ${
                          index === heroImageIndex ? 'opacity-50' : 'opacity-100 hover:opacity-80'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${selectedProject.title} preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full">
                  <img
                    src={selectedProject?.image_url}
                    alt={selectedProject?.title}
                    className="w-full h-full object-contain bg-neutral-900 dark:bg-neutral-950"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

