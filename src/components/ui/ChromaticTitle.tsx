import React from 'react';

interface ChromaticTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export const ChromaticTitle: React.FC<ChromaticTitleProps> = ({ 
  children, 
  className = '', 
  as: Tag = 'h2' 
}) => {
  return (
    <Tag
      className={className}
      style={{
        textShadow: `
          1.5px -0.5px 0 rgba(255, 20, 20, 0.15),
          -1.5px 0.5px 0 rgba(0, 255, 255, 0.12)
        `,
      }}
    >
      {children}
    </Tag>
  );
};
