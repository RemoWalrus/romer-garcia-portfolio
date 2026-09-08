import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const ReverbWordmark = ({ className }: { className?: string }) => {
  const word = "REVERB".split("");

  return (
    <span
      className={cn(
        "inline-flex gap-[0.025em] font-roc font-extrabold tracking-normal uppercase",
        className ?? "text-2xl text-reverb-wordmark md:text-3xl",
      )}
      aria-label="Reverb"
    >
      {word.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={index === 1 ? "inline-block -scale-x-100" : "inline-block"}
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
}) => (
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

      <Link
        to="/paradoxxia"
        className="font-roc text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Paradoxxia →
      </Link>
    </div>
  </header>
);

export default ReverbHeader;