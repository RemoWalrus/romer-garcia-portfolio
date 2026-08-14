import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  text: string;
  /** ms per character — slow enough to read along */
  speed?: number;
  className?: string;
  /** keep the blinking cursor after typing finishes */
  keepCursor?: boolean;
}

/**
 * Reveals text one character at a time (works with streaming text that grows),
 * with a blinking terminal cursor.
 */
const TypewriterText = ({ text, speed = 32, className = "", keepCursor = false }: TypewriterTextProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  // reset if the text is replaced entirely (not just appended to)
  useEffect(() => {
    if (!text.startsWith(text.slice(0, countRef.current))) {
      countRef.current = 0;
      setCount(0);
    }
  }, [text]);

  useEffect(() => {
    if (count >= text.length) return;
    const timer = window.setTimeout(() => {
      countRef.current = count + 1;
      setCount(count + 1);
    }, speed);
    return () => window.clearTimeout(timer);
  }, [count, text, speed]);

  const done = count >= text.length;

  return (
    <span className={className || undefined}>
      {text.slice(0, count)}
      {(!done || keepCursor) && <span className="story-caret" aria-hidden="true">▊</span>}
    </span>
  );
};

export default TypewriterText;
