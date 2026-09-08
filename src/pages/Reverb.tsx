import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CHARACTERS } from "@/data/reverbCharacters";
import { useIsMobile } from "@/hooks/use-mobile";
import ReverbHeader from "@/components/reverb/ReverbHeader";

const Reverb = () => {
  const [active, setActive] = useState<string | null>(null);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors">
      <Helmet>
        <title>Reverb | Paradoxxia Universe Multimedia Franchise</title>
        <meta
          name="description"
          content="Reverb is a multimedia franchise set in the Paradoxxia universe — a prequel following five outsiders who turn sound into resistance."
        />
        <meta property="og:title" content="Reverb | Paradoxxia Universe" />
        <meta
          property="og:description"
          content="People / Ideas / Music / Change. Meet the crew of Reverb, a prequel chapter of the Paradoxxia universe."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://romer-garcia-portfolio.lovable.app/reverb" />
      </Helmet>

      <ReverbHeader />

      {/* Hero: diagonal character panels (columns on desktop, rows on mobile) */}
      <section className="relative h-[100svh] min-h-[560px] w-full pt-16 md:pt-20">
        <h1 className="sr-only">Reverb — a multimedia franchise in the Paradoxxia universe</h1>

        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
          {CHARACTERS.map((c, i) => {
            const isActive = active === c.id;
            const dimmed = active !== null && !isActive;
            const mobileCollapsed = isMobile && active !== null && !isActive;
            const grow = isMobile
              ? isActive
                ? 9
                : active !== null
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
                  zIndex: isActive ? CHARACTERS.length + 1 : CHARACTERS.length - i,
                  clipPath: isMobile
                    ? undefined
                    : i === 0
                    ? "polygon(0 0, 100% 0, 92% 100%, 0% 100%)"
                    : i === CHARACTERS.length - 1
                    ? "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)"
                    : "polygon(8% 0, 100% 0, 92% 100%, 0% 100%)",
                }}
              >
                {/* Image */}
                <img
                  src={c.image}
                  alt={`${c.name}, ${c.role}`}
                  loading="lazy"
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
                      className={`${isActive ? "inline-block" : "invisible xl:inline-block"} mt-4 font-roc text-[10px] tracking-[0.2em] uppercase border px-3 py-2 transition-colors`}
                      style={{
                        borderColor: isActive ? c.accent : "rgba(255,255,255,0.35)",
                        color: isActive ? c.accent : "rgba(255,255,255,0.8)",
                      }}
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
          {CHARACTERS.map((c) => (
            <p
              key={c.id}
              className="font-roc text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-muted-foreground leading-relaxed p-4 border-r border-b border-border"
            >
              {c.caption}
            </p>
          ))}
        </div>
      </section>

      {/* Universe blurb */}
      <section className="max-w-4xl mx-auto px-5 py-20 md:py-28 text-center">
        <h2 className="font-reverb italic uppercase text-4xl md:text-6xl mb-6">The Universe</h2>
        <p className="font-roc text-sm md:text-base leading-relaxed text-muted-foreground">
          Long before an android woke up alone in the Cyber Boondocks, five outsiders were already
          fighting the silence. Reverb is the prequel chapter of the Paradoxxia universe — a story
          about people, ideas, music and change, told through sound, image and motion.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/paradoxxia"
            className="font-roc text-[11px] tracking-[0.22em] uppercase border border-border px-6 py-3 hover:border-reverb-cyan hover:text-reverb-cyan transition-colors"
          >
            Enter Paradoxxia
          </Link>
          <Link
            to="/story"
            className="font-roc text-[11px] tracking-[0.22em] uppercase border border-border px-6 py-3 hover:border-foreground hover:text-foreground transition-colors"
          >
            Play the Story
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center font-roc text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
        © {new Date().getFullYear()} Romer Garcia — Different people. A brighter tomorrow.
      </footer>
    </div>
  );
};

export default Reverb;
