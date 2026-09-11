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
    metadata[`reverb.${c.id}.description`] ??
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

console.log("[prerender] done");
