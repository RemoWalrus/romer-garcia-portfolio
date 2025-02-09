
import { ParallaxContainer } from '@/components/ParallaxContainer';
import { ParallaxLayer } from '@/components/ParallaxLayer';
import { Card } from '@/components/ui/card';
import { MoveRight, Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  return (
    <ParallaxContainer className="bg-neutral-900 text-white">
      {/* Background Image Layer */}
      <ParallaxLayer depth={3} className="pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url(${supabase.storage.from('graphics').getPublicUrl('dualshadow.jpg').data.publicUrl})`,
            transform: 'scale(1.1)'
          }}
        />
      </ParallaxLayer>

      {/* Depth Map Layer */}
      <ParallaxLayer depth={2.5} className="pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-multiply opacity-60"
          style={{
            backgroundImage: `url(${supabase.storage.from('graphics').getPublicUrl('dualshadow_depth.jpg').data.publicUrl})`,
            transform: 'scale(1.1)'
          }}
        />
      </ParallaxLayer>

      {/* Logo Layer */}
      <ParallaxLayer depth={1.5} className="pointer-events-none">
        <div className="absolute top-8 left-8">
          <img
            src={supabase.storage.from('graphics').getPublicUrl('romergarcialogo.svg').data.publicUrl}
            alt="Romer Garcia Logo"
            className="w-32 h-auto"
          />
        </div>
      </ParallaxLayer>

      {/* Hero Section */}
      <ParallaxLayer depth={0} className="flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-neutral-200 bg-neutral-800/50 rounded-full mb-6 animate-fade-in">
            Creative Director & Developer
          </span>
          <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-8 animate-fade-in [animation-delay:200ms]">
            Romer Garcia
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-12 animate-fade-in [animation-delay:400ms]">
            I create immersive digital experiences that blend storytelling with cutting-edge technology
          </p>
          <div className="flex justify-center gap-6 animate-fade-in [animation-delay:600ms]">
            <a href="https://github.com/RemoWalrus" target="_blank" rel="noopener noreferrer"
               className="text-neutral-400 hover:text-white transition-colors">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/romergarcia/" target="_blank" rel="noopener noreferrer"
               className="text-neutral-400 hover:text-white transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:romergarcia@gmail.com"
               className="text-neutral-400 hover:text-white transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </ParallaxLayer>

      {/* Gradient Overlay */}
      <ParallaxLayer depth={1} className="pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/0 via-neutral-900/50 to-neutral-900" />
      </ParallaxLayer>

      {/* Floating Elements */}
      <ParallaxLayer depth={2}>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2000ms]" />
      </ParallaxLayer>

      {/* Featured Work */}
      <ParallaxLayer depth={0.5} className="mt-[100vh]">
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-neutral-800/50 border-neutral-700 p-6 hover:bg-neutral-800/70 transition-colors">
              <h3 className="text-xl font-semibold mb-4">Digital Experience Design</h3>
              <p className="text-neutral-300 mb-4">Creating immersive digital experiences that engage and inspire.</p>
              <MoveRight className="text-neutral-400" />
            </Card>
            <Card className="bg-neutral-800/50 border-neutral-700 p-6 hover:bg-neutral-800/70 transition-colors">
              <h3 className="text-xl font-semibold mb-4">Creative Direction</h3>
              <p className="text-neutral-300 mb-4">Leading creative teams to deliver innovative solutions.</p>
              <MoveRight className="text-neutral-400" />
            </Card>
          </div>
        </div>
      </ParallaxLayer>
    </ParallaxContainer>
  );
};

export default Index;
