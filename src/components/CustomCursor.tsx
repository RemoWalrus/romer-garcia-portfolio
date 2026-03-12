
import { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [onDarkBg, setOnDarkBg] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const ghost = useRef({ x: 0, y: 0, scale: 1 });
  const prevHovering = useRef(false);
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
      const darkSection = target.closest('#hero, .bg-neutral-950, .bg-neutral-900, [data-dark-bg]');
      setOnDarkBg(!!darkSection);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', checkHover);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

      const size = isHovering ? 64 : 36;
      const half = size / 2;

      if (ringRef.current) {
        const innerRing = ringRef.current.firstElementChild as HTMLElement;
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
        if (innerRing) {
          innerRing.style.width = `${size}px`;
          innerRing.style.height = `${size}px`;
          innerRing.style.marginLeft = `${-half}px`;
          innerRing.style.marginTop = `${-half}px`;
        }
      }

      // Ghost/afterimage follows even more slowly
      ghost.current.x += (mouse.current.x - ghost.current.x) * 0.08;
      ghost.current.y += (mouse.current.y - ghost.current.y) * 0.08;
      ghost.current.scale += (targetScale - ghost.current.scale) * 0.06;

      if (ghostRef.current) {
        const showGhost = isHovering || prevHovering.current;
        ghostRef.current.style.transform = `translate(${ghost.current.x}px, ${ghost.current.y}px) scale(${ghost.current.scale})`;
        ghostRef.current.style.opacity = showGhost ? '0.3' : '0';
      }

      prevHovering.current = isHovering;
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

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const goldColor = 'hsl(43, 60%, 55%)';
  const ghostGoldColor = 'hsl(43, 60%, 55%, 0.3)';

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="rounded-full transition-all duration-300"
          style={{
            backgroundColor: goldColor,
            width: isHovering ? 8 : 6,
            height: isHovering ? 8 : 6,
            marginLeft: isHovering ? -4 : -3,
            marginTop: isHovering ? -4 : -3,
          }}
        />
      </div>
      {/* Ghost / afterimage ring */}
      <div
        ref={ghostRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0, transition: 'opacity 0.4s ease-out' }}
      >
        <div
          className="rounded-full"
          style={{
            width: 36,
            height: 36,
            marginLeft: -18,
            marginTop: -18,
            border: `1px solid ${ghostGoldColor}`,
          }}
        />
      </div>
      {/* Main ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="rounded-full transition-colors duration-300"
          style={{
            width: 36,
            height: 36,
            marginLeft: -18,
            marginTop: -18,
            border: `1px solid ${goldColor}`,
          }}
        />
      </div>
    </>
  );
};
