import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useReverbGallery } from "@/hooks/use-reverb-gallery";

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
                src={item.src}
                alt={item.caption || `${characterName} — Reverb gallery image ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={() => setOpenIndex(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black border-white/10">
          {active && (
            <div className="relative">
              {active.mediaType === "video" ? (
                <video src={active.src} className="w-full max-h-[85vh]" controls autoPlay />
              ) : (
                <img
                  src={active.src}
                  alt={active.caption || `${characterName} — Reverb gallery image`}
                  className="w-full max-h-[85vh] object-contain"
                />
              )}
              {active.caption && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white/90 font-roc text-[10px] tracking-[0.25em] uppercase px-3 py-2">
                  {active.caption}
                </span>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CharacterGallery;
