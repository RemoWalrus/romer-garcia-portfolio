import { Link } from "react-router-dom";
import { trackEvent } from "@/components/GoogleAnalytics";
import {
  displayTransmissionNumber,
  formatTransmissionDate,
  useLatestTransmission,
} from "@/hooks/use-reverb-transmissions";
import { useSmartCrop } from "@/hooks/use-smart-crop";
import { transmissionPath } from "./TransmissionCard";

/**
 * LATEST TRANSMISSION — recovered-media panel on the main Reverb page.
 * Always shows the newest published entry (featured rows never override it).
 */
const LatestTransmission = () => {
  const { transmission: t, loading } = useLatestTransmission();
  const coverPosition = useSmartCrop(t?.coverImage);

  if (loading) return null;

  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(t?.mediaUrl ?? "");

  return (
    <section
      aria-labelledby="reverb-latest-transmission"
      className="relative isolate reverb-noise border-t border-border bg-background transition-colors"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
        <p className="font-roc text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Reverb // Transmission
        </p>
        <p
          id="reverb-latest-transmission"
          className="mt-0 font-reverb text-lg font-black italic uppercase leading-none tracking-normal text-reverb-wordmark md:text-xl"
        >
          Latest Transmission
        </p>

        {!t ? (
          <p className="mt-8 border border-dashed border-border px-5 py-8 font-roc text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            No transmission detected
          </p>
        ) : (
          <article
            className={`mt-8 grid grid-cols-1 gap-0 border border-border md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] ${
              t.isAnomaly ? "reverb-anomaly" : ""
            }`}
          >
            <div className="relative min-h-[220px] overflow-hidden bg-foreground/[0.06] md:min-h-[340px]">
              {isVideo && t.mediaUrl ? (
                <video
                  src={t.mediaUrl}
                  poster={t.coverImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${t.title} video preview`}
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.35] transition-all duration-700 hover:grayscale-0"
                />
              ) : t.coverImage ? (
                <img
                  src={t.coverImage}
                  alt={t.title}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: coverPosition }}
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.35] transition-all duration-700 hover:grayscale-0"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-reverb text-6xl font-black italic uppercase text-foreground/10 md:text-8xl">
                    {displayTransmissionNumber(t.number, t.isAnomaly)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center px-5 py-8 md:px-9 md:py-10">
              <p className="font-roc text-[10px] uppercase tracking-[0.3em] text-reverb-wordmark">
                Transmission // {displayTransmissionNumber(t.number, t.isAnomaly)}
              </p>
              <h3 className="mt-3 font-reverb text-3xl font-black italic uppercase leading-[0.9] tracking-normal text-reverb-wordmark md:text-5xl">
                {t.title}
              </h3>
              {t.subtitle && (
                <p className="mt-2 font-roc text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {t.subtitle}
                </p>
              )}
              <p className="mt-4 font-roc text-[9px] uppercase tracking-[0.28em] text-muted-foreground/80">
                {t.category}
                {t.characterSlug && <> // {t.characterSlug}</>}
                {t.publishedAt && (
                  <> // {formatTransmissionDate(t.publishedAt, t.isAnomaly)}</>
                )}
              </p>
              {t.excerpt && (
                <p className="mt-5 max-w-[52ch] font-roc text-[13px] leading-[1.85] text-foreground/75 md:text-sm">
                  {t.excerpt}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={transmissionPath(t.slug)}
                  onClick={() =>
                    trackEvent("Reverb Transmissions", "transmission_open", `home:${t.slug}`)
                  }
                  className="reverb-button"
                >
                  Open Transmission →
                </Link>
                <Link to="/reverb/transmissions" className="reverb-button">
                  Archive
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
};

export default LatestTransmission;
