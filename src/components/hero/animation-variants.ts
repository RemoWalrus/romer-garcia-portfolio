
import { Variants } from "framer-motion";

export const glitchVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
    x: 0,
    skewX: 0,
    filter: "blur(0px) brightness(100%) contrast(100%) hue-rotate(0deg)",
    textShadow: "0px 0 0 rgba(255,0,0,0), 0px 0 0 rgba(0,255,255,0)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: [10, -5, 2, -1, 0],
    skewX: [3, -1.5, 0.6, -0.2, 0],
    filter: [
      "blur(1.4px) brightness(135%) contrast(98%) hue-rotate(10deg)",
      "blur(0.8px) brightness(118%) contrast(99%) hue-rotate(-6deg)",
      "blur(0.3px) brightness(108%) contrast(100%) hue-rotate(2deg)",
      "blur(0px) brightness(100%) contrast(100%) hue-rotate(0deg)",
    ],
    textShadow: [
      "6px 0 0 rgba(255,0,0,0.5), -6px 0 0 rgba(0,255,255,0.5)",
      "3px 0 0 rgba(255,0,0,0.35), -3px 0 0 rgba(0,255,255,0.35)",
      "1.5px 0 0 rgba(255,0,0,0.2), -1.5px 0 0 rgba(0,255,255,0.2)",
      "0px 0 0 rgba(255,0,0,0), 0px 0 0 rgba(0,255,255,0)",
    ],
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
      times: [0, 0.3, 0.6, 1],
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 1,
    scale: 1,
    x: [0, 6, -4, 2, 0],
    skewX: [0, -2, 1, -0.3, 0],
    filter: [
      "blur(0px) brightness(100%) contrast(100%) hue-rotate(0deg)",
      "blur(1px) brightness(125%) contrast(97%) hue-rotate(-8deg)",
      "blur(1.8px) brightness(145%) contrast(95%) hue-rotate(16deg)",
      "blur(0px) brightness(100%) contrast(100%) hue-rotate(0deg)",
    ],
    textShadow: [
      "0px 0 0 rgba(255,0,0,0), 0px 0 0 rgba(0,255,255,0)",
      "4px 0 0 rgba(255,0,0,0.4), -4px 0 0 rgba(0,255,255,0.4)",
      "8px 0 0 rgba(255,0,0,0.5), -8px 0 0 rgba(0,255,255,0.5)",
      "0px 0 0 rgba(255,0,0,0), 0px 0 0 rgba(0,255,255,0)",
    ],
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
      times: [0, 0.35, 0.75, 1],
    },
  },
};

export const pixelGlitch: Variants = {
  initial: {
    clipPath: "inset(0 0 0 0)",
  },
  animate: {
    clipPath: [
      "inset(0 0 0 0)",
      "inset(2% 3% 4% 1%)",
      "inset(4% 1% 3% 2%)",
      "inset(3% 4% 1% 3%)",
      "inset(1% 2% 3% 2%)",
      "inset(0 0 0 0)",
    ],
    transition: {
      duration: 0.5,
      ease: [0.165, 0.84, 0.44, 1],
      repeat: 1,
      repeatType: "reverse",
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
    },
  },
};
