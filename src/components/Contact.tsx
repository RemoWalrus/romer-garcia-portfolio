
import { Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just show a success message
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="relative bg-neutral-950 py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-white mb-8 text-center">
          GET IN TOUCH
        </h2>
        <p className="text-sm md:text-base text-neutral-300 max-w-2xl mx-auto mb-12 font-sans text-center">
          Interested in collaborating? Let's discuss your next project.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-neutral-200 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="flex justify-center gap-6">
          <a href="https://github.com/RemoWalrus" target="_blank" rel="noopener noreferrer"
             className="text-neutral-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/romergarcia/" target="_blank" rel="noopener noreferrer"
             className="text-neutral-400 hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:hireme@romergarcia.com"
             className="text-neutral-400 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
