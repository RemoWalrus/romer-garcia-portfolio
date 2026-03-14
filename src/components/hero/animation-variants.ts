
import { Variants } from "framer-motion";

// Paradoxxia-style chromatic aberration transition between words
export const glitchVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1.03,
    skewX: 0,
    textShadow: "8px 0 0 rgba(255,20,20,0.8), -8px 0 0 rgba(0,255,255,0.75)",
  },
  animate: {
    opacity: 1,
    scale: [1.03, 0.99, 1.005, 1],
    skewX: [3, -1.5, 0],
    textShadow: [
      "10px 2px 0 rgba(255,20,20,0.85), -10px -2px 0 rgba(0,255,255,0.8)",
      "4px 0 0 rgba(255,20,20,0.6), -4px 0 0 rgba(0,255,255,0.55)",
      "2px 0 0 rgba(255,30,30,0.4), -2px 0 0 rgba(0,255,255,0.35)",
    ],
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 1,
    scale: [1, 0.97],
    skewX: [0, -3, 1.5, 0],
    textShadow: [
      "2px 0 0 rgba(255,30,30,0.4), -2px 0 0 rgba(0,255,255,0.35)",
      "10px 2px 0 rgba(255,20,20,0.85), -10px -2px 0 rgba(0,255,255,0.8)",
      "14px 3px 0 rgba(255,0,0,0.9), -14px -3px 0 rgba(0,255,255,0.85)",
    ],
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const pixelGlitch: Variants = {
  initial: {
    clipPath: "inset(0 0 0 0)",
  },
  animate: {
    clipPath: "inset(0 0 0 0)",
  },
};
