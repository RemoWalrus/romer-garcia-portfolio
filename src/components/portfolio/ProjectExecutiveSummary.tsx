import { motion } from 'framer-motion';

interface ProjectExecutiveSummaryProps {
  project: {
    title: string;
    category: string;
    description: string;
    tech_stack?: string[];
  };
}

export const ProjectExecutiveSummary = ({ project }: ProjectExecutiveSummaryProps) => {
  // Generate a concise executive summary from the first 2 sentences of the description
  const sentences = project.description.split(/(?<=[.!?])\s+/);
  const summary = sentences.slice(0, 2).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-6"
    >
      <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
        Executive Summary
      </h4>
      <blockquote className="border-l-2 border-neutral-300 dark:border-neutral-600 pl-4 text-sm text-neutral-700 dark:text-neutral-200 italic leading-relaxed">
        {summary}
      </blockquote>
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="mt-3">
          <h5 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            Methodology & Tools Used
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
