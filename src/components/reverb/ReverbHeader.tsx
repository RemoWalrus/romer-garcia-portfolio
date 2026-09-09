import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lock, LockOpen, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { applyTheme, isDarkNow, setThemeOverride } from "@/lib/theme";
import { setUnlocked, useReverbUnlocked } from "@/lib/reverbLock";

const ReverbLockToggle = () => {
  const unlocked = useReverbUnlocked();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setIsEditMode(window.self !== window.top);
  }, []);

  if (!isEditMode) return null;

  return (
    <button
      type="button"
      onClick={() => setUnlocked(!unlocked)}
      aria-label={unlocked ? "Lock unlockable profiles" : "Unlock hidden profiles"}
      title={unlocked ? "Unlockables: unlocked" : "Unlockables: locked"}
      className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
    >
      {unlocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
    </button>
  );
};

const ReverbThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Only show in Lovable preview/edit mode (rendered in iframe)
    setIsEditMode(window.self !== window.top);
    setIsDark(isDarkNow());
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    setThemeOverride(next ? "dark" : "light");
  };

  if (!isEditMode) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

export const ReverbWordmark = ({ className }: { className?: string }) => {
  const word = "REVERB".split("");

  return (
    <span
      className={cn(
        "inline-flex gap-[0.025em] font-roc font-extrabold italic tracking-normal uppercase",
        className ?? "text-2xl text-reverb-wordmark md:text-3xl",
      )}
      aria-label="Reverb"
    >
      {word.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={cn(
            "inline-block",
            index === 1 && "-scale-x-100",
            index === 2 && "-ml-[0.10em]",
          )}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  );
};


const ReverbHeader = ({
  sticky = false,
}: {
  sticky?: boolean;
}) => {
  return (

    <header
      className={`${sticky ? "sticky" : "absolute"} top-0 left-0 right-0 z-30 border-b border-border bg-background transition-colors`}
    >
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 py-4 md:px-8">
        <Link to="/reverb" className="min-w-0 leading-none pr-4">
          <ReverbWordmark />
          <span className="mt-1 block max-w-[13rem] font-roc text-[8px] uppercase tracking-[0.12em] text-muted-foreground md:max-w-none md:text-[9px] md:tracking-[0.2em]">
            People / Ideas / Music / Change
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <ReverbThemeToggle />
          <ReverbLockToggle />
          <Link
            to="/paradoxxia"
            className="font-roc text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Paradoxxia →
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ReverbHeader;