// Runs after `vite build` (postbuild hook).
//
// This app is a client-rendered SPA, so crawlers that don't execute JavaScript
// (social previews, some AI crawlers) only ever see the static index.html head.
// This script writes a real HTML file for every Reverb route with the route's
// own title/description/canonical/og/twitter tags, JSON-LD, and a <noscript>
// copy of the dossier text — so the content is in the raw page source.
// The SPA still boots from the same hashed bundles.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  SITE,
  esc,
  fetchCharacters,
  fetchMetadata,
  fetchTransmissions,
  imageUrl,
} from "./reverb-data.mjs";

const DIST = resolve("dist");
const shellPath = resolve(DIST, "index.html");
if (!existsSync(shellPath)) {
  console.warn("[prerender] dist/index.html missing — skipping");
  process.exit(0);
}
const shell = readFileSync(shellPath, "utf8");

const [characters, transmissions, metadata] = await Promise.all([
  fetchCharacters(),
  fetchTransmissions(),
  fetchMetadata(),
]);

const m = (key, fallback) => metadata[key] ?? fallback;

const REVERB_DESC = m(
  "reverb.description",
  "Reverb is a multimedia franchise set in the Paradoxxia universe — a prequel following five outsiders who turn sound into resistance.",
);

/** Builds the head block for one route. */
function head({ title, description, keywords, canonical, image, type = "website", robots, jsonLd }) {
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : null,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    robots ? `<meta name="robots" content="${esc(robots)}" />` : null,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:site_name" content="Romer Garcia" />`,
    image ? `<meta property="og:image" content="${esc(image)}" />` : null,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:url" content="${esc(canonical)}" />`,
    image ? `<meta name="twitter:image" content="${esc(image)}" />` : null,
    jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`
      : null,
  ].filter(Boolean);
  return tags.map((t) => `    ${t}`).join("\n");
}

/** Per-brand icon set, so the static HTML already carries the right favicon. */
function brandIcons(route) {
  const brand =
    route === "/paradoxxia" || route === "/char-gen" || route === "/story"
      ? "paradoxxia"
      : route === "/reverb" || route.startsWith("/reverb/")
        ? "reverb"
        : null;
  if (!brand) return null;
  const extra =
    brand === "reverb"
      ? `    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-reverb-16.png?v=5" />\n    <link rel="manifest" href="/reverb.webmanifest" />\n`
      : "";
  return `    <link rel="shortcut icon" sizes="any" href="/favicon-${brand}.ico?v=5" />
${extra}    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-${brand}.png?v=5" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-${brand}-192.png?v=5" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon-${brand}-512.png?v=5" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-${brand}.png?v=5" />
    <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-${brand}.png?v=5" />`;
}

/** Replaces the shell's head tags with the route's own, and injects noscript content. */
function writePage(route, headHtml, bodyHtml) {
  let html = shell
    // drop the shell's own title/description/canonical/social tags
    .replace(/\n\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\n\s*<meta name="description"[^>]*>/g, "")
    .replace(/\n\s*<meta name="keywords"[^>]*>/g, "")
    .replace(/\n\s*<link rel="canonical"[^>]*>/g, "")
    .replace(/\n\s*<meta property="og:[^>]*>/g, "")
    .replace(/\n\s*<meta name="twitter:[^>]*>/g, "");

  const icons = brandIcons(route);
  if (icons) {
    html = html
      .replace(/\n\s*<link rel="shortcut icon"[^>]*>/g, "")
      .replace(/\n\s*<link rel="icon"[^>]*>/g, "")
      .replace(/\n\s*<link rel="apple-touch-icon(-precomposed)?"[^>]*>/g, "")
      .replace("</head>", `${icons}\n  </head>`);
  }

  html = html.replace("</head>", `${headHtml}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"></div>\n    <noscript>\n${bodyHtml}\n    </noscript>`,
  );

  const out = resolve(DIST, `${route.replace(/^\//, "")}/index.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`[prerender] ${route}`);
}

const visible = characters.filter((c) => !c.is_hidden);
const indexable = visible.filter((c) => !c.is_locked && c.has_profile !== false);

/* ---------------------------------------------------------------- /reverb */

const rosterJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CreativeWorkSeries",
      "@id": `${SITE}/reverb#franchise`,
      name: "Reverb",
      alternateName: "Reverb Collective",
      url: `${SITE}/reverb`,
      description: REVERB_DESC,
      genre: ["Science Fiction", "Cyberpunk", "Multimedia"],
      author: { "@type": "Person", name: "Romer Garcia", url: SITE },
      isPartOf: {
        "@type": "CreativeWorkSeries",
        name: "Paradoxxia",
        url: `${SITE}/paradoxxia`,
      },
      character: indexable.map((c) => ({
        "@type": "Person",
        name: c.name,
        jobTitle: c.discipline ?? c.role,
        url: `${SITE}/reverb/${c.id}`,
        image: imageUrl(c.image_file),
      })),
    },
    {
      "@type": "ItemList",
      name: "Reverb Collective members",
      itemListElement: indexable.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        description: c.discipline ?? c.role,
        url: `${SITE}/reverb/${c.id}`,
      })),
    },
    {
      "@type": "WebSite",
      url: SITE,
      name: "Romer Garcia",
    },
  ],
};

