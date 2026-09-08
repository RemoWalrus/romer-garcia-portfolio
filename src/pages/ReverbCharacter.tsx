import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { CHARACTERS, getCharacter } from "@/data/reverbCharacters";

const ReverbCharacter = () => {
  const { id } = useParams<{ id: string }>();
  const character = getCharacter(id);

  if (!character) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-reverb italic uppercase text-5xl">Unknown</h1>
        <p className="font-roc text-xs tracking-[0.2em] uppercase text-white/60">
          No such member of the Reverb collective.
        </p>
        <Link
          to="/reverb"
          className="font-roc text-[10px] tracking-[0.25em] uppercase border border-white/40 px-4 py-3 hover:bg-white hover:text-black transition-colors"
        >
          ← Back to the crew
        </Link>
      </div>
    );
  }

  const { accent, glow } = character;
  const others = CHARACTERS.filter((c) => c.id !== character.id);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Helmet>
        <title>{`${character.name} | Reverb Collective Character Sheet`}</title>
        <meta
          name="description"
          content={`${character.name} — ${character.role}. Character profile from Reverb, a multimedia franchise set in the Paradoxxia universe.`}
        />
        <meta property="og:title" content={`${character.name} | Reverb`} />
        <meta property="og:description" content={`${character.name} — ${character.role}.`} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`https://romer-garcia-portfolio.lovable.app/reverb/${character.id}`}
        />
      </Helmet>

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-sm border-b border-white/10 px-5 md:px-8 py-4 flex items-center justify-between">
        <Link to="/reverb" className="leading-none">
          <span className="block font-roc text-xl md:text-2xl font-black tracking-[0.25em] uppercase">
            Reverb
          </span>
          <span className="block font-roc text-[9px] tracking-[0.3em] uppercase text-white/55 mt-1">
            People / Ideas / Music / Change
          </span>
        </Link>
        <Link
          to="/reverb"
          className="font-roc text-[10px] tracking-[0.22em] uppercase text-white/60 hover:text-white transition-colors"
        >
          ← The Crew
        </Link>
      </header>

      {/* Sheet */}
      <main
        className="relative"
        style={{ background: `radial-gradient(120% 80% at 20% 0%, ${glow} -40%, #05050700 60%), #050507` }}
      >
        <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,0.8fr)] gap-8 lg:gap-10">
            {/* Left: identity */}
            <div className="order-1 min-w-0">
              <h1
                className="font-reverb italic uppercase leading-[0.8] text-[16vw] sm:text-[11vw] lg:text-[4.4vw] break-words"
                style={{ color: accent, textShadow: `0 0 40px ${glow}` }}
              >
                {character.name}
              </h1>

              <div className="mt-5 h-px w-16" style={{ backgroundColor: accent }} />

              <p className="mt-5 font-roc text-[11px] md:text-xs tracking-[0.22em] uppercase text-white/80 leading-relaxed">
                {(character.title ?? character.role).split("//").map((line, i) => (
                  <span key={i} className="block">
                    {i === 0 ? line.trim() : `// ${line.trim()}`}
                  </span>
                ))}
              </p>

              {character.kanji && (
                <p className="mt-4 text-3xl md:text-4xl" style={{ color: accent }}>
                  {character.kanji}
                </p>
              )}

              {character.hasProfile ? (
                <>
                  {character.tagline && (
                    <p className="mt-8 font-roc text-sm leading-relaxed text-white/75">
                      {character.tagline.map((line) => (
                        <span key={line} className="block italic">
                          {line}
                        </span>
                      ))}
                    </p>
                  )}
                  <blockquote
                    className="mt-8 font-roc text-xs md:text-sm tracking-[0.14em] uppercase leading-relaxed max-w-[22ch]"
                    style={{ color: accent }}
                  >
                    {character.quote}
                  </blockquote>
                </>
              ) : (
                <p className="mt-8 font-roc text-xs tracking-[0.18em] uppercase text-white/60 max-w-[26ch] leading-relaxed">
                  {character.caption}
                </p>
              )}

              <div className="mt-12 hidden lg:block">
                <span className="font-roc text-2xl font-black tracking-[0.22em] uppercase" style={{ color: accent }}>
                  Reverb
                </span>
                <div className="mt-4 h-px w-8" style={{ backgroundColor: accent }} />
                <p className="mt-4 font-roc text-[10px] tracking-[0.3em] uppercase text-white/50 leading-loose">
                  People<br />Arts<br />Places<br />Times<br />
                  <span className="text-white">Together</span>
                </p>
              </div>
            </div>

            {/* Center: figure */}
            <div className="order-2 relative min-w-0">
              <div
                className="relative overflow-hidden border border-white/10"
                style={{ background: `linear-gradient(180deg, #0b0b0f 0%, ${glow} 220%)` }}
              >
                <img
                  src={character.image}
                  alt={`${character.name}, ${character.role}`}
                  className="w-full h-auto min-h-[420px] object-contain"
                />
                {!character.hasProfile && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center px-6">
                    <span
                      className="font-reverb italic uppercase text-4xl md:text-5xl leading-none"
                      style={{ color: accent, textShadow: `0 0 30px ${glow}` }}
                    >
                      Coming
                      <br />
                      Soon
                    </span>
                    <span className="mt-5 font-roc text-[10px] tracking-[0.28em] uppercase text-white/60">
                      Full character sheet in production
                    </span>
                  </div>
                )}
              </div>
              {character.hasProfile && character.signOff && (
                <p className="mt-4 font-roc text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white/55">
                  {character.signOff}
                </p>
              )}
            </div>

            {/* Right: notes */}
            <div className="order-3 space-y-10">
              {character.hasProfile ? (
                <>
                  <section>
                    <h2 className="font-roc text-[11px] tracking-[0.28em] uppercase text-white/90 pb-2 border-b-2 border-white/70">
                      Notes
                    </h2>
                    <ul className="mt-4 space-y-1.5">
                      {character.notes?.map((n) => (
                        <li key={n} className="font-roc text-[11px] tracking-[0.12em] uppercase text-white/70">
                          – {n}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {character.palette && (
                    <section>
                      <h2 className="font-roc text-[11px] tracking-[0.28em] uppercase text-white/90 pb-2 border-b-2 border-white/70">
                        Color Palette
                      </h2>
                      <div className="mt-4 flex gap-2">
                        {character.palette.map((c) => (
                          <span
                            key={c}
                            className="h-9 w-9 rounded-sm border border-white/15"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {character.gear && (
                    <section>
                      <h2 className="font-roc text-[11px] tracking-[0.28em] uppercase text-white/90 pb-2 border-b-2 border-white/70">
                        Gear / Accessories
                      </h2>
                      <ul className="mt-4 space-y-1.5">
                        {character.gear.map((g) => (
                          <li key={g} className="font-roc text-[11px] tracking-[0.12em] uppercase text-white/70">
                            – {g}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {character.closingQuote && (
                    <p className="font-roc text-sm italic leading-relaxed" style={{ color: accent }}>
                      {character.closingQuote}
                      <span className="block mt-2 text-white/60 not-italic text-[11px] tracking-[0.2em] uppercase">
                        — {character.name}
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <section>
                  <h2 className="font-roc text-[11px] tracking-[0.28em] uppercase text-white/90 pb-2 border-b-2 border-white/70">
                    Notes
                  </h2>
                  <p className="mt-4 font-roc text-[11px] tracking-[0.14em] uppercase text-white/60 leading-relaxed">
                    Expressions, turnaround, palette and gear for {character.name} are still being
                    developed. Check back soon.
                  </p>
                </section>
              )}
            </div>
          </div>

          {/* Crew nav */}
          <nav className="mt-16 border-t border-white/10 pt-8">
            <h2 className="font-roc text-[10px] tracking-[0.3em] uppercase text-white/50">
              The Collective
            </h2>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              {others.map((c) => (
                <Link
                  key={c.id}
                  to={`/reverb/${c.id}`}
                  className="group relative overflow-hidden border border-white/10 h-32 md:h-40"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <span
                    className="absolute bottom-2 left-3 font-reverb italic uppercase text-lg md:text-xl"
                    style={{ color: c.accent }}
                  >
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center">
        <p className="font-roc text-[10px] tracking-[0.25em] uppercase text-white/40">
          © {new Date().getFullYear()} Romer Garcia — Reverb / Paradoxxia
        </p>
      </footer>
    </div>
  );
};

export default ReverbCharacter;
