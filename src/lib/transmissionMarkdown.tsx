import { Fragment, ReactNode } from "react";

/**
 * Minimal, safe Markdown renderer for Transmission bodies.
 *
 * Everything is turned into React elements, so raw HTML in the database is
 * rendered as plain text and can never be injected into the page. Only
 * http(s), mailto and site-relative links/images are allowed.
 */

const SAFE_URL = /^(https?:\/\/|mailto:|\/)/i;
const safeUrl = (url: string) => (SAFE_URL.test(url.trim()) ? url.trim() : undefined);

type Inline = { text: string; key: string };

/** Inline formatting: **bold**, *italic*, `code`, [link](url), ![alt](src). */
const renderInline = (text: string, keyBase: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern =
    /(!\[([^\]]*)\]\(([^)\s]+)\))|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;

  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyBase}-i${i++}`;

    if (match[1]) {
      const src = safeUrl(match[3]);
      nodes.push(
        src ? (
          <img
            key={key}
            src={src}
            alt={match[2]}
            loading="lazy"
            decoding="async"
            className="my-6 w-full border border-border"
          />
        ) : null,
      );
    } else if (match[4]) {
      const href = safeUrl(match[6]);
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            target={href.startsWith("/") ? undefined : "_blank"}
            rel={href.startsWith("/") ? undefined : "noopener noreferrer"}
            className="underline decoration-reverb-wordmark/60 underline-offset-4 hover:text-reverb-wordmark"
          >
            {match[5]}
          </a>
        ) : (
          <Fragment key={key}>{match[5]}</Fragment>
        ),
      );
    } else if (match[7]) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {match[8]}
        </strong>,
      );
    } else if (match[9]) {
      nodes.push(<em key={key}>{match[10]}</em>);
    } else if (match[11]) {
      nodes.push(
        <code key={key} className="bg-foreground/10 px-1.5 py-0.5 text-[0.9em]">
          {match[12]}
        </code>,
      );
    }

    last = pattern.lastIndex;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

export const TransmissionBody = ({ body }: { body?: string }) => {
  if (!body?.trim()) return null;

  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let quote: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ");
    blocks.push(
      <p key={`p${key++}`} className="my-5 leading-[1.9] text-foreground/85">
        {renderInline(text, `p${key}`)}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={`l${key++}`}
        className={`my-5 space-y-2 pl-5 text-foreground/85 ${
          list.ordered ? "list-decimal" : "list-disc"
        }`}
      >
        {list.items.map((item, idx) => (
          <li key={idx} className="leading-[1.8]">
            {renderInline(item, `l${key}-${idx}`)}
          </li>
        ))}
      </Tag>,
    );
    list = null;
  };

  const flushQuote = () => {
    if (!quote.length) return;
    blocks.push(
      <blockquote
        key={`q${key++}`}
        className="my-7 border-l-2 border-reverb-wordmark pl-5 font-roc text-[13px] uppercase leading-[1.9] tracking-[0.08em] text-foreground/75"
      >
        {renderInline(quote.join(" "), `q${key}`)}
      </blockquote>,
    );
    quote = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushAll();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const sizes = [
        "text-2xl md:text-3xl",
        "text-xl md:text-2xl",
        "text-lg md:text-xl",
        "text-base",
      ][level - 1];
      const Tag = (["h2", "h3", "h4", "h5"] as const)[level - 1];
      blocks.push(
        <Tag
          key={`h${key++}`}
          className={`mt-10 mb-3 font-reverb font-black italic uppercase leading-[0.95] text-reverb-wordmark ${sizes}`}
        >
          {renderInline(heading[2], `h${key}`)}
        </Tag>,
      );
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s?/, ""));
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    const ordered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || ordered) {
      flushParagraph();
      flushQuote();
      const isOrdered = !!ordered;
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push((bullet ?? ordered)![1]);
      continue;
    }

    if (/^([-*_])\1{2,}$/.test(line)) {
      flushAll();
      blocks.push(<hr key={`hr${key++}`} className="my-10 border-border" />);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line);
  }

  flushAll();

  return (
    <div className="font-roc text-[14px] md:text-[15px]">{blocks}</div>
  );
};
