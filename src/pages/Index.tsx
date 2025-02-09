
import { ParallaxContainer } from '@/components/ParallaxContainer';
import { ParallaxLayer } from '@/components/ParallaxLayer';

const Index = () => {
  return (
    <ParallaxContainer className="bg-neutral-100">
      <ParallaxLayer depth={0} className="flex items-center justify-center">
        <div className="text-center px-4">
          <span className="inline-block px-3 py-1 text-sm font-medium text-neutral-600 bg-neutral-200 rounded-full mb-4 animate-fade-in">
            Welcome to my portfolio
          </span>
          <h1 className="text-6xl font-bold text-neutral-800 mb-6 animate-fade-in [animation-delay:200ms]">
            Romer Garcia
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto animate-fade-in [animation-delay:400ms]">
            Creative Developer & Designer
          </p>
        </div>
      </ParallaxLayer>

      <ParallaxLayer depth={1} className="pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/20" />
      </ParallaxLayer>

      <ParallaxLayer depth={2}>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-neutral-200/50 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-neutral-300/50 rounded-full blur-xl animate-pulse [animation-delay:1000ms]" />
      </ParallaxLayer>
    </ParallaxContainer>
  );
};

export default Index;
