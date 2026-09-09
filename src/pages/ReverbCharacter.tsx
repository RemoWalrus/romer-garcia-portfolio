import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { trackEvent } from "@/components/GoogleAnalytics";
import { Link, useParams } from "react-router-dom";
import { reverbThumb } from "@/data/reverbCharacters";
import { useReverbCharacters } from "@/hooks/use-reverb-characters";
import { useReverbMeta } from "@/hooks/use-reverb-meta";
import { usePageMetaFromData } from "@/hooks/use-page-meta";
import ReverbHeader, { ReverbWordmark } from "@/components/reverb/ReverbHeader";
import { useReverbUnlocked } from "@/lib/reverbLock";

const ReverbCharacter = () => {
  const { id } = useParams<{ id: string }>();
  const unlocked = useReverbUnlocked();
  const characters = useReverbCharacters();
  const metadata = useReverbMeta();
  const character = characters.find((c) => c.id === id?.toLowerCase());

  const name = character?.name ?? "Reverb";
  const role = character?.role ?? "";
  const meta = usePageMetaFromData(`reverb.${id?.toLowerCase() ?? ""}`, metadata, {
    title: `${name} | Reverb Collective Character Sheet`,
    description: `${name} — ${role}. Character profile from Reverb, a multimedia franchise set in the Paradoxxia universe.`,
    keywords: `${name}, Reverb Collective, Paradoxxia universe, character profile`,
    ogTitle: `${name} | Reverb`,
    ogDescription: `${name} — ${role}.`,
    ogUrl: `https://romer-garcia-portfolio.lovable.app/reverb/${id?.toLowerCase() ?? ""}`,
    twitterTitle: `${name} | Reverb`,
    twitterDescription: `${name} — ${role}.`,
  });

  const isLocked = Boolean(character?.locked) && !unlocked;
  useEffect(() => {
    if (!character) return;
    trackEvent("Reverb", "View Character", `${character.id}${isLocked ? " (locked)" : ""}`);
  }, [character?.id, isLocked]);






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
  const excludeIds = new Set([character.id, character.baseId].filter(Boolean));
  const others = characters.filter((c) => !excludeIds.has(c.id) && !c.hidden);

  /**
   * Lock state lives in Supabase (`reverb_characters.is_locked`).
   * The preview-only toggle can reveal a locked entry locally without editing the row.
   */
  const locked = !!character.locked && !unlocked;

  const Redact = ({ children }: { children: React.ReactNode }) =>
    locked ? (
      <span
        aria-hidden="true"
        className="select-none bg-black/85 text-transparent decoration-clone box-decoration-clone rounded-[1px] px-1"
      >
        {children}
      </span>
    ) : (
      <>{children}</>
    );


  return (
    <div className="min-h-screen lg:h-[100dvh] lg:overflow-hidden flex flex-col bg-background text-foreground overflow-x-hidden transition-colors">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:type" content="profile" />
        {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
        {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        {meta.twitterImage && <meta name="twitter:image" content={meta.twitterImage} />}
        <link
          rel="canonical"
          href={`https://romer-garcia-portfolio.lovable.app/reverb/${character.id}`}
        />

        <link
          rel="preload"
          as="image"
          href={character.figure ?? character.image}
          fetchPriority="high"
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
                  className="relative z-30 max-w-[42%] font-reverb italic uppercase leading-[0.82] text-[clamp(1.75rem,9vw,4rem)] sm:text-[clamp(2rem,7vw,4.5rem)] md:text-[clamp(2rem,5.5vw,3.5rem)] lg:max-w-none lg:text-[clamp(2.25rem,3.6vw,3.375rem)] tracking-[-0.02em]"
                  style={{ color: accent, textShadow: `0 0 45px ${glow}` }}
                >
                  {character.name}
                </h1>


                <div className="relative z-50 mt-4 h-[3px] w-12" style={{ backgroundColor: accent }} />

                <p className="relative z-50 mt-4 max-w-[15ch] font-roc text-[11px] tracking-[0.18em] md:tracking-[0.24em] uppercase text-white/85 leading-[1.8]">
                  <ReverbWordmark className="text-[inherit] text-white/85" />
                  <br />
                  Collective
                  <br />
                  {`// ${(character.title ?? character.role).split("//").pop()?.trim()}`}
                </p>

                {character.tagline && (
                  <p
                    className="relative z-50 mt-5 max-w-[8ch] font-hand text-xl md:text-2xl lg:text-3xl leading-[1.1]"
                    style={{ color: accent }}
                  >
                    {character.tagline.map((line) => (
                      <span key={line} className="block">
                        <Redact>{line}</Redact>
                      </span>
                    ))}
                  </p>
                )}

                {/* Reverb mark + word list */}
                <div className="mt-6 relative z-50 max-w-[42%] lg:mt-8 lg:max-w-none">
                  <ReverbWordmark className="text-xl md:text-xl lg:text-2xl" />
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
                <div className="absolute -right-[4%] top-0 z-40 flex h-[105%] w-[82%] items-start justify-end pointer-events-none md:right-[4%] md:w-[58%] md:h-[100%] lg:right-[-58%] lg:top-[-2.5%] lg:bottom-auto lg:h-[105.5%] lg:w-[110%] lg:items-start">
                  <div className="relative h-full">
                    <img
                      src={character.figure ?? character.image}
                      alt={`${character.name}, ${character.role}`}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="h-full w-auto max-w-none object-contain object-right md:object-right-top lg:object-right-top drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                      style={
                        locked
                          ? { filter: "grayscale(100%) brightness(0.45) contrast(0.9) blur(3px)", opacity: 1 }
                          : undefined
                      }
                    />
                    {locked && (
                      <span
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-roc text-[11px] tracking-[0.4em] uppercase text-white/45 border border-white/25 px-3 py-2"
                      >
                        Locked
                      </span>
                    )}
                  </div>
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
                            <dt className="font-roc text-[11px] tracking-[0.22em] uppercase text-black/45 shrink-0">
                              {row.label}
                            </dt>
                            <dd className="font-roc text-[11px] tracking-[0.12em] uppercase text-black/80">
                              <Redact>{row.value}</Redact>
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-2 font-roc text-[11px] tracking-[0.2em] uppercase text-black/70">
                        <Redact>{character.discipline ?? character.role}</Redact>
                      </p>
                    </section>

                    <section>
                      <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-1.5 border-b-2 border-black/80">
                        Character
                      </h2>
                      <ul className="mt-2 space-y-1">
                        {character.notes?.map((n) => (
                          <li
                            key={n}
                            className="font-roc text-[11px] tracking-[0.14em] uppercase text-black/75"
                          >
                            – <Redact>{n}</Redact>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="space-y-4">
                      <div>
                        <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-1.5 border-b-2 border-black/80">
                          Signature
                        </h2>
                        {character.colorName && (
                          <div className="mt-2 flex items-center gap-3">
                            <span
                              className="h-6 w-6 rounded-full border border-black/10 shadow-inner"
                              style={{ backgroundColor: accent }}
                            />
                            <span className="font-roc text-[11px] tracking-[0.18em] uppercase text-black/75">
                              Color — <Redact>{character.colorName}</Redact>
                            </span>
                          </div>
                        )}
                        {character.specialties && (
                          <p className="mt-3 font-roc text-[11px] tracking-[0.14em] uppercase text-black/75 leading-[1.9]">
                            <span className="text-black/45">Specialties — </span>
                            <Redact>{character.specialties.join(" / ")}</Redact>
                          </p>
                        )}
                      </div>

                      {character.gear && (
                        <div>
                          <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-1.5 border-b-2 border-black/80">
                            Gear / Accessories
                          </h2>
                          <ul className="mt-2 space-y-1">
                            {character.gear.map((g) => (
                              <li
                                key={g}
                                className="font-roc text-[11px] tracking-[0.14em] uppercase text-black/75"
                              >
                                – <Redact>{g}</Redact>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </section>

                    {character.overview && (
                      <section className="md:col-span-2">
                        <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-1.5 border-b-2 border-black/80">
                          Overview
                        </h2>
                        <div className="mt-2 space-y-2">
                          {character.overview.map((p) => (
                            <p
                              key={p.slice(0, 24)}
                              className="font-roc text-[11px] leading-[1.9] text-black/75"
                            >
                              <Redact>{p}</Redact>
                            </p>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Gallery */}
                    <section className="md:col-span-2">
                      <h2 className="font-roc text-[11px] tracking-[0.3em] uppercase pb-1.5 border-b-2 border-black/80">
                        Gallery
                      </h2>
                      {character.gallery && character.gallery.length > 0 ? (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {character.gallery.map((item, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-video bg-black/5 border border-black/10 overflow-hidden"
                            >
                              {item.type === "video" ? (
                                <video
                                  src={item.src}
                                  className="w-full h-full object-cover"
                                  controls
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  src={item.src}
                                  alt={item.caption || `${character.name} gallery ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              )}
                              {item.caption && (
                                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white/90 font-roc text-[9px] tracking-[0.2em] uppercase px-2 py-1 truncate">
                                  {item.caption}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 font-roc text-[11px] tracking-[0.14em] uppercase text-black/45">
                          Gallery coming soon.
                        </p>
                      )}
                    </section>

                    {character.id === "spark" && (
                      <section className="md:col-span-2">
                        <Link
                          to="/reverb/spark-20"
                          aria-label="Spark, one year later"
                          className="inline-block font-roc text-[9px] tracking-[0.4em] uppercase text-black/15 hover:text-black/70 transition-colors"
                        >
                          [ +1 YR ]
                        </Link>
                      </section>
                    )}

                    <section className="md:col-span-2 border-t border-black/15 pt-3">
                      {character.signOff && (
                        <p className="font-roc text-[11px] tracking-[0.24em] uppercase text-black/70 leading-[1.9]">
                          {character.signOff}
                        </p>
                      )}
                      <ReverbWordmark className="mt-3 text-lg text-reverb-wordmark" />
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
                    src={reverbThumb(c.id)}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    width={320}
                    height={480}
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
            © {new Date().getFullYear()} Romer Garcia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReverbCharacter;
