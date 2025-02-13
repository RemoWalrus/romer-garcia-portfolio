
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface GalleryImage {
  id: number;
  image_url: string;
  title: string | null;
}

export const ImageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 6;

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (data) {
      setImages(data);
    } else if (error) {
      console.error('Error fetching gallery images:', error);
    }
  };

  const totalPages = Math.ceil(images.length / imagesPerPage);
  const currentImages = images.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const handleModalNext = () => {
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handleModalPrevious = () => {
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[previousIndex]);
  };

  return (
    <section className="relative bg-white dark:bg-neutral-900 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              onClick={() => handleImageClick(image)}
              className="relative cursor-pointer group aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800"
            >
              <img
                src={image.image_url}
                alt={image.title || 'Gallery image'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{image.title || 'View Image'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentPage === index
                      ? 'bg-neutral-900 dark:bg-white w-4'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="bg-white dark:bg-neutral-900 max-w-4xl w-[95vw] p-0">
          <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
            {selectedImage && (
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || 'Gallery image'}
                className="w-full h-full object-contain"
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleModalNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {selectedImage?.title && (
            <div className="p-4 text-center">
              <p className="text-lg font-medium">{selectedImage.title}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
