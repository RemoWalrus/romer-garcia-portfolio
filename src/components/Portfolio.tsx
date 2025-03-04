import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from './portfolio/ProjectCard';
import { ProjectModal } from './portfolio/ProjectModal';
import { trackEvent } from './GoogleAnalytics';
import { maskSupabaseUrl } from '@/utils/downloadHelper';

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
      const processedProjects = data.map(project => ({
        ...project,
        image_url: maskSupabaseUrl(project.image_url),
        hero_image_url: maskSupabaseUrl(project.hero_image_url),
        additional_images: project.additional_images 
          ? project.additional_images.map((img: string) => maskSupabaseUrl(img))
          : []
      }));
      
      setProjects(processedProjects);
    }
  };

  const handleImageClick = (index: number) => {
    setHeroImageIndex(index);
  };

  const handleExternalLink = (url: string) => {
    if (url) {
      trackEvent('Portfolio', 'External Link Click', url);
      window.open(url, '_blank');
    }
  };

  const handleProjectSelect = (project: any) => {
    trackEvent('Portfolio', 'Project View', project.title);
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setHeroImageIndex(0);
  };

  return (
    <section id="portfolio" className="relative py-32 bg-fixed bg-center bg-cover bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-white/90 dark:before:bg-neutral-950/90 before:backdrop-blur-sm" style={{
      backgroundImage: "url('https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/images//romergarciacover.jpg')"
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-neutral-900 dark:text-white mb-16 text-center uppercase">
          Featured Work
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={handleProjectSelect}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        heroImageIndex={heroImageIndex}
        onClose={handleCloseModal}
        onImageClick={handleImageClick}
        onExternalLink={handleExternalLink}
      />
    </section>
  );
};
