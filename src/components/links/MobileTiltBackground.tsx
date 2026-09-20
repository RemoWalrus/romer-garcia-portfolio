import { useEffect, useRef, useState } from 'react';
import { Move3D } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileTiltBackgroundProps {
  imageUrl: string;
}

type PermissionState = 'automatic' | 'required' | 'denied';

interface PermissionedDeviceOrientationEventConstructor {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export const MobileTiltBackground = ({ imageUrl }: MobileTiltBackgroundProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const baselineBetaRef = useRef<number>();
  const [permission, setPermission] = useState<PermissionState>('automatic');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isMobile || reduceMotion || typeof DeviceOrientationEvent === 'undefined') return;

    const orientationEvent = DeviceOrientationEvent as unknown as PermissionedDeviceOrientationEventConstructor;
    if (typeof orientationEvent.requestPermission === 'function') {
      setPermission('required');
      return;
    }

    setListening(true);
  }, []);

  useEffect(() => {
    if (!listening) return;

    const render = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      if (imageRef.current) {
        imageRef.current.style.transform =
          `translate3d(${current.x}px, ${current.y}px, 0) scale(1.08)`;
      }
      frameRef.current = window.requestAnimationFrame(render);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      if (baselineBetaRef.current === undefined) baselineBetaRef.current = event.beta;

      const betaOffset = event.beta - baselineBetaRef.current;
      targetRef.current = {
        x: clamp(event.gamma / 35, -1, 1) * -12,
        y: clamp(betaOffset / 25, -1, 1) * -9,
      };
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (frameRef.current !== undefined) window.cancelAnimationFrame(frameRef.current);
    };
  }, [listening]);

  const enableMotion = async () => {
    const orientationEvent = DeviceOrientationEvent as unknown as PermissionedDeviceOrientationEventConstructor;
    try {
      const result = await orientationEvent.requestPermission?.();
      if (result === 'granted') {
        setPermission('automatic');
        setListening(true);
      } else {
        setPermission('denied');
      }
    } catch {
      setPermission('denied');
    }
  };

  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          ref={imageRef}
          className="absolute -inset-x-4 -top-4 aspect-[1920/1786] origin-center bg-no-repeat bg-top bg-[length:100%_auto] opacity-[0.3] brightness-[1.25] saturate-[1.25] will-change-transform [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)] motion-reduce:transform-none md:inset-x-0 md:top-0 md:h-full md:aspect-auto md:bg-cover md:bg-center md:will-change-auto dark:opacity-[0.75] dark:brightness-100"
          style={{ backgroundImage: `url(${imageUrl})`, transform: 'translate3d(0, 0, 0) scale(1.08)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/60 from-[0%] via-neutral-200/40 via-[45%] to-neutral-200 dark:from-transparent dark:via-background/35 dark:to-background" />
      </div>

      {permission === 'required' && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={enableMotion}
          className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-border md:hidden"
          aria-label="Enable tilt motion"
          title="Enable tilt motion"
        >
          <Move3D className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};