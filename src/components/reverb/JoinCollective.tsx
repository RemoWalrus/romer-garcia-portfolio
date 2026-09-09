import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/components/GoogleAnalytics";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Where the visitor was when they joined — used for internal attribution only. */
const sourcePage = () =>
  typeof window === "undefined" ? "unknown" : window.location.pathname;

const utm = (key: string) => {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get(key);
  return value && value.length <= 120 ? value : null;
};

/**
 * Subtle text CTA reused in the Reverb header and footer.
 * Points at the signup section on the main Reverb page.
 */
export const JoinCollectiveCta = ({
  className,
  label = "Join the Collective",
}: {
  className?: string;
  label?: string;
}) => {
  const location = useLocation();

  const onClick = () => {
    trackEvent("Reverb", "join_collective_cta_click", location.pathname);
    if (location.pathname === "/reverb") {
      document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Link
      to="/reverb#join"
      onClick={onClick}
      className={cn("reverb-button", className)}
    >
      {label}
    </Link>
  );
};

/**
 * Stage 0 signup: one email field, one button.
 * Extension point for Stage 1 (REVERB // DROP 001): the row written here carries a
 * `status` column, so a later fulfilment step can pick subscribers up without
 * touching this form.
 */
export const JoinCollectiveForm = ({ className }: { className?: string }) => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();

    if (!EMAIL_RE.test(value) || value.length > 254) {
      setError("That address doesn't look right.");
      return;
    }

    setError(null);
    setState("sending");

    const { error: insertError } = await supabase
      .from("collective_subscribers")
      .insert({
        email: value,
        source_page: sourcePage(),
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        utm_source: utm("utm_source"),
        utm_medium: utm("utm_medium"),
        utm_campaign: utm("utm_campaign"),
      });

    // 23505 = already on the list. Treat it as success, never as a failure.
    if (insertError && insertError.code !== "23505") {
      setState("idle");
      setError("Signal lost. Try again in a moment.");
      return;
    }

    if (!insertError) {
      trackEvent("Reverb", "join_collective_signup", location.pathname);
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div className={cn("text-center", className)}>
        <p className="font-roc font-extrabold italic uppercase text-reverb-wordmark text-3xl md:text-4xl">You're in.</p>
        <p className="mt-3 font-roc text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Welcome to the Collective. Stay on frequency.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)} noValidate>
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
          disabled={state === "sending"}
          className="reverb-button shrink-0 disabled:opacity-60"
        >
          {state === "sending" ? "Tuning in…" : "Join the Collective"}
        </button>
      </div>

      {error && (
        <p className="mt-3 font-roc text-[10px] uppercase tracking-[0.18em] text-destructive">
          {error}
        </p>
      )}

      <p className="mt-4 font-roc text-[9px] leading-relaxed tracking-[0.1em] text-muted-foreground/70">
        By joining you agree to receive occasional Reverb emails. Unsubscribe any time.
      </p>
    </form>
  );
};

/** Full signup block for the bottom of the main Reverb page. */
export const JoinCollectiveSection = () => {
  const { hash } = useLocation();

  // Arriving from a CTA on another Reverb page (/reverb#join).
  useEffect(() => {
    if (hash !== "#join") return;
    const t = window.setTimeout(
      () => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" }),
      120,
    );
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
  <section id="join" className="border-t border-border bg-background transition-colors">
    <div className="mx-auto w-full max-w-[1500px] px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-roc font-extrabold italic uppercase text-reverb-wordmark text-3xl md:text-5xl">
          Join the Collective
        </h2>
        <p className="mt-4 font-roc text-sm leading-relaxed text-muted-foreground">
          Reverb isn't a club. It's a frequency.
        </p>
        <p className="mt-2 font-roc text-sm leading-relaxed text-muted-foreground">
          Get new artwork, stories, character drops, and transmissions from the Reverb universe.
        </p>
        <JoinCollectiveForm className="mt-8 text-left" />
      </div>
    </div>
  </section>
  );
};
