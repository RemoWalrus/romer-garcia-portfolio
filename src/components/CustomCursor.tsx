
import { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number>();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"], input, textarea, select, [onclick], .cursor-pointer, [data-clickable]');
      setIsHovering(!!clickable);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', checkHover);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) scale(${isHovering ? 1.8 : 1})`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', checkHover);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [isHovering, isVisible]);

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="rounded-full bg-foreground transition-all duration-300"
          style={{
            width: isHovering ? 8 : 6,
            height: isHovering ? 8 : 6,
            marginLeft: isHovering ? -4 : -3,
            marginTop: isHovering ? -4 : -3,
          }}
        />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="rounded-full border border-foreground/60 transition-all duration-300"
          style={{
            width: 36,
            height: 36,
            marginLeft: -18,
            marginTop: -18,
            borderWidth: isHovering ? 2 : 1,
          }}
        />
      </div>
    </>
  );
};
