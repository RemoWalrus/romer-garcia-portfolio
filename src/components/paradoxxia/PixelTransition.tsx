import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface PixelTransitionProps {
  active: boolean;
  color?: string;
}

/** Generates a grid of random-sized pixel blocks that stagger in/out */
const PixelTransition = ({ active, color = "#f6c915" }: PixelTransitionProps) => {
  const pixels = useMemo(() => {
    const items: { x: number; y: number; w: number; h: number; delay: number }[] = [];
    const count = 220;
    for (let i = 0; i < count; i++) {
      const w = 2 + Math.random() * 14;
      const h = 2 + Math.random() * 14;
      items.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        w,
        h,
        delay: Math.random() * 0.6,
      });
    }
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
            animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.4 } }}
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
                  duration: 0.18 + Math.random() * 0.12,
                  delay: p.delay,
                  ease: [0.4, 0, 0.2, 1],
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
