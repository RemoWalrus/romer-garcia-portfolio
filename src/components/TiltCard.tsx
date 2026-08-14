import React, { useEffect, useRef } from "react";
import { Motion } from "@capacitor/motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** max tilt in degrees */
  maxTilt?: number;
  /** parallax depth for the inner content in px */
  depth?: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * 2.5D parallax tilt card.
 * Uses device orientation (iOS / Android) when available, mouse position on desktop.
 * Transforms are written straight to the DOM via requestAnimationFrame so React
 * never re-renders on high frequency motion events.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  maxTilt = 10,
  depth = 18,
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number>();
  const base = useRef<{ beta: number; gamma: number } | null>(null);

  useEffect(() => {
    const loop = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.12;
      c.y += (t.y - c.y) * 0.12;

      if (outerRef.current) {
        outerRef.current.style.transform = `perspective(900px) rotateX(${c.x.toFixed(
          2,
        )}deg) rotateY(${c.y.toFixed(2)}deg)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${((-c.y / maxTilt) * depth).toFixed(
          2,
        )}px, ${((c.x / maxTilt) * depth).toFixed(2)}px, 0)`;
      }
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [maxTilt, depth]);

  // device orientation (iOS + Android)
  useEffect(() => {
    let cancelled = false;
    let handle: { remove: () => void } | undefined;

    const start = async () => {
      try {
        const anyEvent = (window as any).DeviceOrientationEvent;
        if (anyEvent && typeof anyEvent.requestPermission === "function") {
          const res = await anyEvent.requestPermission();
          if (res !== "granted") return;
        }
        const listener = await Motion.addListener("orientation", (event) => {
          const beta = event.beta ?? 0; // front-back tilt
          const gamma = event.gamma ?? 0; // left-right tilt
          if (!base.current) base.current = { beta, gamma };
          target.current = {
            x: clamp((beta - base.current.beta) * 0.6, -maxTilt, maxTilt),
            y: clamp((gamma - base.current.gamma) * 0.6, -maxTilt, maxTilt),
          };
        });
        if (cancelled) listener.remove();
        else handle = listener;
      } catch {
        // orientation unsupported — mouse fallback still works
      }
    };

    void start();
    return () => {
      cancelled = true;
      handle?.remove();
    };
  }, [maxTilt]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    target.current = { x: -py * 2 * maxTilt, y: px * 2 * maxTilt };
  };

  const handleMouseLeave = () => {
    target.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={outerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("will-change-transform [transform-style:preserve-3d]", className)}
    >
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
};
