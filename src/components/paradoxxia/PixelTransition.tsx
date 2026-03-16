import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface PixelTransitionProps {
  active: boolean;
  color?: string;
}

/** Generates a grid of random-sized pixel blocks that stagger in/out */
const PixelTransition = ({ active, color = "#facc15" }: PixelTransitionProps) => {
  // Generate random pixel blocks once
  const pixels = useMemo(() => {
    const items: { x: number; y: number; w: number; h: number; delay: number }[] = [];
    // Fill screen with overlapping random rectangles
    const count = 120;
    for (let i = 0; i < count; i++) {
      const w = 4 + Math.random() * 16; // 4-20vw
      const h = 4 + Math.random() * 16;
      items.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        w,
        h,
        delay: Math.random() * 0.35,
      });
    }
    // Sort by delay so center-ish ones can appear first if desired
    return items;
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Solid yellow underneath to fill gaps */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.25 } }}
          />
          {/* Random pixel blocks */}
          {pixels.map((p, i) => (
            <motion.div
              key={i}
              className="fixed pointer-events-none z-[2]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.w}vw`,
                height: `${p.h}vh`,
                backgroundColor: color,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.12 + Math.random() * 0.08,
                  delay: p.delay,
                  ease: "easeOut",
                },
              }}
              exit={{
                opacity: 0,
                scale: 0,
                transition: {
                  duration: 0.1 + Math.random() * 0.08,
                  delay: p.delay * 0.7,
                  ease: "easeIn",
                },
              }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
};

export default PixelTransition;
