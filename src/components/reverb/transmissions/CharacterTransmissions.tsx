import { Link } from "react-router-dom";
import { trackEvent } from "@/components/GoogleAnalytics";
import {
  displayTransmissionNumber,
  formatTransmissionNumber,
  useArchiveSlots,
  useTransmissions,
} from "@/hooks/use-reverb-transmissions";
import { transmissionPath } from "./TransmissionCard";

const SLOT_LABEL: Record<string, string> = {
  locked: "Locked",
  classified: "Classified",
  missing: "Record missing",
  corrupted: "Corrupted",
};

/**
 * <character> // ARCHIVE — recent published transmissions for one character,
 * followed by any future-facing placeholder slots. Placeholders never leak
 * draft content: they are label-only rows in `reverb_archive_slots`.
 */
const CharacterTransmissions = ({
  characterSlug,
  characterName,
  accent,
  limit = 3,
}: {
  characterSlug: string;
  characterName: string;
  accent: string;
  limit?: number;
}) => {
  const { items } = useTransmissions({ character: characterSlug, limit });
  const slots = useArchiveSlots(characterSlug);

  if (!items.length && !slots.length) return null;

  return (
    <>
      <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-1.5 border-b-2 border-black/80">
        {characterName} // Archive
      </h2>
      <div className="mt-3">
      <ul className="space-y-2">
        {items.map((t) => (
          <li key={t.id} className={t.isAnomaly ? "reverb-anomaly" : undefined}>
            <Link
              to={transmissionPath(t.slug)}
              onClick={() =>
                trackEvent(
                  "Reverb Transmissions",
                  "transmission_open",
                  `character:${t.slug}`,
                )
              }
              className="group block"
            >
              <span
                className="font-roc text-[10px] uppercase tracking-[0.22em]"
                style={{ color: accent }}
              >
                Transmission {displayTransmissionNumber(t.number, t.isAnomaly)}
              </span>
              <span className="block font-roc text-[11px] uppercase tracking-[0.14em] text-black/75 group-hover:text-black">
                {t.title}
              </span>
            </Link>
          </li>
        ))}

        {slots
          .filter((s) => s.status !== "released" || !items.length)
          .map((s) => (
            <li key={s.id} className={s.status === "corrupted" ? "reverb-anomaly" : undefined}>
              <span className="font-roc text-[10px] uppercase tracking-[0.22em] text-black/35">
                {s.label ?? formatTransmissionNumber(s.order)}
              </span>
              <span className="block font-roc text-[11px] uppercase tracking-[0.14em] text-black/40">
                {s.status === "released" ? s.title : SLOT_LABEL[s.status] ?? s.title}
              </span>
            </li>
          ))}
      </ul>

      {items.length > 0 && (
        <Link
          to="/reverb/transmissions"
          className="mt-4 inline-block font-roc text-[10px] uppercase tracking-[0.22em] underline underline-offset-4"
          style={{ color: accent }}
          aria-label={`View all transmissions including ${characterName}`}
        >
          View all →
        </Link>
      )}
      </div>
    </>
  );
};

export default CharacterTransmissions;
