import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useReverbCharacters } from "@/hooks/use-reverb-characters";
import { useReverbMeta } from "@/hooks/use-reverb-meta";
import { usePageMetaFromData } from "@/hooks/use-page-meta";
import { useIsMobile } from "@/hooks/use-mobile";
import ReverbHeader from "@/components/reverb/ReverbHeader";
import { rosterSchema } from "@/lib/reverbSchema";
import { JoinCollectiveSection } from "@/components/reverb/JoinCollective";


const FALLBACK_TITLE = "Reverb | Paradoxxia Universe Multimedia Franchise";
const FALLBACK_DESC =
  "Reverb is a multimedia franchise set in the Paradoxxia universe — a prequel following five outsiders who turn sound into resistance.";
const FALLBACK_SOCIAL_DESC =
  "People / Ideas / Music / Change. Meet the crew of Reverb, a prequel chapter of the Paradoxxia universe.";

const Reverb = () => {
  const [active, setActive] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const allCharacters = useReverbCharacters();
  const characters = allCharacters.filter((c) => !c.hidden);
  const [autoActive, setAutoActive] = useState<string | null>(null);
  const ids = characters.map((c) => c.id).join(",");
  const idsRef = useRef<string[]>([]);
  idsRef.current = characters.map((c) => c.id);

  // Idle showcase: after 7s without user input, cycle the highlight
  // through each character. Any interaction stops it and restarts the timer.
  useEffect(() => {
    let idle: ReturnType<typeof setTimeout>;
    let cycle: ReturnType<typeof setInterval>;
    let index = 0;

    const stopCycle = () => {
      clearInterval(cycle);
      setAutoActive(null);
    };

    const startCycle = () => {
      const list = idsRef.current;
      if (!list.length) return;
      index = 0;
      setAutoActive(list[0]);
      cycle = setInterval(() => {
        index = (index + 1) % list.length;
        setAutoActive(list[index]);
      }, 3500);
    };

    const reset = () => {
      stopCycle();
      clearTimeout(idle);
      idle = setTimeout(startCycle, 7000);
    };

    const events = [
      "pointerdown",
      "pointermove",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ];
    events.forEach((e) =>
      window.addEventListener(e, reset, { passive: true } as AddEventListenerOptions)
    );
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(idle);
      clearInterval(cycle);
    };
  }, [ids]);

  const highlight = active ?? autoActive;

  const metadata = useReverbMeta();
  const meta = usePageMetaFromData("reverb", metadata, {
    title: FALLBACK_TITLE,
    description: FALLBACK_DESC,
    keywords:
      "Reverb, Reverb Collective, Paradoxxia universe, multimedia franchise, prequel, Romer Garcia",
    ogTitle: "Reverb | Paradoxxia Universe",
    ogDescription: FALLBACK_SOCIAL_DESC,
    ogUrl: "https://romer-garcia-portfolio.lovable.app/reverb",
    twitterTitle: "Reverb | Paradoxxia Universe",
    twitterDescription: FALLBACK_SOCIAL_DESC,
  });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:type" content="website" />
        {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
        {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        {meta.twitterImage && <meta name="twitter:image" content={meta.twitterImage} />}
        <link rel="canonical" href="https://romer-garcia-portfolio.lovable.app/reverb" />
        {characters.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(rosterSchema(characters))}
          </script>
        )}
      </Helmet>


      <ReverbHeader />

      {/* Hero: diagonal character panels (columns on desktop, rows on mobile) */}
      <section className="dark relative h-[100svh] min-h-[560px] w-full pt-16 md:pt-20 bg-black text-white">
        <h1 className="sr-only">Reverb — a multimedia franchise in the Paradoxxia universe</h1>

        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
          {characters.map((c, i) => {
            const isActive = highlight === c.id;
            const dimmed = highlight !== null && !isActive;
            const mobileCollapsed = isMobile && highlight !== null && highlight !== c.id;
            const grow = isMobile
              ? isActive
                ? 9
                : highlight !== null
                ? 0.28
                : 1
              : isActive
              ? 3
              : 1;

            const handleClick = (e: React.MouseEvent) => {
              if (!isMobile) return;
              if (!isActive) {
                e.preventDefault();
                setActive(c.id);
              }
            };

            return (
              <Link
                key={c.id}
                to={`/reverb/${c.id}`}
                onClick={handleClick}
                onMouseEnter={() => !isMobile && setActive(c.id)}
                onMouseLeave={() => !isMobile && setActive(null)}
                onFocus={() => !isMobile && setActive(c.id)}
                onBlur={() => !isMobile && setActive(null)}
                aria-label={`${c.name} — ${c.role}`}
                className="group relative h-full w-full overflow-hidden text-left focus:outline-none transition-[flex-grow] duration-500 ease-out"
                style={{
                  flexGrow: grow,
                  flexBasis: 0,
                  minHeight: mobileCollapsed ? 44 : undefined,
                  marginLeft: !isMobile && i > 0 ? "-5vw" : undefined,
                  zIndex: isActive ? characters.length + 1 : characters.length - i,
                  clipPath: isMobile
                    ? undefined
                    : i === 0
                    ? "polygon(0 0, 100% 0, 92% 100%, 0% 100%)"
                    : i === characters.length - 1
                    ? "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)"
                    : "polygon(8% 0, 100% 0, 92% 100%, 0% 100%)",
                }}
              >
                {/* Image */}
                <img
                  src={c.image}
                  alt={`${c.name}, ${c.role}`}
                  loading="eager"
                  {...{ fetchpriority: i === 0 ? "high" : "auto" }}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                    isActive
                      ? "grayscale-0 scale-[1.14]"
                      : "grayscale contrast-[1.1] brightness-[0.75]"
                  } ${dimmed ? "brightness-[0.48]" : "brightness-100"}`}
                />

                {/* Accent + readability gradients */}
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    opacity: isActive ? 0.32 : 0,
                    background: `linear-gradient(180deg, transparent 25%, ${c.accent} 140%)`,
                    mixBlendMode: "color",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                {mobileCollapsed ? (
                  /* Collapsed mobile row — name only */
                  <div className="absolute inset-0 flex items-center bg-black/55 px-5">
                    <span className="font-reverb italic uppercase text-[15px] leading-none text-white/85">
                      {c.name}
                    </span>
                  </div>
                ) : (
                  /* Copy — fixed-width block so text never jumps when the panel grows */
                  <div className="absolute bottom-0 left-0 pb-5 pt-4 pr-4 pl-[7%] md:pl-[10%] xl:pl-[11%] w-max">
                    <span
                      className="block whitespace-nowrap font-reverb italic uppercase leading-[0.85] text-[26px] sm:text-[30px] lg:text-[clamp(28px,2.1vw,44px)] transition-all duration-500"
                      style={{
                        color: isActive ? c.accent : "#ffffff",
                        textShadow: isActive ? `0 0 26px ${c.glow}` : "0 2px 12px rgba(0,0,0,0.6)",
                      }}
                    >
                      {c.name}
                    </span>
                    <span className="block h-8 max-w-[20ch] overflow-hidden font-roc text-[10px] xl:text-[11px] leading-4 tracking-[0.16em] uppercase text-white/75 mt-2">
                      {c.role}
                    </span>
                    <span
                      className={`${isActive ? "inline-block" : "invisible xl:inline-block"} reverb-button reverb-character-button mt-4`}
                      style={{ "--character-accent": c.accent } as React.CSSProperties}
                    >
                      View Profile
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden xl:block absolute right-4 top-1/3 text-right font-roc text-[10px] tracking-[0.3em] uppercase text-white/50 leading-loose z-20">
          People<br />Music<br />Places<br />Ideas<br />
          <span className="text-white">Together</span>
        </div>
      </section>

      {/* Captions strip */}
      <section className="border-t border-border bg-background transition-colors">
        <div className="grid grid-cols-2 md:grid-cols-5">
          {characters.map((c) => (
            <p
              key={c.id}
              className="font-roc text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-muted-foreground leading-relaxed p-4 border-r border-b border-border"
            >
              {c.caption}
            </p>
          ))}
        </div>
      </section>

      {/* Crawlable roster summary — text version of the visual panels above */}
      <section className="sr-only">
        <h2>The Reverb Collective</h2>
        <ul>
          {characters.map((c) => (
            <li key={c.id}>
              <Link to={`/reverb/${c.id}`}>
                {c.name} — {c.discipline ?? c.role}
              </Link>
              {c.identity?.length ? (
                <span>
                  {" "}
                  {c.identity.map((row) => `${row.label}: ${row.value}`).join(". ")}.
                </span>
              ) : null}
              {c.overview?.length ? <p>{c.overview[0]}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      {/* Universe blurb */}
      <section className="max-w-4xl mx-auto px-5 py-20 md:py-28 text-center">
        <h2 className="font-roc font-extrabold italic uppercase text-reverb-wordmark text-4xl md:text-6xl mb-6">The Universe</h2>
        <p className="font-roc text-sm md:text-base leading-relaxed text-muted-foreground">
          Long before an android woke up alone in the Cyber Boondocks, five outsiders were already
          fighting the silence. Reverb is the prequel chapter of the Paradoxxia universe — a story
          about people, ideas, music and change, told through sound, image and motion.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/paradoxxia"
            className="reverb-button"
          >
            Enter Paradoxxia
          </Link>
          <Link
            to="/story"
            className="reverb-button"
          >
            Play the Story
          </Link>
        </div>
      </section>

      <JoinCollectiveSection />

      <footer className="border-t border-border py-8 font-roc text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        <div className="mx-auto w-full max-w-[1500px] px-5 text-center md:px-8">
          <span>© {new Date().getFullYear()} Romer Garcia. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
};

export default Reverb;
