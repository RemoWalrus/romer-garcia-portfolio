import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Lock, LockOpen, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { applyTheme, isDarkNow, setThemeOverride } from "@/lib/theme";
import { setUnlocked, useReverbUnlocked } from "@/lib/reverbLock";
import { JoinCollectiveCta } from "@/components/reverb/JoinCollective";
import { getCharacter } from "@/data/reverbCharacters";


const ReverbLockToggle = () => {
  const unlocked = useReverbUnlocked();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setIsEditMode(window.self !== window.top);
  }, []);

  if (!isEditMode) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setUnlocked(!unlocked)}
      aria-label={unlocked ? "Lock unlockable profiles" : "Unlock hidden profiles"}
      title={unlocked ? "Unlockables: unlocked" : "Unlockables: locked"}
      className="fixed bottom-[68px] right-4 z-50 bg-background/80 backdrop-blur-sm border-border"
    >
      {unlocked ? <LockOpen className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
    </Button>
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
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm border-border"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export const ReverbWordmark = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  const word = "REVERB".split("");

  return (
    <span
      className={cn(
        "inline-flex gap-0 font-roc font-extrabold italic tracking-normal uppercase",
        className ?? "text-2xl text-reverb-wordmark md:text-3xl",
      )}
      style={style}
      aria-label="Reverb"
    >
        {word.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={cn(
              "inline-block",
              index === 1 && "-scale-x-100 -skew-x-[4deg] ml-[0.14em] mr-[0.04em]",
              index === 2 && "-ml-[0.27em]",
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
  accentColor,
}: {
  sticky?: boolean;
  accentColor?: string;
}) => {
  const { id } = useParams<{ id: string }>();
  const character = id ? getCharacter(id) : undefined;
  const accent = accentColor ?? character?.accent;

  return (
    <header
      className={`${sticky ? "sticky" : "absolute"} top-0 left-0 right-0 z-30 border-b border-border bg-background transition-colors`}
    >
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 py-4 md:px-8">
        <Link to="/reverb" className="min-w-0 leading-none pr-4">
          <ReverbWordmark
            style={accent ? { color: accent } : undefined}
          />
          <span className="mt-1 block max-w-[13rem] font-roc text-[8px] uppercase tracking-[0.12em] text-muted-foreground md:max-w-none md:text-[9px] md:tracking-[0.2em]">
            People / Ideas / Music / Change
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <ReverbThemeToggle />
          <ReverbLockToggle />
          <JoinCollectiveCta
            className="reverb-button"
            label="Join the Collective"
            accentColor={accent}
          />
        </div>
      </div>
    </header>
  );
};

export default ReverbHeader;