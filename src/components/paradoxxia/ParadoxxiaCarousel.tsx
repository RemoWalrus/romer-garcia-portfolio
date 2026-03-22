import { useState, useEffect, useRef, useCallback } from "react";
import placeholderImage from "@/assets/paradoxxia-carousel-placeholder.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParadoxxiaData } from "@/hooks/use-paradoxxia-data";

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
  const { carousel } = useParadoxxiaData();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const visibleCount = isMobile ? 1 : 3;

  useEffect(() => {
    if (carousel && carousel.length > 0) {
      setItems(carousel);
    } else if (carousel && carousel.length === 0) {
      setItems([
        { id: 1, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 0 },
        { id: 2, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 1 },
        { id: 3, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 2 },
        { id: 4, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 3 },
        { id: 5, image_url: placeholderImage, title: null, description: null, link_url: null, sort_order: 4 },
      ]);
    }
  }, [carousel]);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const goTo = useCallback((index: number) => {
    setScrollIndex(Math.max(0, Math.min(maxIndex, index)));
  }, [maxIndex]);

  // Mouse wheel horizontal scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 5) return;
      e.preventDefault();
      e.stopPropagation();
      if (delta > 0) goTo(scrollIndex + 1);
      else goTo(scrollIndex - 1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollIndex, goTo]);

  const isSwiping = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    const diff = Math.abs(touchStartX.current - touchEndX.current);
    if (diff > 10) {
      isSwiping.current = true;
      e.stopPropagation();
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) goTo(scrollIndex + 1);
    else if (diff < -50) goTo(scrollIndex - 1);
    isSwiping.current = false;
  };

  if (items.length === 0) return null;

  const translateX = -(scrollIndex * (100 / items.length));

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1200px] mx-auto flex flex-col items-center gap-4 pointer-events-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Panels display */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: isMobile ? '1' : '3/1.05' }}>
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: isMobile ? `${items.length * 100}%` : `${(items.length / visibleCount) * 100}%`,
            transform: isMobile
              ? `translateX(${-(scrollIndex * (100 / items.length))}%)`
              : `translateX(${translateX}%)`
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="h-full flex-shrink-0"
              style={{ width: `${100 / items.length}%` }}
            >
              <img
                src={item.image_url}
                alt={item.title || "Paradoxxia artwork"}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => goTo(scrollIndex - 1)}
          disabled={scrollIndex === 0}
          className="text-black disabled:opacity-30 transition-opacity hover:opacity-70"
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index >= scrollIndex && index < scrollIndex + visibleCount
                  ? "bg-black scale-125"
                  : "bg-black/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo(scrollIndex + 1)}
          disabled={scrollIndex >= maxIndex}
          className="text-black disabled:opacity-30 transition-opacity hover:opacity-70"
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ParadoxxiaCarousel;
