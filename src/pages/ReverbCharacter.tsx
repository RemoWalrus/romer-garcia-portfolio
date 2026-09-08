import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { CHARACTERS, getCharacter } from "@/data/reverbCharacters";
import ReverbHeader from "@/components/reverb/ReverbHeader";

const ReverbCharacter = () => {
  const { id } = useParams<{ id: string }>();
  const character = getCharacter(id);

  if (!character) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-reverb italic uppercase text-5xl">Unknown</h1>
        <p className="font-roc text-xs tracking-[0.2em] uppercase text-muted-foreground">
          No such member of the Reverb collective.
        </p>
        <Link
          to="/reverb"
          className="font-roc text-[10px] tracking-[0.25em] uppercase border border-border px-4 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          ← Back to the crew
        </Link>
      </div>
    );
  }

  const { accent, glow } = character;
  const others = CHARACTERS.filter((c) => c.id !== character.id);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors">
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

      <ReverbHeader sticky />

      {/* Sheet */}
      <main className="relative bg-background transition-colors">
        <div className="mx-auto max-w-[1500px]">
          {/* Character sheet */}
          <div
            className="relative overflow-hidden border-x border-b border-white/10"
            style={{
              background: `linear-gradient(115deg, #07070a 0%, #0b0b12 34%, ${glow} 120%)`,
            }}
          >
            <div
              className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:h-[calc(100dvh-64px-150px)] lg:min-h-[560px]"
            >
              {/* LEFT: identity + figure */}
              <div className="relative px-5 md:px-8 pt-8 pb-0 h-full">

                <h1
                  className="font-reverb italic uppercase leading-[0.78] text-[19vw] sm:text-[13vw] lg:text-[6.6vw] tracking-[-0.02em]"
                  style={{ color: accent, textShadow: `0 0 45px ${glow}` }}
                >
                  {character.name}
                </h1>

                <div className="mt-4 h-[3px] w-12" style={{ backgroundColor: accent }} />

                <p className="mt-4 font-roc text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-white/85 leading-[1.9]">
                  Reverb
                  <br />
                  Collective
                  <br />
                  {`// ${(character.title ?? character.role).split("//").pop()?.trim()}`}
                </p>

                {character.tagline && (
                  <p className="mt-6 font-hand text-2xl md:text-3xl leading-[1.15] text-white/90">
                    {character.tagline.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                )}

                {/* Reverb mark + word list */}
                <div className="mt-8 relative z-10">
                  <span
                    className="font-roc text-xl md:text-2xl font-black tracking-[0.28em] uppercase"
                    style={{ color: accent }}
                  >
                    Reverb
                  </span>
                  <div className="mt-3 h-px w-8" style={{ backgroundColor: accent }} />
                  <p className="mt-3 font-roc text-[10px] tracking-[0.34em] uppercase text-white/55 leading-[2]">
                    Arts
                    <br />
                    People
                    <br />
                    Places
                    <br />
                    Times
                    <br />
                    <span className="text-white">Together</span>
                  </p>
                </div>

                {/* Figure — as tall as the section */}
                <div className="relative mt-6 h-[60vh] lg:mt-0 lg:absolute lg:right-[-24%] lg:bottom-0 lg:top-0 lg:h-full lg:w-[80%] flex items-end justify-center pointer-events-none z-[5]">
                  <img
                    src={character.figure ?? character.image}
                    alt={`${character.name}, ${character.role}`}
                    className="w-full h-full object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>

              {/* RIGHT: light data panels */}
              <div
                className="relative bg-[#ececef] text-[#111] p-4 md:p-6 lg:pl-16 lg:pr-8 lg:py-7 h-full overflow-hidden lg:overflow-y-auto"
                style={{ clipPath: "polygon(9% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
              >

                {character.hasProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                    <section className="md:col-span-2">
                      <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-2 border-b-2 border-black/80">
                        Identity
                      </h2>
                      <p className="mt-3 font-roc text-[11px] md:text-xs tracking-[0.16em] uppercase leading-[2] text-black/70">
                        {character.role}
                      </p>
                      <p className="mt-2 font-hand text-2xl" style={{ color: accent }}>
                        {character.quote}
                      </p>
                    </section>

                    <section>
                      <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-2 border-b-2 border-black/80">
                        Notes
                      </h2>
                      <ul className="mt-3 space-y-1.5">
                        {character.notes?.map((n) => (
                          <li
                            key={n}
                            className="font-roc text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-black/75"
                          >
                            – {n}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="space-y-6">
                      {character.palette && (
                        <div>
                          <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-2 border-b-2 border-black/80">
                            Color Palette
                          </h2>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {character.palette.map((c) => (
                              <span
                                key={c}
                                className="h-8 w-8 rounded-full border border-black/10 shadow-inner"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {character.gear && (
                        <div>
                          <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-2 border-b-2 border-black/80">
                            Gear / Accessories
                          </h2>
                          <ul className="mt-3 space-y-1.5">
                            {character.gear.map((g) => (
                              <li
                                key={g}
                                className="font-roc text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-black/75"
                              >
                                – {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </section>

                    <section className="md:col-span-2 border-t border-black/15 pt-5 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        {character.signOff && (
                          <p className="font-roc text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-black/70 leading-[1.9]">
                            {character.signOff}
                          </p>
                        )}
                        <span
                          className="mt-3 block font-roc text-lg font-black tracking-[0.3em] uppercase"
                          style={{ color: "#111" }}
                        >
                          Reverb
                        </span>
                      </div>
                      {character.closingQuote && (
                        <p className="font-hand text-2xl leading-tight text-black/80 max-w-[24ch] text-right">
                          {character.closingQuote}
                          <span className="block mt-1 text-lg text-black/55">— {character.name}</span>
                        </p>
                      )}
                    </section>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <span
                      className="font-reverb italic uppercase text-5xl md:text-6xl leading-none"
                      style={{ color: accent }}
                    >
                      Coming
                      <br />
                      Soon
                    </span>
                    <span className="mt-5 font-roc text-[10px] tracking-[0.28em] uppercase text-black/55">
                      Full character sheet in production
                    </span>
                    <p className="mt-6 font-hand text-2xl text-black/70 max-w-[24ch]">
                      {character.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Crew nav */}
          <nav className="border-t border-border py-3">
            <h2 className="font-roc text-[10px] tracking-[0.3em] uppercase text-muted-foreground px-3 md:px-6">
              The Collective
            </h2>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-1 px-3 md:px-6">
              {others.map((c) => (
                <Link
                  key={c.id}
                  to={`/reverb/${c.id}`}
                  className="group relative overflow-hidden border border-border h-20 md:h-24"
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


      <footer className="border-t border-border py-4 text-center">
        <p className="font-roc text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          © {new Date().getFullYear()} Romer Garcia — Reverb / Paradoxxia
        </p>
      </footer>
    </div>
  );
};

export default ReverbCharacter;