writePage(
  "/reverb",
  head({
    title: m("reverb.title", "Reverb | Paradoxxia Universe Multimedia Franchise"),
    description: m("reverb.description", REVERB_DESC),
    keywords: m(
      "reverb.keywords",
      "Reverb, Reverb Collective, Paradoxxia universe, multimedia franchise, prequel, Romer Garcia",
    ),
    canonical: `${SITE}/reverb`,
    image: m("reverb.og_image", imageUrl(visible[0]?.image_file)),
    jsonLd: rosterJsonLd,
  }),
  [
    `      <h1>Reverb — a multimedia franchise in the Paradoxxia universe</h1>`,
    `      <p>${esc(REVERB_DESC)}</p>`,
    `      <h2>The Collective</h2>`,
    "      <ul>",
    ...visible.map(
      (c) =>
        `        <li><a href="/reverb/${c.id}">${esc(c.name)}</a> — ${esc(c.discipline ?? c.role)}${
          c.caption ? `. ${esc(c.caption)}` : ""
        }</li>`,
    ),
    "      </ul>",
    `      <h2>${esc(m("reverb.logbook.title_line1", "Different Steps."))} ${esc(
      m("reverb.logbook.title_line2", "Same Frequency."),
    )}</h2>`,
    `      <p>${esc(m("reverb.logbook.body", ""))}</p>`,
  ].join("\n"),
);

/* ------------------------------------------------------ /reverb/:character */

