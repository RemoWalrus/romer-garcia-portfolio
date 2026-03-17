import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  active: boolean;
  speed?: number;
}

const TypewriterText = ({ text, active, speed = 30 }: TypewriterTextProps) => {
  const [displayedCount, setDisplayedCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!active) {
      setDisplayedCount(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Small delay before starting to type
    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setDisplayedCount((prev) => {
          if (prev >= text.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, 800);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, text, speed]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          className="w-full max-w-[900px] px-6"
        >
          {/* Invisible full text to reserve space */}
          <p
            className="text-xs md:text-sm leading-relaxed font-mono"
            style={{ visibility: "hidden", position: "absolute" }}
            aria-hidden
          >
            {text}
          </p>
          {/* Visible typed text */}
          <p
            className="text-black/80 text-xs md:text-sm leading-relaxed font-mono"
          >
            {text.slice(0, displayedCount)}
            {displayedCount < text.length && (
              <span className="inline-block w-[2px] h-[1em] bg-black/70 ml-[1px] animate-pulse align-text-bottom" />
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypewriterText;
