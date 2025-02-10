
import { Github, Linkedin, Mail } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="relative bg-neutral-950 py-32">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-white mb-8">
          GET IN TOUCH
        </h2>
        <p className="text-sm md:text-base text-neutral-300 max-w-2xl mx-auto mb-8 font-roc">
          Interested in collaborating? Let's discuss your next project.
        </p>
        <div className="flex justify-center gap-6">
          <a href="https://github.com/RemoWalrus" target="_blank" rel="noopener noreferrer"
             className="text-neutral-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/romergarcia/" target="_blank" rel="noopener noreferrer"
             className="text-neutral-400 hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:romergarcia@gmail.com"
             className="text-neutral-400 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
