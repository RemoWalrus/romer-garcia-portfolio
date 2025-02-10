
import { Variants } from "framer-motion";

export const glitchVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.99,
    filter: "blur(0px)",
    x: 0,
  },
  animate: {
    opacity: 1,
    scale: [0.99, 1.005, 0.995, 1],
    filter: [
      "blur(0px) brightness(100%) contrast(100%)",
      "blur(1px) brightness(120%) contrast(95%) hue-rotate(1deg)",
      "blur(0px) brightness(100%) contrast(100%)",
      "blur(0.5px) brightness(110%) contrast(97%) hue-rotate(-1deg)",
      "blur(0px) brightness(100%) contrast(100%)"
    ],
    x: [0, -1, 1, -0.5, 0.5, 0],
    transition: {
      duration: 0.8,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: [0.165, 0.84, 0.44, 1], // easeOutQuart
      staggerChildren: 0.05,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    filter: [
      "blur(0px) brightness(100%) contrast(100%)",
      "blur(1.5px) brightness(150%) contrast(90%) hue-rotate(2deg)",
      "blur(0px) brightness(100%) contrast(100%)"
    ],
    x: [0, 1, -1, 0.5, -0.5, 0],
    transition: {
      duration: 0.5,
      ease: [0.165, 0.84, 0.44, 1], // easeOutQuart
    }
  }
};

export const pixelGlitch: Variants = {
  initial: { 
    clipPath: "inset(0 0 0 0)" 
  },
  animate: {
    clipPath: [
      "inset(0 0 0 0)",
      "inset(5% 7% 12% 2%)",
      "inset(12% 2% 7% 5%)",
      "inset(7% 12% 2% 10%)",
      "inset(2% 5% 10% 7%)",
      "inset(0 0 0 0)"
    ],
    transition: {
      duration: 0.8,
      ease: [0.165, 0.84, 0.44, 1], // easeOutQuart
      repeat: 1,
      repeatType: "reverse",
      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
    }
  }
};

