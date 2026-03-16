
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChromaticTitle } from '@/components/ui/ChromaticTitle';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getProxiedData } from "@/utils/proxyHelper";
import { toProxyUrl } from "@/utils/supabaseProxy";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface GalleryImage {
  id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  alt_text?: string | null;
}

export const ImageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 6;
  const isMobile = useIsMobile();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = e.touches[0].clientY;
  };
  const handleSwipeMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };
  const handleSwipeEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = Math.abs(touchStartY.current - touchEndY.current);
    const absDiffX = Math.abs(diffX);
    
    // Vertical swipe to close
    if (diffY > 100 && diffY > absDiffX) {
      setSelectedImage(null);
      return;
    }
    // Horizontal swipe to navigate
    if (absDiffX > 50 && absDiffX > diffY) {
      if (diffX > 0) {
        navigateModal('next');
      } else {
        navigateModal('prev');
      }
    }
  };

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const data = await getProxiedData('gallery', {
          order: 'sort_order:asc'
        });
        
        if (data) {
          setImages(data.map((img: GalleryImage) => ({
            ...img,
            image_url: toProxyUrl(img.image_url),
          })));
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };

    fetchGalleryImages();
  }, []);

  const totalPages = Math.ceil(images.length / imagesPerPage);
  const currentImages = images.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  const navigateGallery = useCallback((direction: 'prev' | 'next') => {
    setCurrentPage(prev => {
      if (direction === 'next') {
        return (prev + 1) % totalPages;
      }
      return (prev - 1 + totalPages) % totalPages;
    });
  }, [totalPages]);

  const navigateModal = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[newIndex]);
  }, [images, selectedImage?.id]);

  return (
    <section 
      id="gallery" 
      className="relative py-16 -mt-[1.1rem] -mb-0.5 bg-fixed bg-center bg-cover bg-no-repeat before:content-[''] before:absolute before:inset-0 before:bg-white/90 dark:before:bg-neutral-900/90 before:backdrop-blur-sm" 
      style={{
        backgroundImage: `url('${toProxyUrl("https://xxigtbxqgbdcfpmnrzvp.supabase.co/storage/v1/object/public/projects//Hairwars16.jpg")}')`
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <ChromaticTitle className="text-3xl md:text-4xl lg:text-5xl font-roc font-extralight text-neutral-900 dark:text-white mb-16 text-center uppercase">
          Gallery
        </ChromaticTitle>
        
        <div className="relative max-w-[90rem] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {currentImages.map((image) => (
              <motion.button
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedImage(image)}
                className="group aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="relative w-full h-full">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || (image.title ? `Romer Garcia — ${image.title}` : 'Romer Garcia creative work gallery image')}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {image.title || 'View Image'}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center absolute -inset-x-12 top-1/2 -translate-y-1/2">
              <button
                onClick={() => navigateGallery('prev')}
                className="p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateGallery('next')}
                className="p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent 
          className="bg-white dark:bg-neutral-900 max-w-4xl w-[95vw] p-0"
          onTouchStart={isMobile ? handleSwipeStart : undefined}
          onTouchMove={isMobile ? handleSwipeMove : undefined}
          onTouchEnd={isMobile ? handleSwipeEnd : undefined}
        >
          <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
            {selectedImage && (
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || (selectedImage.title ? `Romer Garcia — ${selectedImage.title}` : 'Romer Garcia creative work gallery image')}
                className="w-full h-full object-contain"
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateModal('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateModal('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {(selectedImage?.title || selectedImage?.description) && (
            <div className="p-4 text-center">
              {selectedImage?.title && (
                <p className="text-lg font-medium mb-2">{selectedImage.title}</p>
              )}
              {selectedImage?.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{selectedImage.description}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
