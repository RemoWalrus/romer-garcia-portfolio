
import { Variants } from "framer-motion";

// Paradoxxia-style chromatic aberration transition between words
export const glitchVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1.02,
    skewX: 0,
    textShadow: "5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)",
  },
  animate: {
    opacity: 1,
    scale: [1.02, 1],
    skewX: [2, -1, 0],
    textShadow: [
      "5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)",
      "3px 0 0 rgba(255,0,0,0.4), -3px 0 0 rgba(0,255,255,0.4)",
      "2px 0 0 rgba(255,0,0,0.3), -2px 0 0 rgba(0,255,255,0.25)",
    ],
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 1,
    scale: [1, 0.98],
    skewX: [0, -2, 1, 0],
    textShadow: [
      "2px 0 0 rgba(255,0,0,0.3), -2px 0 0 rgba(0,255,255,0.25)",
      "5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)",
      "8px 0 0 rgba(255,0,0,0.6), -8px 0 0 rgba(0,255,255,0.55)",
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
