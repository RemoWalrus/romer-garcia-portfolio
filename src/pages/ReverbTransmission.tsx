import { useEffect } from "react";
import { Download } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import ReverbHeader from "@/components/reverb/ReverbHeader";
import { TransmissionBody } from "@/lib/transmissionMarkdown";
import { trackEvent } from "@/components/GoogleAnalytics";
import { useReverbCharacters } from "@/hooks/use-reverb-characters";
import {
  displayTransmissionNumber,
  formatTransmissionDate,
  formatTransmissionNumber,
  useTransmission,
} from "@/hooks/use-reverb-transmissions";

const SITE = "https://romer-garcia-portfolio.lovable.app";

const ReverbTransmission = () => {
  const { slug } = useParams<{ slug: string }>();
  const { transmission: t, state } = useTransmission(slug?.toLowerCase());
  const characters = useReverbCharacters();
  const character = characters.find((c) => c.id === t?.characterSlug);
  const accent = character?.accent ?? "hsl(var(--reverb-wordmark))";

  useEffect(() => {
    if (!t) return;
    trackEvent(
      "Reverb Transmissions",
      "transmission_view",
      `${formatTransmissionNumber(t.number)}:${t.slug}:${t.characterSlug ?? "general"}:${t.category}`,
    );
  }, [t?.id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ReverbHeader sticky />
        <p className="px-5 pt-28 font-roc text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:px-8">
          Decoding transmission…
        </p>
      </div>
    );
  }

  if (state === "missing" || !t) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>Transmission not found | Reverb</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <ReverbHeader sticky />
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1500px] flex-col items-start justify-center px-5 md:px-8">
          <h1 className="font-reverb text-4xl font-black italic uppercase text-reverb-wordmark md:text-6xl">
            Signal lost
          </h1>
          <p className="mt-4 font-roc text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            This transmission is not in the archive.
          </p>
          <Link to="/reverb/transmissions" className="reverb-button mt-8">
            ← Archive
          </Link>
        </div>
      </div>
    );
  }

  const number = displayTransmissionNumber(t.number, t.isAnomaly);
  const pageTitle = `${t.title} | Reverb Transmission ${formatTransmissionNumber(t.number)}`;
  const description =
    t.excerpt ?? `Transmission ${formatTransmissionNumber(t.number)} from the Reverb archive.`;
  const canonical = `${SITE}/reverb/transmissions/${t.slug}`;
  const ogImage = t.coverImage?.startsWith("http") ? t.coverImage : undefined;
  const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(t.mediaUrl ?? "");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <link rel="canonical" href={canonical} />
      </Helmet>

      <ReverbHeader sticky accentColor={character?.accent} />

      <main className="mx-auto w-full max-w-[1500px] px-5 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24">
        <article className={t.isAnomaly ? "reverb-anomaly" : undefined}>
          {hasCoverOverlay && (
            <div className="relative">
              <img
                src={t.coverImage}
                alt={t.title}
                loading="eager"
                decoding="async"
                className="w-full border border-border object-cover"
              />
              <a
                href={t.coverImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${t.title} image`}
                onClick={() =>
                  trackEvent("Reverb Transmissions", "transmission_image_download", t.slug)
                }
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center border border-border bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-background/90"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          )}

          <div
            className={
              hasCoverOverlay
                ? "relative z-10 mt-6 md:-mt-[34%] md:mx-6 md:border md:border-border md:bg-background/80 md:p-8 md:backdrop-blur-md"
                : undefined
            }
          >
          <p
            className="font-roc text-[10px] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            Transmission // {number}
          </p>

          <h1 className="mt-4 max-w-[26ch] font-reverb text-4xl font-black italic uppercase leading-[0.9] tracking-normal text-reverb-wordmark md:text-6xl">
            {t.title}
          </h1>

          {t.subtitle && (
            <p className="mt-3 max-w-[52ch] font-roc text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {t.subtitle}
            </p>
          )}

          <p className="mt-6 border-y border-border py-3 font-roc text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
            {t.category}
            {character && (
              <>
                {" // "}
                <Link
                  to={`/reverb/${character.id}`}
                  className="underline underline-offset-4"
                  style={{ color: accent }}
                >
                  {character.name}
                </Link>
              </>
            )}
            {t.publishedAt && <> // {formatTransmissionDate(t.publishedAt, t.isAnomaly)}</>}
          </p>

          {t.mediaUrl && isVideo && (
            <video
              controls
              playsInline
              preload="metadata"
              poster={t.coverImage}
              src={t.mediaUrl}
              className="mt-8 w-full border border-border bg-black"
              aria-label={`${t.title} video`}
            />
          )}

          {t.mediaUrl && !isVideo && (
            <audio
              controls
              preload="none"
              src={t.mediaUrl}
              className="mt-6 w-full"
              aria-label={`${t.title} audio`}
            />
          )}

          <div className="mt-8 max-w-[74ch]">
            <TransmissionBody body={t.body} />
          </div>

          {(t.ctaUrl || t.externalUrl) && (
            <a
              href={t.ctaUrl ?? t.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("Reverb Transmissions", "transmission_cta_click", `detail:${t.slug}`)
              }
              className="reverb-button mt-10 inline-flex"
            >
              {t.ctaLabel ?? "Open link →"}
            </a>
          )}
        </article>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link to="/reverb/transmissions" className="reverb-button">
            ← Archive
          </Link>
          {character && (
            <Link to={`/reverb/${character.id}`} className="reverb-button">
              {character.name}
            </Link>
          )}
          <Link to="/reverb#join" className="reverb-button">
            Join the Collective
          </Link>
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto w-full max-w-[1500px] px-5 text-center md:px-8">
          <p className="font-roc text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} Romer Garcia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReverbTransmission;
