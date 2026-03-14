
import { Variants } from "framer-motion";

// Paradoxxia-style chromatic aberration transition between words
export const glitchVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1.02,
    skewX: 0,
    textShadow: "3px 0 0 rgba(255,20,20,0.45), -3px 0 0 rgba(0,255,255,0.4)",
  },
  animate: {
    opacity: 1,
    scale: [1.06, 0.92, 1.04, 0.98, 1],
    skewX: [8, -12, 6, -2, 0],
    textShadow: [
      "18px 5px 0 rgba(255,0,0,0.95), -18px -5px 0 rgba(0,255,255,0.9)",
      "-14px -4px 0 rgba(255,0,0,0.85), 14px 4px 0 rgba(0,255,255,0.8)",
      "8px 2px 0 rgba(255,20,20,0.6), -8px -2px 0 rgba(0,255,255,0.55)",
      "3px 0 0 rgba(255,20,20,0.45), -3px 0 0 rgba(0,255,255,0.4)",
    ],
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      times: [0, 0.2, 0.5, 0.8, 1],
    },
  },
  exit: {
    opacity: 1,
    scale: [1, 0.94, 1.08, 0.96],
    skewX: [0, -10, 14, -6, 2],
    textShadow: [
      "3px 0 0 rgba(255,20,20,0.45), -3px 0 0 rgba(0,255,255,0.4)",
      "20px 6px 0 rgba(255,0,0,0.95), -20px -6px 0 rgba(0,255,255,0.9)",
      "-16px -5px 0 rgba(255,0,0,0.9), 16px 5px 0 rgba(0,255,255,0.85)",
    ],
    transition: {
      duration: 0.35,
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
