
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
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 flex flex-col md:justify-center bg-white dark:bg-neutral-950">
        <motion.div 
          key={heroImageIndex}
          className="flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={images[heroImageIndex]}
            alt={`${title} - Featured`}
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
        
        {/* Mobile view */}
        <div className="flex md:hidden overflow-x-auto h-24 bg-white dark:bg-neutral-950">
          {images.map((image, index) => (
            <div 
              key={index}
              onClick={() => onImageClick(index)}
              className={`cursor-pointer h-full flex-shrink-0 w-24 ${
                index === heroImageIndex ? 'opacity-50' : 'opacity-100 hover:opacity-80'
              }`}
            >
              <img
                src={image}
                alt={`${title} preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden md:grid grid-cols-6 gap-[5px] p-4 bg-white dark:bg-neutral-950">
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
                alt={`${title} preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
