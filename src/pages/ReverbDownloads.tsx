import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Download, Lock } from "lucide-react";
import ReverbHeader from "@/components/reverb/ReverbHeader";
import { useReverbDownloads, type ReverbDownload } from "@/hooks/use-reverb-downloads";
import { checkCollectiveMember, useCollectiveAccess } from "@/lib/collectiveAccess";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/components/GoogleAnalytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CANONICAL = "https://romergarcia.com/reverb/downloads";

const GROUPS: { key: string; label: string }[] = [
  { key: "poster", label: "Posters" },
  { key: "wallpaper-desktop", label: "Desktop Wallpapers" },
  { key: "wallpaper-mobile", label: "Phone Wallpapers" },
];

/** Members-only gate: confirms the address is on the Collective list. */
const Gate = ({ onPass }: { onPass: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "checking">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();

    if (!EMAIL_RE.test(value) || value.length > 254) {
      setError("That address doesn't look right.");
      return;
    }

    setError(null);
    setState("checking");

    try {
      const ok = await checkCollectiveMember(value);
      if (!ok) {
        setState("idle");
        setError("That address isn't on the Collective list yet.");
        return;
      }
      trackEvent("Reverb", "downloads_unlocked", "collective_email");
      onPass(value);
    } catch {
      setState("idle");
      setError("Signal lost. Try again in a moment.");
    }
  };

  return (
    <section className="border-t border-border bg-background transition-colors">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-14 md:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="font-roc text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Reverb // Downloads
          </p>
          <h1 className="reverb-section-title mt-2">Collective Only</h1>
          <p className="mt-6 max-w-[60ch] font-roc text-sm leading-7 text-foreground/80">
            Posters and wallpapers from the Reverb archive are for members of the
            Collective. Enter the email you joined with to open the vault.
          </p>

          <form onSubmit={submit} className="mt-8" noValidate>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                aria-label="Email address"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 border border-border bg-transparent px-4 py-3 font-roc text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === "checking"}
                className="reverb-button shrink-0 disabled:opacity-60"
              >
                {state === "checking" ? "Checking…" : "Open the vault"}
              </button>
            </div>
            {error && (
              <p className="mt-3 font-roc text-[10px] uppercase tracking-[0.18em] text-destructive">
                {error}
              </p>
            )}
          </form>

          <p className="mt-6 font-roc text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Not a member yet?{" "}
            <Link to="/reverb#join" className="underline underline-offset-4 hover:text-foreground">
              Join the Collective
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

const DownloadCard = ({
  item,
  onPrint,
}: {
  item: ReverbDownload;
  onPrint: (item: ReverbDownload) => void;
}) => {
  const isPoster = item.category === "poster";

  return (
    <figure className="group flex flex-col border border-border bg-background transition-colors">
      <div className="relative overflow-hidden bg-muted">
        <img
          src={item.previewUrl ?? item.fileUrl}
          alt={item.description ?? item.title}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
            item.category === "wallpaper-mobile"
              ? "aspect-[9/16]"
              : isPoster
                ? "aspect-[2/3]"
                : "aspect-video"
          }`}
        />
      </div>

      <figcaption className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="font-roc text-sm font-medium uppercase tracking-[0.08em] text-foreground">
            {item.title}
          </p>
          {item.sizeLabel && (
            <p className="mt-1 font-roc text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {item.sizeLabel}
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <a
            href={item.fileUrl}
            download
            onClick={() => trackEvent("Reverb", "download_asset", item.title)}
            className="reverb-button inline-flex items-center gap-2"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </a>
          {isPoster && (
            <button
              type="button"
              onClick={() => onPrint(item)}
              className="font-roc text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Want it printed?
            </button>
          )}
        </div>
      </figcaption>
    </figure>
  );
};

/** Print-on-demand is not live yet — collect interest instead. */
const PrintWaitlist = ({
  email,
  selected,
  onClear,
}: {
  email: string;
  selected: ReverbDownload | null;
  onClear: () => void;
}) => {
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("sending");

    const { error: insertError } = await supabase.from("reverb_print_waitlist").insert({
      email,
      download_id: selected?.id ?? null,
      poster_title: selected?.title ?? null,
      note: note.trim().slice(0, 500) || null,
    });

    if (insertError) {
      setState("idle");
      setError("Signal lost. Try again in a moment.");
      return;
    }

    trackEvent("Reverb", "print_waitlist_join", selected?.title ?? "any");
    setState("done");
    onClear();
  };

  return (
    <section
      id="print"
      className="reverb-noise border-t border-border bg-background py-10 transition-colors md:py-14"
    >
      <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8">
        <p className="font-roc text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Reverb // Print
        </p>
        <h2 className="reverb-section-title mt-2">Printed Posters</h2>

        {state === "done" ? (
          <p className="mt-6 max-w-[60ch] font-roc text-sm leading-7 text-foreground/80">
            You're on the print list. We'll reach out at{" "}
            <span className="text-foreground">{email}</span> when printed posters open up.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 max-w-2xl">
            <p className="max-w-[60ch] font-roc text-sm leading-7 text-foreground/80">
              Printed, shipped posters aren't open yet. Join the print list and you'll be
              first in line when they are.
            </p>

            {selected && (
              <p className="mt-4 font-roc text-[10px] uppercase tracking-[0.2em] text-reverb-wordmark">
                Interested in: {selected.title}
              </p>
            )}

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              aria-label="Anything you want printed, sizes, quantities"
              placeholder="Sizes, quantities, anything else (optional)"
              className="mt-4 w-full border border-border bg-transparent px-4 py-3 font-roc text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-foreground focus:outline-none"
            />

            <button
              type="submit"
              disabled={state === "sending"}
              className="reverb-button mt-4 disabled:opacity-60"
            >
              {state === "sending" ? "Adding you…" : "Add me to the print list"}
            </button>

            {error && (
              <p className="mt-3 font-roc text-[10px] uppercase tracking-[0.18em] text-destructive">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

const ReverbDownloads = () => {
  const { email, ready, grant, revoke } = useCollectiveAccess();
  const { items, loading } = useReverbDownloads();
  const [selected, setSelected] = useState<ReverbDownload | null>(null);

  const groups = useMemo(
    () =>
      GROUPS.map((g) => ({ ...g, items: items.filter((i) => i.category === g.key) })).filter(
        (g) => g.items.length > 0,
      ),
    [items],
  );

  const choosePrint = (item: ReverbDownload) => {
    setSelected(item);
    document.getElementById("print")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Helmet>
        <title>Free Downloads — Wallpapers &amp; Posters | Reverb</title>
        <meta
          name="description"
          content="Free Reverb wallpapers and posters for Collective members — desktop and phone backgrounds plus printable artwork, with a waiting list for printed posters."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CANONICAL} />
      </Helmet>

      <ReverbHeader />

      {!ready ? null : !email ? (
        <Gate onPass={grant} />
      ) : (
        <>
          <section className="border-t border-border bg-background transition-colors">
            <div className="mx-auto w-full max-w-[1500px] px-5 py-10 md:px-8 md:py-14">
              <p className="font-roc text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Reverb // Downloads
              </p>
              <h1 className="reverb-section-title mt-2">The Vault</h1>
              <p className="mt-5 max-w-[60ch] font-roc text-sm leading-7 text-foreground/80">
                Free for the Collective. Personal use only — don't resell them.
              </p>
              <button
                type="button"
                onClick={revoke}
                className="mt-5 inline-flex items-center gap-2 font-roc text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                <Lock className="h-3 w-3" />
                Lock the vault ({email})
              </button>
            </div>
          </section>

          {loading && (
            <p className="mx-auto w-full max-w-[1500px] px-5 pb-14 font-roc text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:px-8">
              Tuning in…
            </p>
          )}

          {!loading && groups.length === 0 && (
            <p className="mx-auto w-full max-w-[1500px] px-5 pb-14 font-roc text-sm text-muted-foreground md:px-8">
              Nothing in the vault yet. New drops land here first.
            </p>
          )}

          {groups.map((group) => (
            <section
              key={group.key}
              className="border-t border-border bg-background py-10 transition-colors md:py-14"
            >
              <div className="mx-auto w-full max-w-[1500px] px-5 md:px-8">
                <h2 className="reverb-section-title">{group.label}</h2>
                <div
                  className={`mt-8 grid gap-6 ${
                    group.key === "wallpaper-desktop"
                      ? "sm:grid-cols-2"
                      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {group.items.map((item) => (
                    <DownloadCard key={item.id} item={item} onPrint={choosePrint} />
                  ))}
                </div>
              </div>
            </section>
          ))}

          <PrintWaitlist email={email} selected={selected} onClear={() => setSelected(null)} />
        </>
      )}

      <footer className="border-t border-border py-8 font-roc text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <div className="mx-auto w-full max-w-[1500px] px-5 text-center md:px-8">
          <span>© {new Date().getFullYear()} Romer Garcia. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default ReverbDownloads;
