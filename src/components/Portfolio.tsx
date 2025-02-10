
import { MoveRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
      .select('*');
    
    if (data) {
      setProjects([
        ...data,
        {
          id: 'custom-1',
          category: 'Web Development',
          title: 'E-COMMERCE PLATFORM',
          description: 'A modern e-commerce platform built with React and Next.js. Features include real-time inventory management, dynamic product filtering, and a streamlined checkout process.',
          image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
        },
        {
          id: 'custom-2',
          category: 'Mobile Development',
          title: 'FITNESS TRACKING APP',
          description: 'A comprehensive fitness tracking application that helps users monitor their workouts, nutrition, and progress. Includes features like workout planning, progress tracking, and social sharing.',
          image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
        }
      ]);
    }
  };

  const handleImageClick = (index: number) => {
    setHeroImageIndex(index);
  };

  const projectImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
  ];

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="group bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all duration-300"
            >
              <div className="p-6">
                <p className="text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wider">{project.category}</p>
                <h3 className="text-xl md:text-2xl font-roc font-extralight text-white mb-4 uppercase">{project.title}</h3>
                <p className="text-sm md:text-base text-neutral-400 mb-6">{project.description.split('.')[0]}.</p>
                <button 
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center text-neutral-500 group-hover:text-white transition-colors text-sm md:text-base font-roc"
                >
                  Explore More <MoveRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => {
        setSelectedProject(null);
        setHeroImageIndex(0);
      }}>
        <DialogContent className="bg-neutral-900 text-white border-neutral-800 w-[95vw] max-w-7xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-roc font-extralight mb-4">
              {selectedProject?.title}
            </DialogTitle>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {projectImages.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`cursor-pointer transition-all duration-300 ${
                    index === heroImageIndex 
                      ? 'col-span-4 h-96' 
                      : 'col-span-2 md:col-span-1 h-32'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Project preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <DialogDescription className="text-neutral-300 font-arial">
              {selectedProject?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};
