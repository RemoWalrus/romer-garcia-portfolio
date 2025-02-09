
import React from 'react';
import { cn } from '@/lib/utils';

interface ParallaxLayerProps {
  depth: number;
  children: React.ReactNode;
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  depth,
  children,
  className
}) => {
  return (
    <div
      className={cn(
        'absolute inset-0 transition-transform duration-200 ease-out',
        className
      )}
      style={{
        transform: `translateZ(${depth * 50}px)`,
        zIndex: Math.floor(depth * 100)
      }}
    >
      {children}
    </div>
  );
};
