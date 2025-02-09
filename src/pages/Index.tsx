
import { ParallaxContainer } from '@/components/ParallaxContainer';
import { ParallaxLayer } from '@/components/ParallaxLayer';
import { Card } from '@/components/ui/card';
import { MoveRight, Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Get public URLs for the images
  const backgroundImageUrl = supabase.storage.from('graphics').getPublicUrl('dualshadow.jpg').data.publicUrl;
  const depthMapUrl = supabase.storage.from('graphics').getPublicUrl('dualshadow_depth.jpg').data.publicUrl;
  const logoUrl = supabase.storage.from('graphics').getPublicUrl('romergarcialogo.svg').data.publicUrl;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    workSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-neutral-950 min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img 
            src={logoUrl} 
            alt="Romer Garcia Logo" 
            className={`transition-all duration-300 ${
              scrolled ? 'w-24 h-auto' : 'w-40 h-auto'
            }`}
          />
          <div className="flex gap-6">
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
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 to-neutral-950/20 z-10" />
          <img 
            src={backgroundImageUrl} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="container relative z-20 px-4 py-32 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-neutral-200 bg-neutral-800/50 rounded-full">
              Creative Director & Developer
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Romer Garcia
            </h1>
            
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-12">
              I create immersive digital experiences that blend storytelling with cutting-edge technology
            </p>

            <Button 
              onClick={scrollToWork}
              variant="outline" 
              className="group bg-white/20 border-white/20 hover:bg-white/30 text-white"
            >
              View My Work
              <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="relative bg-neutral-950 py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
            Featured Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="group bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Digital Experience Design</h3>
                <p className="text-neutral-400 mb-6">Creating immersive digital experiences that engage and inspire.</p>
                <div className="flex items-center text-neutral-500 group-hover:text-white transition-colors">
                  Explore More <MoveRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Card>

            <Card className="group bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Creative Direction</h3>
                <p className="text-neutral-400 mb-6">Leading creative teams to deliver innovative solutions.</p>
                <div className="flex items-center text-neutral-500 group-hover:text-white transition-colors">
                  Explore More <MoveRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
