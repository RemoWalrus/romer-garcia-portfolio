
import { Variants } from "framer-motion";

// Paradoxxia-style chromatic aberration transition between words
export const glitchVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1.03,
    x: 0,
    skewX: 0,
    textShadow: "5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)",
  },
  animate: {
    opacity: 1,
    scale: [1.03, 0.995, 1.008, 1],
    x: [14, -6, 3, -1, 0],
    skewX: [3.5, -1.8, 0.8, -0.2, 0],
    textShadow: [
      "5px 0 0 rgba(255,0,0,0.5), -5px 0 0 rgba(0,255,255,0.5)",
      "2.5px 0 0 rgba(255,0,0,0.35), -2.5px 0 0 rgba(0,255,255,0.35)",
      "1.5px 0 0 rgba(255,0,0,0.22), -1.5px 0 0 rgba(0,255,255,0.22)",
      "0.5px 0 0 rgba(255,0,0,0.15), -0.5px 0 0 rgba(0,255,255,0.15)",
    ],
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
      times: [0, 0.3, 0.6, 0.85, 1],
    },
  },
  exit: {
    opacity: 1,
    scale: [1, 1.01, 0.97],
    x: [0, -10, 6, -3, 0],
    skewX: [0, -3, 1.5, -0.5, 0],
    textShadow: [
      "0.5px 0 0 rgba(255,0,0,0.15), -0.5px 0 0 rgba(0,255,255,0.15)",
      "4px 0 0 rgba(255,0,0,0.45), -4px 0 0 rgba(0,255,255,0.45)",
      "7px 0 0 rgba(255,0,0,0.55), -7px 0 0 rgba(0,255,255,0.55)",
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
