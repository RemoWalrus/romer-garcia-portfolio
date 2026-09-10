import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ReverbHeader from "@/components/reverb/ReverbHeader";
import TransmissionCard from "@/components/reverb/transmissions/TransmissionCard";
import { useTransmissions } from "@/hooks/use-reverb-transmissions";
import { useReverbCharacters } from "@/hooks/use-reverb-characters";

const CANONICAL = "https://romer-garcia-portfolio.lovable.app/reverb/transmissions";

const ReverbTransmissions = () => {
  const [character, setCharacter] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const { items, loading } = useTransmissions();
  const characters = useReverbCharacters().filter((c) => !c.hidden && !c.baseId);

  const categories = useMemo(
    () => Array.from(new Set(items.map((t) => t.category))).sort(),
    [items],
  );

  const accentFor = (slug?: string) =>
    characters.find((c) => c.id === slug)?.accent;

  const visible = items.filter(
    (t) =>
      (!character || t.characterSlug === character) &&
      (!category || t.category === category),
  );

  const Filter = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`font-roc text-[10px] uppercase tracking-[0.22em] transition-colors ${
        active
          ? "text-reverb-wordmark underline underline-offset-4"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Helmet>
        <title>Transmissions | Reverb Archive</title>
        <meta
          name="description"
          content="Signals, fragments, recovered files and new material from the Reverb universe."
        />
        <meta property="og:title" content="Transmissions | Reverb Archive" />
        <meta
          property="og:description"
          content="Signals, fragments, recovered files and new material from the Reverb universe."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Transmissions | Reverb Archive" />
        <meta
          name="twitter:description"
          content="Signals, fragments, recovered files and new material from the Reverb universe."
        />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>

      <ReverbHeader sticky />

      <main className="mx-auto w-full max-w-[1500px] px-5 pt-24 pb-16 md:px-8 md:pt-28 md:pb-24">
        <p className="font-roc text-[10px] uppercase tracking-[0.28em] text-reverb-wordmark">
          Reverb // Archive
        </p>
        <h1 className="reverb-section-title mt-4">Transmissions</h1>
        <p className="mt-6 max-w-[62ch] font-roc text-sm leading-[1.9] text-foreground/75">
          Signals, fragments, recovered files and new material from the Reverb universe.
        </p>

        {/* Filters */}
        <div className="mt-10 space-y-3 border-y border-border py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="font-roc text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
              Source
            </span>
            <Filter label="All" active={!character} onClick={() => setCharacter(null)} />
            {characters.map((c) => (
              <Filter
                key={c.id}
                label={c.name}
                active={character === c.id}
                onClick={() => setCharacter(character === c.id ? null : c.id)}
              />
            ))}
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="font-roc text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                Type
              </span>
              <Filter label="All" active={!category} onClick={() => setCategory(null)} />
              {categories.map((c) => (
                <Filter
                  key={c}
                  label={c}
                  active={category === c}
                  onClick={() => setCategory(category === c ? null : c)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Entries */}
        {loading ? (
          <p className="mt-10 font-roc text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Scanning frequencies…
          </p>
        ) : visible.length === 0 ? (
          <p className="mt-10 border border-dashed border-border px-5 py-8 font-roc text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            No transmissions detected
          </p>
        ) : (
          <div className="mt-2">
            {visible.map((t) => (
              <TransmissionCard
                key={t.id}
                transmission={t}
                accentColor={accentFor(t.characterSlug)}
              />
            ))}
          </div>
        )}

        <Link to="/reverb" className="reverb-button mt-12 inline-flex">
          ← Back to the crew
        </Link>
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

export default ReverbTransmissions;
