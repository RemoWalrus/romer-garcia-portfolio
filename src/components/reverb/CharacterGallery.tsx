import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Rotate3D } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useReverbGallery } from "@/hooks/use-reverb-gallery";
import sparkTurnaround from "@/assets/spark-360-turnaround.webp.asset.json";
import sparkTurnaroundThumb from "@/assets/thumb-spark-360-turnaround.webp.asset.json";

interface Props {
  characterId: string;
  characterName: string;
}

const TURNAROUND_ID = "spark-360-turnaround";
const TURNAROUND_ANGLES = ["0°", "45°", "90°", "135°", "180°", "225°", "270°", "315°"];

const SparkTurnaround = () => {
  const [frame, setFrame] = useState(0);
  const dragStart = useRef<{ x: number; frame: number } | null>(null);
  const wheelDistance = useRef(0);

  const rotate = useCallback((delta: number) => {
    setFrame((current) => (current + delta + TURNAROUND_ANGLES.length) % TURNAROUND_ANGLES.length);
  }, []);

  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-black touch-none select-none">
      <div
        className="relative h-[min(72vh,700px)] max-h-[calc(100dvh-5rem)] aspect-[3/5] overflow-hidden"
        aria-label={`Interactive 360 degree turnaround of Spark, ${TURNAROUND_ANGLES[frame]} view`}
        onWheel={(event) => {
          event.preventDefault();
          wheelDistance.current += event.deltaY || event.deltaX;
          if (Math.abs(wheelDistance.current) < 28) return;
          rotate(wheelDistance.current > 0 ? 1 : -1);
          wheelDistance.current = 0;
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          dragStart.current = { x: event.clientX, frame };
        }}
        onPointerMove={(event) => {
          const start = dragStart.current;
          if (!start) return;
          const steps = Math.round((start.x - event.clientX) / 42);
          setFrame((start.frame + steps + TURNAROUND_ANGLES.length * 4) % TURNAROUND_ANGLES.length);
        }}
        onPointerUp={() => { dragStart.current = null; }}
        onPointerCancel={() => { dragStart.current = null; }}
      >
        <img
          src={sparkTurnaround.url}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-[800%] max-w-none object-fill"
          style={{ transform: `translateX(-${frame * 12.5}%)` }}
        />
      </div>

      <button
        type="button"
        onClick={() => rotate(-1)}
        aria-label="Turn Spark left"
        className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/80 sm:left-4"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => rotate(1)}
        aria-label="Turn Spark right"
        className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border border-white/20 bg-black/55 text-white transition-colors hover:bg-black/80 sm:right-4"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/75 px-3 py-2 text-white">
        <span className="font-roc text-[10px] uppercase tracking-[0.22em]">Drag or scroll to rotate</span>
        <span className="font-roc text-[10px] tracking-[0.2em] text-white/65">{TURNAROUND_ANGLES[frame]}</span>
      </div>
    </div>
  );
};

/**
 * Tiny square thumbnails for a character's tagged gallery images.
 * Clicking a thumbnail opens the full image.
 */
export const CharacterGallery = ({ characterId, characterName }: Props) => {
  const items = useReverbGallery(characterId);
  const hasTurnaround = characterId === "spark";
  const totalItems = items.length + (hasTurnaround ? 1 : 0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isTurnaround = hasTurnaround && openIndex === 0;
  const activeIndex = openIndex === null ? null : openIndex - (hasTurnaround ? 1 : 0);
  const active = activeIndex === null || activeIndex < 0 ? null : items[activeIndex];
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
          current === null || totalItems === 0
          ? current
          : (current + delta + totalItems) % totalItems
      );
    },
    [totalItems]
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


  if (!totalItems) {
    return (
      <p className="mt-3 font-roc text-[11px] tracking-[0.14em] uppercase text-black/45">
        Gallery coming soon.
      </p>
    );
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {hasTurnaround && (
          <button
            type="button"
            onClick={() => setOpenIndex(0)}
            title="Spark 360° turnaround"
            aria-label="Open Spark interactive 360 degree turnaround"
            className="relative h-14 w-14 overflow-hidden border border-black/15 bg-black/5 transition-colors hover:border-black/60 sm:h-16 sm:w-16"
          >
            <img
              src={sparkTurnaroundThumb.url}
              alt="Spark 360 degree turnaround"
              className="h-full w-full object-cover"
              width={64}
              height={64}
              decoding="async"
            />
            <span className="absolute bottom-0 right-0 grid h-5 w-5 place-items-center bg-black/75 text-white">
              <Rotate3D className="h-3 w-3" />
            </span>
          </button>
        )}
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenIndex(idx + (hasTurnaround ? 1 : 0))}
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

      <Dialog open={openIndex !== null} onOpenChange={() => setOpenIndex(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-white/10">
          {isTurnaround ? (
            <SparkTurnaround />
          ) : active ? (
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

              {totalItems > 1 && (
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
                {totalItems > 1 && (
                  <span className="text-white/60 font-roc text-[10px] tracking-[0.2em] shrink-0">
                    {(openIndex ?? 0) + 1}/{totalItems}
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CharacterGallery;
