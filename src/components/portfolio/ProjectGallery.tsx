
import { useRef } from "react";
import { motion } from "framer-motion";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  heroImageIndex: number;
  onImageClick: (index: number) => void;
  isMobile: boolean;
}

export const ProjectGallery = ({ 
  images, 
  title, 
  heroImageIndex, 
  onImageClick, 
  isMobile 
}: ProjectGalleryProps) => {
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && heroImageIndex < images.length - 1) {
        onImageClick(heroImageIndex + 1);
      } else if (diff < 0 && heroImageIndex > 0) {
        onImageClick(heroImageIndex - 1);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 flex flex-col md:justify-center bg-white dark:bg-neutral-950">
        <motion.div 
          key={heroImageIndex}
          className="flex items-center justify-center p-2 md:p-4 w-full h-full"
          initial={{ opacity: 0, x: isMobile ? 30 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchMove={isMobile ? handleTouchMove : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
        >
          <img
            src={images[heroImageIndex]}
            alt={`Featured view of ${title} — creative project by Romer Garcia`}
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>

        {/* Mobile dot indicators */}
        {isMobile && images.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-2">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => onImageClick(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  index === heroImageIndex 
                    ? 'bg-neutral-900 dark:bg-white scale-125' 
                    : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Desktop thumbnail grid */}
        <div className="hidden md:grid grid-cols-6 gap-1 p-2 bg-white dark:bg-neutral-950">
          {images.map((image, index) => (
            <div 
              key={index}
              onClick={() => onImageClick(index)}
              className={`cursor-pointer aspect-square overflow-hidden ${
                index === heroImageIndex ? 'opacity-50' : 'opacity-100 hover:opacity-80'
              }`}
            >
              <img
                src={image}
                alt={`${title} by Romer Garcia — detail view ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
