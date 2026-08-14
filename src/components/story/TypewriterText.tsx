import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  /** ms per character — slow enough to read along */
  speed?: number;
  className?: string;
  /** keep the blinking cursor after typing finishes */
  keepCursor?: boolean;
  /** called on every revealed character (use to follow along with scroll) */
  onTick?: () => void;
  /** called once the full text has been revealed */
  onComplete?: () => void;
  /** when true, immediately reveal the full text */
  skip?: boolean;
}

/**
 * Reveals text one character at a time (works with streaming text that grows),
 * with a blinking terminal cursor.
 */
const TypewriterText = ({
  text,
  speed = 32,
  className = "",
  keepCursor = false,
  onTick,
  onComplete,
  skip = false,
}: TypewriterTextProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const tickRef = useRef(onTick);
  const completeRef = useRef(onComplete);
  const completedRef = useRef(false);

  tickRef.current = onTick;
  completeRef.current = onComplete;

  // reset if the text is replaced entirely (not just appended to)
  useEffect(() => {
    if (!text.startsWith(text.slice(0, countRef.current))) {
      countRef.current = 0;
      completedRef.current = false;
      setCount(0);
    }
  }, [text]);

  // skip: immediately reveal the full text
  useEffect(() => {
    if (skip && countRef.current < text.length) {
      countRef.current = text.length;
      setCount(text.length);
      tickRef.current?.();
    }
  }, [skip, text.length]);

  useEffect(() => {
    if (count >= text.length) return;
    completedRef.current = false;
    const timer = window.setTimeout(() => {
      countRef.current = count + 1;
      setCount(count + 1);
      tickRef.current?.();
    }, speed);
    return () => window.clearTimeout(timer);
  }, [count, text, speed]);

  const done = count >= text.length;

  useEffect(() => {
    if (!done || text.length === 0 || completedRef.current) return;
    completedRef.current = true;
    completeRef.current?.();
  }, [done, text]);

  return (
    <span className={className || undefined}>
      {text.slice(0, count)}
      {(!done || keepCursor) && <span className="story-caret" aria-hidden="true">▊</span>}
    </span>
  );
};

export default TypewriterText;