for (const c of visible) {
  const url = `${SITE}/reverb/${c.id}`;
  const overview = (c.overview ?? []).join(" ");
  const description =
    metadata[`reverb.${c.id}.description`] ||
    overview ||
    `${c.name} — ${c.discipline ?? c.role}. Character profile from Reverb, a multimedia franchise set in the Paradoxxia universe.`;
  const locked = c.is_locked || c.has_profile === false;

  const jsonLd = locked
    ? null
    : {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfilePage",
            "@id": url,
            url,
            name: `${c.name} | Reverb Collective`,
            description,
            mainEntity: { "@id": `${url}#person` },
            isPartOf: { "@type": "WebSite", url: SITE, name: "Romer Garcia" },
          },
          {
            "@type": "Person",
            "@id": `${url}#person`,
            name: c.name,
            jobTitle: c.discipline ?? c.role,
            description,
            image: imageUrl(c.figure_file ?? c.image_file),
            url,
            ...(c.specialties?.length ? { knowsAbout: c.specialties } : {}),
            ...(c.quote ? { subjectOf: { "@type": "Quotation", text: c.quote } } : {}),
            memberOf: {
              "@type": "Organization",
              "@id": `${SITE}/reverb#collective`,
              name: "Reverb Collective",
              url: `${SITE}/reverb`,
            },
          },
          {
            "@type": "CreativeWork",
            name: `${c.name} — Reverb character sheet`,
            about: { "@id": `${url}#person` },
            url,
            creator: { "@type": "Person", name: "Romer Garcia", url: SITE },
            isPartOf: { "@id": `${SITE}/reverb#franchise` },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE },
              { "@type": "ListItem", position: 2, name: "Reverb", item: `${SITE}/reverb` },
              { "@type": "ListItem", position: 3, name: c.name, item: url },
            ],
          },
        ],
      };

  const body = locked
    ? `      <h1>${esc(c.name)}</h1>\n      <p>This character sheet is classified. Unlock coming soon.</p>`
    : [
        `      <h1>${esc(c.name)} — ${esc(c.discipline ?? c.role)}</h1>`,
        c.quote ? `      <blockquote>${esc(c.quote)}</blockquote>` : null,
        (c.identity ?? []).length
          ? `      <h2>Identity</h2>\n      <ul>${(c.identity ?? [])
              .map((i) => `<li>${esc(i.label)}: ${esc(i.value)}</li>`)
              .join("")}</ul>`
          : null,
        (c.specialties ?? []).length
          ? `      <h2>Specialties</h2>\n      <ul>${c.specialties
              .map((s) => `<li>${esc(s)}</li>`)
              .join("")}</ul>`
          : null,
        (c.gear ?? []).length
          ? `      <h2>Gear</h2>\n      <ul>${c.gear.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`
          : null,
        (c.overview ?? []).length
          ? `      <h2>Overview</h2>\n${c.overview.map((p) => `      <p>${esc(p)}</p>`).join("\n")}`
          : null,
        `      <p><a href="/reverb">Back to the Reverb Collective</a></p>`,
      ]
        .filter(Boolean)
        .join("\n");

  writePage(
    `/reverb/${c.id}`,
    head({
      title:
        metadata[`reverb.${c.id}.title`] ??
        `${c.name} | Reverb Collective Character Sheet`,
      description,
      keywords:
        metadata[`reverb.${c.id}.keywords`] ??
        `${c.name}, Reverb Collective, Paradoxxia universe, character profile`,
      canonical: url,
      image: metadata[`reverb.${c.id}.og_image`] ?? imageUrl(c.image_file),
      type: "profile",
      robots: locked ? "noindex, follow" : null,
      jsonLd,
    }),
    body,
  );
}

/* --------------------------------------------------- /reverb/transmissions */

writePage(
  "/reverb/transmissions",
  head({
    title: "Reverb // Transmissions | Paradoxxia Universe Archive",
    description:
      "The Reverb transmission archive: artwork, recovered documents, character lore and anomalies from the Paradoxxia universe.",
    keywords: "Reverb transmissions, Reverb archive, Paradoxxia universe, character lore",
    canonical: `${SITE}/reverb/transmissions`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Reverb // Transmissions",
      url: `${SITE}/reverb/transmissions`,
      isPartOf: { "@id": `${SITE}/reverb#franchise` },
      hasPart: transmissions.map((t) => ({
        "@type": "Article",
        headline: t.title,
        url: `${SITE}/reverb/transmissions/${t.slug}`,
        datePublished: t.published_at,
      })),
    },
  }),
  [
    "      <h1>Reverb // Transmissions</h1>",
    "      <ul>",
    ...transmissions.map(
      (t) =>
        `        <li><a href="/reverb/transmissions/${t.slug}">${esc(t.title)}</a>${
          t.excerpt ? ` — ${esc(t.excerpt)}` : ""
        }</li>`,
    ),
    "      </ul>",
  ].join("\n"),
);

