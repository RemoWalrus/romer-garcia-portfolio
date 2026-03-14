
import { Variants } from "framer-motion";

// Paradoxxia-style chromatic aberration transition between words
// Ghost layers handle the separated channel effect in HeroTitle
export const glitchVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1.02,
    skewX: 0,
  },
  animate: {
    opacity: 1,
    scale: [1.02, 0.995, 1],
    skewX: [4, -2, 0],
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 1,
    scale: [1, 0.97],
    skewX: [0, -4, 2, 0],
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
