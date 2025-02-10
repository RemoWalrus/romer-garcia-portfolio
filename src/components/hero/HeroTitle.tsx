
import React from 'react';
import { motion } from 'framer-motion';
import { pixelGlitch } from './animation-variants';
import type { TitleConfig } from './title-config';

interface HeroTitleProps {
  title: TitleConfig;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  const renderTitle = (text: string, weights: string[]) => {
    if (text === "romergarcia") {
      return (
        <span>
          <span className="font-medium">romer</span>
          <span className="font-thin text-neutral-200">garcia</span>
        </span>
      );
    }

    const words = text.split(" ");
    if (words.length === 1) {
      return <span className="font-thin">{text}</span>;
    }

    return (
      <span>
        {words.map((word, index) => (
          <span
            key={index}
            className={`${weights[index % weights.length]} ${index > 0 ? "ml-4" : ""}`}
          >
            {word}
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      <motion.h1
        variants={pixelGlitch}
        className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8"
        style={{
          textShadow: `
            2px 0 0 rgba(255,0,0,0.3),
            -2px 0 0 rgba(0,255,255,0.3)
          `,
          fontFeatureSettings: '"ss01"'
        }}
      >
        {renderTitle(title.text, title.weights)}
      </motion.h1>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "difference",
          textShadow: "none"
        }}
        animate={{
          clipPath: [
            "inset(50% 0 50% 0)",
            "inset(0% 0 0% 0)",
            "inset(50% 0 50% 0)"
          ],
          transition: {
            duration: 0.4,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: 1,
            repeatType: "reverse"
          }
        }}
      >
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-roc text-white mb-8">
          {renderTitle(title.text, title.weights)}
        </h1>
      </motion.div>
    </>
  );
};
