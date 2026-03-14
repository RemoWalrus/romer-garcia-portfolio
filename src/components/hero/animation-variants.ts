
import { Variants } from "framer-motion";

export const glitchVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 1,
    x: 0,
    skewX: 0,
    filter: "blur(0px) brightness(100%) hue-rotate(0deg)",
  },
  animate: {
    opacity: [0, 0.6, 0.85, 1, 1],
    scale: [0.98, 1.005, 0.998, 1],
    x: [12, -6, 3, -1, 0],
    skewX: [4, -2, 1, -0.3, 0],
    filter: [
      "blur(2px) brightness(140%) hue-rotate(15deg)",
      "blur(1px) brightness(120%) hue-rotate(-8deg)",
      "blur(0.5px) brightness(108%) hue-rotate(3deg)",
      "blur(0px) brightness(100%) hue-rotate(0deg)",
    ],
    textShadow: [
      "6px 0 0 rgba(255,0,0,0.5), -6px 0 0 rgba(0,255,255,0.5)",
      "3px 0 0 rgba(255,0,0,0.35), -3px 0 0 rgba(0,255,255,0.35)",
      "1px 0 0 rgba(255,0,0,0.2), -1px 0 0 rgba(0,255,255,0.2)",
      "0px 0 0 rgba(255,0,0,0), 0px 0 0 rgba(0,255,255,0)",
    ],
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
      times: [0, 0.25, 0.5, 0.75, 1],
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: [1, 0.8, 0.5, 0],
    scale: [1, 1.003, 0.99, 0.98],
    x: [0, -8, 5, -3, 0],
    skewX: [0, -3, 1.5, -0.5, 0],
    filter: [
      "blur(0px) brightness(100%) hue-rotate(0deg)",
      "blur(1px) brightness(130%) hue-rotate(-10deg)",
      "blur(2px) brightness(150%) hue-rotate(20deg)",
      "blur(3px) brightness(100%) hue-rotate(0deg)",
    ],
    textShadow: [
      "0px 0 0 rgba(255,0,0,0), 0px 0 0 rgba(0,255,255,0)",
      "4px 0 0 rgba(255,0,0,0.4), -4px 0 0 rgba(0,255,255,0.4)",
      "8px 0 0 rgba(255,0,0,0.5), -8px 0 0 rgba(0,255,255,0.5)",
      "0px 0 0 rgba(255,0,0,0), 0px 0 0 rgba(0,255,255,0)",
    ],
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const pixelGlitch: Variants = {
  initial: { 
    clipPath: "inset(0 0 0 0)" 
  },
  animate: {
    clipPath: [
      "inset(0 0 0 0)",
      "inset(2% 3% 4% 1%)",
      "inset(4% 1% 3% 2%)",
      "inset(3% 4% 1% 3%)",
      "inset(1% 2% 3% 2%)",
      "inset(0 0 0 0)"
    ],
    transition: {
      duration: 0.5,
      ease: [0.165, 0.84, 0.44, 1],
      repeat: 1,
      repeatType: "reverse",
      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
    }
  }
};
