import { useEffect, useRef, useCallback } from 'react';

const DEFAULT_COLOR = 'hsl(43, 60%, 55%)';
const DEFAULT_GHOST_COLOR = 'hsl(43, 60%, 55%, 0.3)';
const RING_LERP = 0.15;
const GHOST_LERP = 0.08;
const SIZE_DEFAULT = 36;
const SIZE_HOVER = 64;
const DOT_DEFAULT = 6;
const DOT_HOVER = 8;

interface CustomCursorProps {
  color?: string;
  ghostColor?: string;
}

const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export const CustomCursor = ({ color, ghostColor }: CustomCursorProps = {}) => {
  const cursorColor = color || DEFAULT_COLOR;
  const cursorGhostColor = ghostColor || DEFAULT_GHOST_COLOR;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const ghostPos = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const prevHovering = useRef(false);
  const visible = useRef(false);
  const raf = useRef<number>(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
    if (!visible.current) {
      visible.current = true;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    }
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
  }, []);

  const onMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickable = !!target.closest('a, button, [role="button"], input, textarea, select, [onclick], .cursor-pointer, [data-clickable]');
    if (isClickable !== hovering.current) {
      hovering.current = isClickable;
      // Update dot size via CSS transition
      const dot = dotRef.current?.firstElementChild as HTMLElement | null;
      if (dot) {
        const s = isClickable ? DOT_HOVER : DOT_DEFAULT;
        dot.style.width = `${s}px`;
        dot.style.height = `${s}px`;
        dot.style.marginLeft = `${-s / 2}px`;
        dot.style.marginTop = `${-s / 2}px`;
      }
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    visible.current = false;
    if (dotRef.current) dotRef.current.style.opacity = '0';
    if (ringRef.current) ringRef.current.style.opacity = '0';
    if (ghostRef.current) ghostRef.current.style.opacity = '0';
  }, []);

  const onMouseEnter = useCallback(() => {
    visible.current = true;
    if (dotRef.current) dotRef.current.style.opacity = '1';
    if (ringRef.current) ringRef.current.style.opacity = '1';
  }, []);

  useEffect(() => {
    if (isTouchDevice()) return;

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const animate = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Ring interpolation
      ringPos.current.x += (mx - ringPos.current.x) * RING_LERP;
      ringPos.current.y += (my - ringPos.current.y) * RING_LERP;

      const isHover = hovering.current;
      const size = isHover ? SIZE_HOVER : SIZE_DEFAULT;
      const half = size / 2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
        const inner = ringRef.current.firstElementChild as HTMLElement;
        if (inner) {
          inner.style.width = `${size}px`;
          inner.style.height = `${size}px`;
          inner.style.marginLeft = `${-half}px`;
          inner.style.marginTop = `${-half}px`;
        }
      }

      // Ghost interpolation
      ghostPos.current.x += (mx - ghostPos.current.x) * GHOST_LERP;
      ghostPos.current.y += (my - ghostPos.current.y) * GHOST_LERP;

      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate3d(${ghostPos.current.x}px, ${ghostPos.current.y}px, 0)`;
        ghostRef.current.style.opacity = (isHover || prevHovering.current) ? '0.3' : '0';
        const inner = ghostRef.current.firstElementChild as HTMLElement;
        if (inner) {
          inner.style.width = `${size}px`;
          inner.style.height = `${size}px`;
          inner.style.marginLeft = `${-half}px`;
          inner.style.marginTop = `${-half}px`;
        }
      }

      prevHovering.current = isHover;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(raf.current);
    };
  }, [onMouseMove, onMouseOver, onMouseLeave, onMouseEnter]);

  if (isTouchDevice()) return null;

  const sizeTransition = 'width 0.45s cubic-bezier(0.25,1,0.5,1), height 0.45s cubic-bezier(0.25,1,0.5,1), margin 0.45s cubic-bezier(0.25,1,0.5,1)';

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ opacity: 0, transition: 'opacity 0.3s', willChange: 'transform' }}
      >
        <div
          className="rounded-full"
          style={{
            backgroundColor: GOLD,
            width: DOT_DEFAULT,
            height: DOT_DEFAULT,
            marginLeft: -DOT_DEFAULT / 2,
            marginTop: -DOT_DEFAULT / 2,
            transition: 'width 0.3s, height 0.3s, margin 0.3s',
          }}
        />
      </div>
      {/* Ghost ring */}
      <div
        ref={ghostRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ opacity: 0, transition: 'opacity 0.4s ease-out', willChange: 'transform' }}
      >
        <div
          className="rounded-full"
          style={{
            width: SIZE_DEFAULT,
            height: SIZE_DEFAULT,
            marginLeft: -SIZE_DEFAULT / 2,
            marginTop: -SIZE_DEFAULT / 2,
            border: `1px solid ${GOLD_GHOST}`,
            transition: sizeTransition,
          }}
        />
      </div>
      {/* Main ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ opacity: 0, transition: 'opacity 0.3s', willChange: 'transform' }}
      >
        <div
          className="rounded-full"
          style={{
            width: SIZE_DEFAULT,
            height: SIZE_DEFAULT,
            marginLeft: -SIZE_DEFAULT / 2,
            marginTop: -SIZE_DEFAULT / 2,
            border: `1px solid ${GOLD}`,
            transition: sizeTransition,
          }}
        />
      </div>
    </>
  );
};
