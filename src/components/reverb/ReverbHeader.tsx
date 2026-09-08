import { Link } from "react-router-dom";

const ReverbWordmark = () => {
  const word = "REVERB".split("");

  return (
    <span
      className="inline-flex gap-[0.025em] font-roc text-2xl font-extrabold tracking-normal uppercase text-reverb-wordmark md:text-3xl"
      aria-label="Reverb"
    >
      {word.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={index === 3 ? "ml-[0.035em] inline-block -scale-x-100" : "inline-block"}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  );
};

const ReverbHeader = ({ sticky = false }: { sticky?: boolean }) => (
  <header
    className={`${sticky ? "sticky" : "absolute"} top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-5 py-4 backdrop-blur-sm transition-colors md:px-8`}
  >
    <Link to="/reverb" className="leading-none">
      <ReverbWordmark />
      <span className="mt-1 block font-roc text-[9px] uppercase tracking-[0.3em] text-muted-foreground md:text-[10px]">
        People / Ideas / Music / Change
      </span>
    </Link>

    <Link
      to="/paradoxxia"
      className="font-roc text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
    >
      Paradoxxia →
    </Link>
  </header>
);

export default ReverbHeader;