for (const t of transmissions) {
  const url = `${SITE}/reverb/transmissions/${t.slug}`;
  const description = t.excerpt ?? t.subtitle ?? "A transmission from the Reverb archive.";
  writePage(
    `/reverb/transmissions/${t.slug}`,
    head({
      title: `${t.title} | Reverb Transmission`,
      description,
      canonical: url,
      image: t.cover_image_url ?? undefined,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: t.title,
        alternativeHeadline: t.subtitle ?? undefined,
        description,
        image: t.cover_image_url ?? undefined,
        url,
        datePublished: t.published_at,
        dateModified: t.updated_at ?? t.published_at,
        author: { "@type": "Person", name: "Romer Garcia", url: SITE },
        isPartOf: { "@id": `${SITE}/reverb#franchise` },
      },
    }),
    [
      `      <h1>${esc(t.title)}</h1>`,
      t.subtitle ? `      <h2>${esc(t.subtitle)}</h2>` : null,
      `      <p>${esc(description)}</p>`,
      `      <p><a href="/reverb/transmissions">Back to the archive</a></p>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

/* ------------------------------- other branded routes -------------------- */
// /paradoxxia, /char-gen and /meme used to get their social meta from the
// serve-index edge function via a rewrite. That proxy handed browsers HTML as
// plain text, so the rewrites are gone; these routes are pre-rendered instead.
// Values mirror each page's Helmet defaults, with the `metadata` table winning.

const staticRoutes = [
  {
    path: "/paradoxxia",
    prefix: "paradoxxia",
    title: "Paradoxxia | AI Character Generator & Multimedia Artist",
    description:
      "Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring an interactive character generator and AI-synthesized music on Spotify and Apple Music.",
    keywords:
      "Paradoxxia, パラドクシア, AI multimedia artist, AI character generator, Paradoxxia Spotify, Paradoxxia Apple Music, romergarcia, AI-synthesized music, cinematic sci-fi",
    image: `${SITE}/paradoxxia-og.jpg`,
    body: [
      "      <h1>Paradoxxia — AI-driven multimedia experience</h1>",
      "      <p>Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia, with AI-synthesized music on Spotify and Apple Music.</p>",
      '      <p><a href="/char-gen">Open the Paradoxxia AI character generator</a></p>',
    ].join("\n"),
  },
  {
    path: "/char-gen",
    prefix: "chargen",
    title: "Paradoxxia AI Character Generator | Free Sci-Fi Character Creator",
    description:
      "Create unique cinematic characters in the Paradoxxia sci-fi universe with AI-generated portraits, backstories, and stats. Free interactive web tool by Romer Garcia.",
    keywords:
      "AI character generator, Paradoxxia, sci-fi character creator, AI portrait generator, free character creator",
    image: `${SITE}/paradoxxia-og.jpg`,
    body: [
      "      <h1>Paradoxxia AI Character Generator</h1>",
      "      <p>Create cinematic characters in the Paradoxxia sci-fi universe with AI-generated portraits, backstories and stats.</p>",
      '      <p><a href="/paradoxxia">Back to Paradoxxia</a></p>',
    ].join("\n"),
  },
  {
    path: "/story",
    prefix: "story",
    title: "Paradoxxia Story | Roleplay an Encounter with Paradoxxia",
    description:
      "Step into the Cyber Boondocks and roleplay a live, AI-driven encounter with Paradoxxia — the android from Romer Garcia's dystopian sci-fi universe.",
    keywords:
      "Paradoxxia story, AI roleplay, interactive sci-fi story, Cyber Boondocks, AI character chat, Romer Garcia",
    image: `${SITE}/paradoxxia-og.jpg`,
    body: [
      "      <h1>Paradoxxia Story — roleplay an encounter</h1>",
      "      <p>Step into the Cyber Boondocks and roleplay a live, AI-driven encounter with Paradoxxia, the android from Romer Garcia's dystopian sci-fi universe.</p>",
      '      <p><a href="/paradoxxia">Back to Paradoxxia</a></p>',
    ].join("\n"),
  },
  {
    path: "/meme",
    prefix: "meme",
    title: "Romer Garcia | Dev Memes & Coding Wisdom 🚀💻",
    description:
      "Random developer memes, coding tips, and tech trivia curated by Romer Garcia. Refresh for a new one every time.",
    keywords:
      "developer memes, coding humor, programming jokes, tech tips, coding trivia, Romer Garcia, software engineering memes, developer life",
    body: [
      "      <h1>Dev memes and coding wisdom</h1>",
      "      <p>Random developer memes, coding tips, and tech trivia curated by Romer Garcia. Refresh for a new one every time.</p>",
    ].join("\n"),
  },
];

for (const r of staticRoutes) {
  const url = `${SITE}${r.path}`;
  writePage(
    r.path,
    head({
      title: m(`${r.prefix}.og_title`, m(`${r.prefix}.title`, r.title)),
      description: m(
        `${r.prefix}.og_description`,
        m(`${r.prefix}.description`, r.description),
      ),
      keywords: m(`${r.prefix}.keywords`, r.keywords),
      canonical: m(`${r.prefix}.og_url`, url),
      image: m(`${r.prefix}.og_image`, r.image),
    }),
    r.body,
  );
}

console.log("[prerender] done");
