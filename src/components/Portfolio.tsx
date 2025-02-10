
import { MoveRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    
    if (data) {
      setProjects(data);
    }
  };

  return (
    <section id="portfolio" className="relative bg-neutral-950 py-32">
      <div className="container mx-auto px-4">
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
                <h3 className="text-xl md:text-2xl font-roc font-extralight text-white mb-4">{project.category}</h3>
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

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="bg-neutral-900 text-white border-neutral-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-roc font-extralight mb-4">
              {selectedProject?.title}
            </DialogTitle>
            <img
              src={selectedProject?.image_url}
              alt={selectedProject?.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <DialogDescription className="text-neutral-300 font-roc">
              {selectedProject?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};
