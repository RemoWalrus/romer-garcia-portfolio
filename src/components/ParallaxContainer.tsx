
import React, { useEffect, useState } from 'react';
import { Motion } from '@capacitor/motion';
import { Device } from '@capacitor/device';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  className
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkDevice = async () => {
      const info = await Device.getInfo();
      setIsMobileDevice(info.platform !== 'web');
    };
    checkDevice();
  }, []);

  useEffect(() => {
    if (isMobileDevice) {
      const watchMotion = async () => {
        await Motion.addListener('accel', event => {
          const { x, y, z } = event.acceleration;
          setRotation({
            x: y * 1.5, // Adjust multiplier for sensitivity
            y: x * 1.5,
            z: z || 0
          });
        });
      };
      watchMotion();
      return () => {
        Motion.removeAllListeners();
      };
    }
  }, [isMobileDevice]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobileDevice) {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 2,
        y: (clientY / innerHeight - 0.5) * 2
      });
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen perspective-1000 overflow-hidden bg-gradient-to-b from-neutral-50 to-neutral-100',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <div
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: isMobileDevice
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            : `rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`
        }}
      >
        {children}
      </div>
    </div>
  );
};
