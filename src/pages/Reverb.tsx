import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import reverbImg from "@/assets/reverb-char-reverb.png.asset.json";
import sparkImg from "@/assets/reverb-char-spark.png.asset.json";
import harmonixImg from "@/assets/reverb-char-harmonix.png.asset.json";
import eduqImg from "@/assets/reverb-char-eduq.png.asset.json";
import widaImg from "@/assets/reverb-char-wida.png.asset.json";

interface Character {
  id: string;
  name: string;
  role: string;
  quote: string;
  caption: string;
  image: string;
  accent: string;
  glow: string;
}

const CHARACTERS: Character[] = [
  {
    id: "reverb",
    name: "Reverb",
    role: "Music Producer // Visionary",
    quote: "\u201cFeel it. Create it. Move it.\u201d",
    caption: "From the streets to a brighter tomorrow.",
    image: reverbImg.url,
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.55)",
  },
  {
    id: "spark",
    name: "Spark",
    role: "Idea Generator // Creative Lead",
    quote: "\u201cBig ideas start with a spark.\u201d",
    caption: "People change worlds. Sometimes by just being them.",
    image: sparkImg.url,
    accent: "#ff2e88",
    glow: "rgba(255,46,136,0.55)",
  },
  {
    id: "harmonix",
    name: "Harmonix",
    role: "Community Builder // Connector",
    quote: "\u201cDifferent voices. Stronger together.\u201d",
    caption: "Systems link people. People make them matter.",
    image: harmonixImg.url,
    accent: "#2f8cff",
    glow: "rgba(47,140,255,0.55)",
  },
  {
    id: "eduq",
    name: "Eduq",
    role: "Infiltration Specialist // Tech",
    quote: "\u201cInformation is freedom. Control is survival.\u201d",
    caption: "Tradition meets tomorrow. Same places. Different times.",
    image: eduqImg.url,
    accent: "#b6f13b",
    glow: "rgba(182,241,59,0.55)",
  },
  {
    id: "wida",
    name: "Wida",
    role: "Time Traveler // Impact Lead",
    quote: "\u201cA kinder, brighter world is possible.\u201d",
    caption: "Same frequency. Louder together.",
    image: widaImg.url,
    accent: "#2fe6d6",
    glow: "rgba(47,230,214,0.55)",
  },
];

const NAV = ["Home", "The Crew", "Universe", "Music", "Projects", "Media", "Store"];

