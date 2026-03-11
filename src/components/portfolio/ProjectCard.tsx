
import { MoveRight } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: number;
    hero_image_url: string;
    category: string;
    title: string;
    description: string;
    alt_text?: string | null;
  };
  onSelect: (project: any) => void;
}

export const ProjectCard = ({ project, onSelect }: ProjectCardProps) => {
  return (
    <article
      onClick={() => onSelect(project)}
      className="group relative cursor-pointer overflow-hidden bg-neutral-900"
      style={{ aspectRatio: '4/3' }}
      itemScope
      itemType="https://schema.org/CreativeWork"
    >
      <img 
        src={project.hero_image_url} 
        alt={`${project.category} project by Romer Garcia — ${project.title} showcasing ${project.category.toLowerCase()} design work`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        itemProp="image"
      />
      
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
        <p className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider" itemProp="genre">{project.category}</p>
        <h2 className="text-xl md:text-2xl font-roc font-extralight text-white mb-4 uppercase" itemProp="name">{project.title}</h2>
        <p className="text-sm text-neutral-300 mb-6" itemProp="description">{project.description.split('.')[0]}.</p>
        <span itemProp="creator" itemScope itemType="https://schema.org/Person" className="hidden">
          <meta itemProp="name" content="Romer Garcia" />
        </span>
        <div className="flex items-center text-neutral-400 group-hover:text-white transition-colors text-sm font-roc font-bold uppercase">
          Explore More <MoveRight className="ml-2 w-4 h-4" />
        </div>
      </div>
    </article>
  );
};
