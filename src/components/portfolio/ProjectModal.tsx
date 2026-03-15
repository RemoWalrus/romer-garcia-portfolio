
import { MoveRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';
import { ProjectGallery } from './ProjectGallery';
import { ProjectVideo } from './ProjectVideo';
import { ProjectCaseStudySchema } from '@/components/seo/JsonLdSchemas';

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
      <DialogContent className="w-full max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] md:max-w-7xl max-h-[85vh] md:h-[90vh] overflow-hidden p-0 [&>button]:border-0 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button:hover]:bg-transparent [&>button]:focus:bg-transparent">
        <ProjectCaseStudySchema project={project} />
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden" itemScope itemType="https://schema.org/CreativeWork">
          <div className="md:w-2/5 p-3 md:p-8 lg:p-12 overflow-y-auto w-full">
            <DialogHeader className="text-left">
              <div className="-mb-1 md:mb-0.5">
                <span className="text-[10px] md:text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider leading-none">
                  {project.category}
                </span>
              </div>
              <DialogTitle className="text-lg md:text-xl lg:text-2xl font-roc font-extralight mb-2 md:mb-2 uppercase leading-tight mt-0" itemProp="name">
                {project.title}
              </DialogTitle>
            </DialogHeader>

            

            <DialogDescription className="text-neutral-800 dark:text-neutral-100 font-arial mb-2 md:mb-6 text-xs md:text-sm lg:text-base whitespace-pre-line leading-snug md:leading-relaxed text-left" itemProp="description">
              {project.description}
            </DialogDescription>

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="mb-3 md:mb-24">
                <h4 className="text-[10px] md:text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 md:mb-3">
                  Tech Stack & Tools
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {project.tech_stack.map((tech: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mini thumbnail navigator - mobile only */}
            {!isMobile ? null : (project.additional_images?.length > 0 && !project.youtube_url) && (
              <div className="flex gap-1.5 mb-1 overflow-x-auto pb-0.5">
                {[project.image_url, ...project.additional_images].map((img: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => onImageClick(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden cursor-pointer border-2 transition-all ${
                      index === heroImageIndex 
                        ? 'border-neutral-900 dark:border-white opacity-100' 
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt={`${project.title} thumbnail ${index + 1}`} className="w-full h-full object-cover" draggable={false} />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-1 md:gap-3">
              {project.project_url && (
                <div 
                  onClick={() => onExternalLink(project.project_url)}
                  className="inline-flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-xs md:text-sm font-roc font-bold uppercase px-2 md:px-3 py-1 md:py-2 rounded"
                >
                  View Live Project <MoveRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                </div>
              )}
              
              {project.github_url && (
                <div 
                  onClick={() => onExternalLink(project.github_url)}
                  className="inline-flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-xs md:text-sm font-roc font-bold uppercase px-2 md:px-3 py-1 md:py-2 rounded"
                >
                  View Source Code <MoveRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                </div>
              )}

              {project.ext_url && !project.project_url && (
                <div 
                  onClick={() => onExternalLink(project.ext_url)}
                  className="inline-flex items-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer text-xs md:text-sm font-roc font-bold uppercase px-2 md:px-3 py-1 md:py-2 rounded"
                >
                  View Project <MoveRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                </div>
              )}
            </div>
          </div>

          <div className="md:w-3/5 bg-white dark:bg-neutral-950 flex-1 md:h-full flex flex-col w-full overflow-hidden">
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
                  alt={project.alt_text || `${project.category} design work by Romer Garcia — ${project.title} project showcase with ${project.tech_stack?.join(', ') || 'creative tools'}`}
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
