import { Link } from "react-router-dom";
import { trackEvent } from "@/components/GoogleAnalytics";
import { useSmartCrop } from "@/hooks/use-smart-crop";
import {
  TransmissionPreview,
  displayTransmissionNumber,
  formatTransmissionDate,
} from "@/hooks/use-reverb-transmissions";

export const transmissionPath = (slug: string) => `/reverb/transmissions/${slug}`;

/** Archive entry used in the /reverb/transmissions listing. */
const TransmissionCard = ({
  transmission: t,
  accentColor,
  origin = "archive",
}: {
  transmission: TransmissionPreview;
  accentColor?: string;
  origin?: string;
}) => {
  const accent = accentColor ?? "hsl(var(--reverb-wordmark))";
  const thumbPosition = useSmartCrop(t.thumbnail);

  return (
    <Link
      to={transmissionPath(t.slug)}
      onClick={() =>
        trackEvent("Reverb Transmissions", "transmission_open", `${origin}:${t.slug}`)
      }
      className={`group relative flex gap-5 border-b border-border py-6 transition-colors hover:bg-foreground/[0.03] ${
        t.isAnomaly ? "reverb-anomaly" : ""
      }`}
    >
      <div className="relative hidden w-[132px] shrink-0 overflow-hidden bg-foreground/[0.06] sm:block md:w-[180px]">
        {t.thumbnail ? (
          <img
            src={t.thumbnail}
            alt={t.title}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: thumbPosition }}
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full min-h-[96px] items-center justify-center">
            <span className="font-roc text-[9px] tracking-[0.3em] uppercase text-muted-foreground/60">
              No Signal
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-roc text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
          <span style={{ color: accent }}>
            Transmission // {displayTransmissionNumber(t.number, t.isAnomaly)}
          </span>
          {t.characterSlug && <span> — {t.characterSlug}</span>}
        </p>

        <h3 className="mt-2 font-reverb text-2xl font-black italic uppercase leading-[0.95] tracking-normal text-reverb-wordmark md:text-3xl">
          {t.title}
        </h3>

        {t.subtitle && (
          <p className="mt-1 font-roc text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t.subtitle}
          </p>
        )}

        {t.excerpt && (
          <p className="mt-3 max-w-[62ch] font-roc text-[13px] leading-[1.8] text-foreground/70">
            {t.excerpt}
          </p>
        )}

        <p className="mt-4 font-roc text-[9px] uppercase tracking-[0.28em] text-muted-foreground/80">
          {t.category}
          {t.publishedAt && (
            <> // {formatTransmissionDate(t.publishedAt, t.isAnomaly)}</>
          )}
        </p>
      </div>
    </Link>
  );
};

export default TransmissionCard;
