import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { CHARACTERS, getCharacter } from "@/data/reverbCharacters";
import ReverbHeader, { ReverbWordmark } from "@/components/reverb/ReverbHeader";

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
    <div className="min-h-screen lg:h-[100dvh] lg:overflow-hidden flex flex-col bg-background text-foreground overflow-x-hidden transition-colors">
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
      <main className="relative flex flex-col flex-1 min-h-0 bg-background transition-colors">
        <div className="mx-auto flex flex-col flex-1 min-h-0 w-full max-w-[1500px]">
          {/* Character sheet */}
          <div
            className="relative flex-1 min-h-0 overflow-visible"
            style={{
              background: `linear-gradient(115deg, #07070a 0%, #0b0b12 34%, ${glow} 120%)`,
            }}
          >
            <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,0.64fr)_minmax(0,1.5fr)] h-full lg:min-h-[520px]">
              {/* LEFT: identity + figure */}
              <div className="relative z-40 h-[70svh] min-h-[340px] overflow-visible px-5 pt-7 pb-0 md:px-8 lg:h-full lg:min-h-0 lg:pt-8">

                <h1
                  className="relative z-30 max-w-[42%] font-reverb italic uppercase leading-[0.82] text-[9vw] sm:text-[7vw] lg:max-w-none lg:text-[3.6vw] tracking-[-0.02em]"
                  style={{ color: accent, textShadow: `0 0 45px ${glow}` }}
                >
                  {character.name}
                </h1>


                <div className="relative z-50 mt-4 h-[3px] w-12" style={{ backgroundColor: accent }} />

                <p className="relative z-50 mt-4 max-w-[15ch] font-roc text-[9px] md:text-[11px] tracking-[0.18em] md:tracking-[0.28em] uppercase text-white/85 leading-[1.8]">
                  <ReverbWordmark className="text-[inherit] text-white/85" />
                  <br />
                  Collective
                  <br />
                  {`// ${(character.title ?? character.role).split("//").pop()?.trim()}`}
                </p>

                {character.tagline && (
                  <p className="relative z-50 mt-5 max-w-[8ch] font-hand text-xl md:text-3xl leading-[1.1] text-white/90">
                    {character.tagline.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                )}

                {/* Reverb mark + word list */}
                <div className="mt-6 relative z-50 max-w-[42%] lg:mt-8 lg:max-w-none">
                  <ReverbWordmark className="text-xl md:text-2xl" />
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

                {/* Figure — tall, shifted right so it overlaps the data sheet */}
                <div className="absolute -right-[4%] top-0 z-40 flex h-[105%] w-[82%] items-start justify-end pointer-events-none lg:right-[-58%] lg:top-[-2.5%] lg:bottom-auto lg:h-[105.5%] lg:w-[110%] lg:items-start">
                  <img
                    src={character.figure ?? character.image}
                    alt={`${character.name}, ${character.role}`}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-auto max-w-none object-contain object-right lg:object-right-top drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>

              {/* RIGHT: light data panels */}
              <div
                className="relative z-10 h-full overflow-hidden bg-[#ececef] p-5 text-[#111] [clip-path:none] md:p-6 lg:overflow-y-auto lg:pl-[24%] lg:pr-7 lg:py-6 lg:[clip-path:polygon(11%_0%,100%_0%,100%_100%,0%_100%)]"
              >

                {character.hasProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <section className="md:col-span-2">
                      <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-1.5 border-b-2 border-black/80">
                        Identity
                      </h2>
                      <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {(character.identity ?? []).map((row) => (
                          <div key={row.label} className="flex gap-2 items-baseline">
                            <dt className="font-roc text-[9px] md:text-[10px] tracking-[0.22em] uppercase text-black/45 shrink-0">
                              {row.label}
                            </dt>
                            <dd className="font-roc text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-black/80">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-4 font-roc text-[11px] md:text-xs tracking-[0.2em] uppercase text-black/70">
                        {character.discipline ?? character.role}
                      </p>
                      <p className="mt-2 font-hand text-2xl" style={{ color: accent }}>
                        {character.quote}
                      </p>
                    </section>

                    <section>
                      <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-2 border-b-2 border-black/80">
                        Character
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
                      <div>
                        <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-2 border-b-2 border-black/80">
                          Signature
                        </h2>
                        {character.colorName && (
                          <div className="mt-3 flex items-center gap-3">
                            <span
                              className="h-6 w-6 rounded-full border border-black/10 shadow-inner"
                              style={{ backgroundColor: accent }}
                            />
                            <span className="font-roc text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-black/75">
                              Color — {character.colorName}
                            </span>
                          </div>
                        )}
                        {character.specialties && (
                          <p className="mt-4 font-roc text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-black/75 leading-[1.9]">
                            <span className="text-black/45">Specialties — </span>
                            {character.specialties.join(" / ")}
                          </p>
                        )}
                      </div>

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

                    {character.overview && (
                      <section className="md:col-span-2">
                        <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-2 border-b-2 border-black/80">
                          Overview
                        </h2>
                        <div className="mt-3 space-y-3">
                          {character.overview.map((p) => (
                            <p
                              key={p.slice(0, 24)}
                              className="font-roc text-[11px] md:text-xs leading-[1.9] text-black/75"
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="md:col-span-2 border-t border-black/15 pt-5 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        {character.signOff && (
                          <p className="font-roc text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-black/70 leading-[1.9]">
                            {character.signOff}
                          </p>
                        )}
                        <ReverbWordmark className="mt-3 text-lg text-[#111]" />
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
          <nav className="border-t border-border py-2 shrink-0">
            <h2 className="font-roc text-[9px] tracking-[0.3em] uppercase text-muted-foreground px-3 md:px-6">
              The Collective
            </h2>
            <div className="mt-1.5 grid grid-cols-2 md:grid-cols-4 gap-1 px-3 md:px-6">
              {others.map((c) => (
                <Link
                  key={c.id}
                  to={`/reverb/${c.id}`}
                  className="group relative overflow-hidden border border-border h-12 md:h-14"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <span
                    className="absolute bottom-1 left-2 font-reverb italic uppercase text-sm md:text-base"
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


      <footer className="border-t border-border py-2 shrink-0">
        <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8 text-center">
          <p className="font-roc text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            © {new Date().getFullYear()} Romer Garcia — Reverb / Paradoxxia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReverbCharacter;
