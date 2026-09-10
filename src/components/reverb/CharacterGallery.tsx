import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReverbGallery } from "@/hooks/use-reverb-gallery";

// The lightbox dialog only matters after a thumbnail is clicked — keep it out of the page bundle.
const Dialog = lazy(() => import("@/components/ui/dialog").then((m) => ({ default: m.Dialog })));
const DialogContent = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogContent }))
);

interface Props {
  characterId: string;
  characterName: string;
}

/**
 * Tiny square thumbnails for a character's tagged gallery images.
 * Clicking a thumbnail opens the full image.
 */
export const CharacterGallery = ({ characterId, characterName }: Props) => {
  const items = useReverbGallery(characterId);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex === null ? null : items[openIndex];
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null || items.length === 0
          ? current
          : (current + delta + items.length) % items.length
      );
    },
    [items.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);


  if (!items.length) {
    return (
      <p className="mt-3 font-roc text-[11px] tracking-[0.14em] uppercase text-black/45">
        Gallery coming soon.
      </p>
    );
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenIndex(idx)}
            title={item.caption}
            aria-label={item.caption || `${characterName} gallery image ${idx + 1}`}
            className="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border border-black/15 bg-black/5 hover:border-black/60 transition-colors"
          >
            {item.mediaType === "video" ? (
              <video src={item.src} className="w-full h-full object-cover" preload="metadata" muted />
            ) : (
              <img
                src={item.thumbSrc}
                alt={item.caption || `${characterName} — Reverb gallery image ${idx + 1}`}
                className="w-full h-full object-cover"
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
              />
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
      <Suspense fallback={null}>
      <Dialog open={active !== null} onOpenChange={() => setOpenIndex(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-white/10">
          {active && (
            <div
              className="relative touch-pan-y select-none"
              onTouchStart={(e) => {
                const t = e.touches[0];
                touchStart.current = { x: t.clientX, y: t.clientY };
              }}
              onTouchEnd={(e) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start) return;
                const t = e.changedTouches[0];
                const dx = t.clientX - start.x;
                const dy = t.clientY - start.y;
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
              }}
            >
              {active.mediaType === "video" ? (
                <video src={active.src} className="w-full max-h-[85vh]" controls autoPlay />
              ) : (
                <img
                  src={active.src}
                  alt={active.caption || `${characterName} — Reverb gallery image`}
                  className="w-full max-h-[85vh] object-contain"
                  draggable={false}
                />
              )}

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 bg-black/55 hover:bg-black/80 text-white border border-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 bg-black/55 hover:bg-black/80 text-white border border-white/20 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-black/70 px-3 py-2">
                <span className="text-white/90 font-roc text-[10px] tracking-[0.25em] uppercase truncate">
                  {active.caption || ""}
                </span>
                {items.length > 1 && (
                  <span className="text-white/60 font-roc text-[10px] tracking-[0.2em] shrink-0">
                    {(openIndex ?? 0) + 1}/{items.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </Suspense>
      )}
    </>
  );
};

export default CharacterGallery;