const Reverb = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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

      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 z-30 px-5 md:px-8 py-4 flex items-center justify-between">
        <Link to="/reverb" className="leading-none">
          <span className="block font-roc text-2xl md:text-3xl font-black tracking-[0.25em] uppercase">
            Reverb
          </span>
          <span className="block font-roc text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/60 mt-1">
            People / Ideas / Music / Change
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item, i) => (
            <span
              key={item}
              className={`font-roc text-[11px] tracking-[0.22em] uppercase cursor-default transition-colors ${
                i === 0 ? "text-white border-b border-[#ff2e88] pb-1" : "text-white/60 hover:text-white"
              }`}
            >
              {item}
            </span>
          ))}
        </nav>

        <Link
          to="/paradoxxia"
          className="font-roc text-[10px] tracking-[0.22em] uppercase text-white/60 hover:text-white transition-colors"
        >
          Paradoxxia →
        </Link>
      </header>

      {/* Hero: diagonal character panels */}
      <section className="relative h-[92vh] min-h-[560px] w-full pt-20">
        <h1 className="sr-only">Reverb — a multimedia franchise in the Paradoxxia universe</h1>

        <div className="flex h-full w-full gap-1.5 md:gap-3 px-2 md:px-4 overflow-hidden">
          {CHARACTERS.map((c, i) => {
            const isActive = active === c.id;
            const dimmed = active !== null && !isActive;
            return (
              <button
                key={c.id}
                type="button"
                onMouseEnter={() => setActive(c.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(c.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(isActive ? null : c.id)}
                aria-label={`${c.name} — ${c.role}`}
                className="group relative flex-1 h-full overflow-hidden text-left focus:outline-none transition-[flex-grow] duration-500 ease-out"
                style={{
                  flexGrow: isActive ? 1.45 : 1,
                  clipPath:
                    i === 0
                      ? "polygon(0 0, 100% 0, 86% 100%, 0% 100%)"
                      : i === CHARACTERS.length - 1
                      ? "polygon(14% 0, 100% 0, 100% 100%, 0% 100%)"
                      : "polygon(14% 0, 100% 0, 86% 100%, 0% 100%)",
                  filter: "drop-shadow(0 0 14px rgba(0,0,0,0.9))",
                }}
              >
                {/* Image */}
                <img
                  src={c.image}
                  alt={`${c.name}, ${c.role}`}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                    isActive
                      ? "grayscale-0 scale-[1.04]"
                      : "grayscale contrast-[1.1] brightness-[0.75]"
                  } ${dimmed ? "opacity-60" : "opacity-100"}`}
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

                {/* Copy */}
                <div className="absolute bottom-0 left-0 right-0 pb-5 pt-4 pr-6 pl-[8%] xl:pl-[9%]">
                  <span
                    className="block whitespace-nowrap font-reverb italic uppercase leading-[0.85] text-[8vw] sm:text-[5vw] lg:text-[2.3vw] transition-all duration-500"
                    style={{
                      color: isActive ? c.accent : "#ffffff",
                      textShadow: isActive ? `0 0 26px ${c.glow}` : "0 2px 12px rgba(0,0,0,0.6)",
                    }}
                  >
                    {c.name}
                  </span>
                  <span className="hidden md:block font-roc text-[9px] xl:text-[10px] tracking-[0.16em] uppercase text-white/75 mt-2">
                    {c.role}
                  </span>
                  <span
                    className="hidden lg:block font-roc text-[10px] xl:text-xs leading-snug uppercase mt-3 max-w-[16ch]"
                    style={{ color: isActive ? c.accent : "rgba(255,255,255,0.65)" }}
                  >
                    {c.quote}
                  </span>
                  <span
                    className="hidden xl:inline-block mt-4 font-roc text-[10px] tracking-[0.2em] uppercase border px-3 py-2 transition-colors"
                    style={{
                      borderColor: isActive ? c.accent : "rgba(255,255,255,0.35)",
                      color: isActive ? c.accent : "rgba(255,255,255,0.8)",
                    }}
                  >
                    View Profile
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="hidden xl:block absolute right-4 top-1/3 text-right font-roc text-[10px] tracking-[0.3em] uppercase text-white/50 leading-loose z-20">
          People<br />Music<br />Places<br />Ideas<br />
          <span className="text-white">Together</span>
        </div>
      </section>

      {/* Captions strip */}
      <section className="border-t border-white/10 bg-black">
        <div className="grid grid-cols-2 md:grid-cols-5">
          {CHARACTERS.map((c) => (
            <p
              key={c.id}
              className="font-roc text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-white/55 leading-relaxed p-4 border-r border-b border-white/10"
            >
              {c.caption}
            </p>
          ))}
        </div>
      </section>

      {/* Universe blurb */}
      <section className="max-w-4xl mx-auto px-5 py-20 md:py-28 text-center">
        <h2 className="font-reverb italic uppercase text-4xl md:text-6xl mb-6">The Universe</h2>
        <p className="font-roc text-sm md:text-base leading-relaxed text-white/70">
          Long before an android woke up alone in the Cyber Boondocks, five outsiders were already
          fighting the silence. Reverb is the prequel chapter of the Paradoxxia universe — a story
          about people, ideas, music and change, told through sound, image and motion.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/paradoxxia"
            className="font-roc text-[11px] tracking-[0.22em] uppercase border border-white/40 px-6 py-3 hover:border-[#2fe6d6] hover:text-[#2fe6d6] transition-colors"
          >
            Enter Paradoxxia
          </Link>
          <Link
            to="/story"
            className="font-roc text-[11px] tracking-[0.22em] uppercase border border-white/40 px-6 py-3 hover:border-[#ff2e88] hover:text-[#ff2e88] transition-colors"
          >
            Play the Story
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center font-roc text-[10px] tracking-[0.2em] uppercase text-white/40">
        © {new Date().getFullYear()} Romer Garcia — Different people. A brighter tomorrow.
      </footer>
    </div>
  );
};

export default Reverb;
