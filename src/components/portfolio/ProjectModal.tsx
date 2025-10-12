
import { MoveRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';
import { ProjectGallery } from './ProjectGallery';
import { ProjectVideo } from './ProjectVideo';

interface ProjectModalProps {
  project: any;
  heroImageIndex: number;
  onClose: () => void;
  onImageClick: (index: number) => void;
  onExternalLink: (url: string) => void;
}

export const ProjectModal = ({ 
  project, 
  heroImageIndex, 
  onClose, 
  onImageClick, 
  onExternalLink 
}: ProjectModalProps) => {
  const isMobile = useIsMobile();

  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white w-[95vw] max-w-7xl h-[90vh] md:h-[90vh] overflow-y-auto md:overflow-hidden p-0 [&>button]:border-0 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button:hover]:bg-transparent [&>button]:focus:bg-transparent">
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-2/5 p-6 md:p-12 overflow-y-auto">
            <DialogHeader className="text-left">
              <div className="mb-2">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  {project.category}
                </span>
              </div>
              <DialogTitle className="text-2xl font-roc font-extralight mb-4 uppercase">
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-neutral-800 dark:text-neutral-100 font-arial mb-8 text-base whitespace-pre-line leading-relaxed text-left">
                {project.description}
              </DialogDescription>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mb-24">
                  <h4 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </DialogHeader>
            
            <div className="flex flex-col gap-3">
              {project.project_url && (
                <div 
                  onClick={() => onExternalLink(project.project_url)}
                  className="inline-flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-sm font-roc font-bold uppercase px-3 py-2 rounded"
                >
                  View Live Project <MoveRight className="ml-2 w-4 h-4" />
                </div>
              )}
              
              {project.github_url && (
                <div 
                  onClick={() => onExternalLink(project.github_url)}
                  className="inline-flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-sm font-roc font-bold uppercase px-3 py-2 rounded"
                >
                  View Source Code <MoveRight className="ml-2 w-4 h-4" />
                </div>
              )}

              {project.ext_url && !project.project_url && (
                <div 
                  onClick={() => onExternalLink(project.ext_url)}
                  className="inline-flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-sm font-roc font-bold uppercase px-3 py-2 rounded"
                >
                  View Project <MoveRight className="ml-2 w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          <div className="md:w-3/5 bg-white dark:bg-neutral-950 flex-1 md:h-full flex flex-col">
            {project.youtube_url ? (
              <ProjectVideo url={project.youtube_url} title={project.title} />
            ) : project.additional_images?.length > 0 ? (
              <ProjectGallery 
                images={[project.image_url, ...project.additional_images]}
                title={project.title}
                heroImageIndex={heroImageIndex}
                onImageClick={onImageClick}
                isMobile={isMobile}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="max-w-full max-h-full object-contain bg-white dark:bg-neutral-950"
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
