
import { Github, Linkedin, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactData, setContactData] = useState({
    title: 'GET IN TOUCH',
    description: '',
    get_in_touch_text: 'Interested in collaborating? Let\'s discuss your next project.'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const fetchContactSection = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('title, description, get_in_touch_text')
        .eq('section_name', 'contact')
        .maybeSingle();
      
      if (data && !error) {
        setContactData(prev => ({
          ...prev,
          ...data
        }));
      } else if (error) {
        console.error('Error fetching contact section:', error);
      }
    };

    fetchContactSection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact me directly via email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="relative bg-white dark:bg-neutral-950 py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-neutral-900 dark:text-white mb-8 text-center">
          {contactData.title}
        </h2>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-12 font-sans text-center">
          {contactData.get_in_touch_text}
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-12 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-900 dark:text-white font-roc uppercase tracking-wider text-lg font-extralight rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
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

