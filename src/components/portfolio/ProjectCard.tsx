
import { MoveRight } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: number;
    hero_image_url: string;
    category: string;
    title: string;
    description: string;
  };
  onSelect: (project: any) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  return (
    <div 
      onClick={() => onSelect(project)}
      className="group relative cursor-pointer overflow-hidden bg-neutral-900"
      style={{ aspectRatio: '4/3' }}
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
        <div className="flex items-center text-neutral-400 group-hover:text-white transition-colors text-sm font-roc font-bold uppercase">
          Explore More <MoveRight className="ml-2 w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
