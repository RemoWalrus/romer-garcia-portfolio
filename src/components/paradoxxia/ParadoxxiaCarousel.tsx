import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import placeholderImage from "@/assets/paradoxxia-carousel-placeholder.png";

interface CarouselItem {
  id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  link_url: string | null;
  sort_order: number | null;
}

interface ParadoxxiaCarouselProps {
  active: boolean;
}

const ParadoxxiaCarousel = ({ active }: ParadoxxiaCarouselProps) => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await (supabase as any)
        .from("paradoxxia_carousel")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setItems(data);
      } else {
        // Placeholder items when table is empty
        setItems([
          { id: 1, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 0 },
          { id: 2, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 1 },
          { id: 3, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 2 },
        ]);
      }
    };
    fetchItems();
  }, []);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    setCurrentIndex(clamped);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
  };

  if (items.length === 0) return null;

  return (
    <div
      className="w-full max-w-[900px] mx-auto flex flex-col items-center gap-4 pointer-events-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image display */}
      <div className="relative w-full aspect-square max-h-[60vh] overflow-hidden rounded-md">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={items[currentIndex].image_url}
            alt={items[currentIndex].title || "Paradoxxia artwork"}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Desktop arrow buttons */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="text-black disabled:opacity-30 transition-opacity hover:opacity-70"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-black scale-125" : "bg-black/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === items.length - 1}
          className="text-black disabled:opacity-30 transition-opacity hover:opacity-70"
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Mobile dot indicators */}
      <div className="flex md:hidden gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-black scale-125" : "bg-black/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ParadoxxiaCarousel;
