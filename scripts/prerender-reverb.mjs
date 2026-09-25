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
  fetchDownloads,
  fetchFaq,
  fetchMetadata,
  fetchTransmissions,
  imageUrl,
} from "./reverb-data.mjs";
import { REVERB_FAQ } from "./reverb-faq.mjs";

const REVERB_TYPEKIT_SCRIPT = `<script>
      (function(d) {
        var config = {
          kitId: 'rol4qcd',
          scriptTimeout: 3000,
          async: true
        },
        h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
      })(document);
    </script>`;


const DIST = resolve("dist");
const shellPath = resolve(DIST, "index.html");
if (!existsSync(shellPath)) {
  console.warn("[prerender] dist/index.html missing — skipping");
  process.exit(0);
}
const shell = readFileSync(shellPath, "utf8");

const [characters, transmissions, metadata, faq, downloads] = await Promise.all([
  fetchCharacters(),
  fetchTransmissions(),
  fetchMetadata(),
  fetchFaq(REVERB_FAQ),
  fetchDownloads(),
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
    .replace(/\n\s*<meta name="twitter:[^>]*>/g, "")
    // drop the shell's site-wide JSON-LD (Romer Garcia Person/WebSite) so each
    // route's rich result is about that route — Reverb for /reverb, Paradoxxia
    // for /paradoxxia — not the homepage entity
    .replace(/\n\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");

  const icons = brandIcons(route);
  if (icons) {
    html = html
      .replace(/\n\s*<link rel="shortcut icon"[^>]*>/g, "")
      .replace(/\n\s*<link rel="icon"[^>]*>/g, "")
      .replace(/\n\s*<link rel="apple-touch-icon(-precomposed)?"[^>]*>/g, "")
      .replace("</head>", `${icons}\n  </head>`);
  }

  if (route === "/reverb" || route.startsWith("/reverb/")) {
    html = html.replace(
      /<!-- Adobe Fonts \(Typekit\)[\s\S]*?<\/script>/,
      REVERB_TYPEKIT_SCRIPT,
    );
  }

  html = html.replace("</head>", `${headHtml}\n  </head>`);
  // The shell's root div may contain the homepage's visually hidden H1; replace
  // the whole element so each route ships only its own crawlable text.
  const rootRe = /<div id="root">[\s\S]*?<\/div>/;
  const rootReplacement = `<div id="root"></div>\n    <noscript>\n${bodyHtml}\n    </noscript>`;
  if (rootRe.test(html)) {
    html = html.replace(rootRe, rootReplacement);
  } else {
    throw new Error(`[prerender] root div not found in shell for ${route}`);
  }

  // Write `<route>.html`, not `<route>/index.html`: a directory index makes
  // Netlify 301 /reverb -> /reverb/, which mismatches the canonical and the
  // sitemap and makes Search Console report "Page with redirect".
  const out = resolve(DIST, `${route.replace(/^\//, "")}.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`[prerender] ${route}`);
}

/** Breadcrumbs are one of the few rich-result types this content is eligible for. */
function breadcrumbs(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, item], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item,
    })),
  };
}

// Profile Page rich results want creation/modification dates on the page node.
const PROFILE_CREATED = "2026-08-01T00:00:00Z";
const PROFILE_MODIFIED = new Date().toISOString();

const visible = characters.filter((c) => !c.is_hidden);
const indexable = visible.filter((c) => !c.is_locked && c.has_profile !== false);

/* ---------------------------------------------------------------- /reverb */

const rosterJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      // ProfilePage (mainEntity = the Collective organisation) so Google's
      // Profile Page rich result resolves on this route.
      "@type": ["ProfilePage", "WebPage"],
      "@id": `${SITE}/reverb`,
      url: `${SITE}/reverb`,
      name: "Reverb | Paradoxxia Universe Multimedia Franchise",
      description: REVERB_DESC,
      inLanguage: "en",
      dateCreated: PROFILE_CREATED,
      dateModified: PROFILE_MODIFIED,
      primaryImageOfPage: imageUrl(visible[0]?.image_file),
      mainEntity: { "@id": `${SITE}/reverb#collective` },
      about: { "@id": `${SITE}/reverb#franchise` },
      isPartOf: { "@type": "WebSite", url: SITE, name: "Romer Garcia" },
    },
    {
      "@type": "CreativeWorkSeries",
      "@id": `${SITE}/reverb#franchise`,
      name: "Reverb",
      alternateName: "Reverb Collective",
      url: `${SITE}/reverb`,
      description: REVERB_DESC,
      image: indexable.map((c) => imageUrl(c.image_file)).filter(Boolean),
      genre: ["Science Fiction", "Cyberpunk", "Multimedia"],
      inLanguage: "en",
      author: { "@type": "Person", name: "Romer Garcia", url: SITE },
      creator: { "@type": "Person", name: "Romer Garcia", url: SITE },
      publisher: { "@id": `${SITE}/reverb#collective` },
      isPartOf: {
        "@type": "CreativeWorkSeries",
        name: "Paradoxxia",
        url: `${SITE}/paradoxxia`,
      },
      character: indexable.map((c) => ({ "@id": `${SITE}/reverb/${c.id}#person` })),
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/reverb#collective`,
      name: "Reverb Collective",
      url: `${SITE}/reverb`,
      description: "The Reverb Collective — the ensemble at the centre of the Reverb franchise.",
      image: indexable.map((c) => imageUrl(c.image_file)).filter(Boolean),
      mainEntityOfPage: { "@id": `${SITE}/reverb` },
      founder: { "@type": "Person", name: "Romer Garcia", url: SITE },
      member: indexable.map((c) => ({ "@id": `${SITE}/reverb/${c.id}#person` })),
    },
    ...indexable.map((c) => ({
      "@type": "Person",
      "@id": `${SITE}/reverb/${c.id}#person`,
      name: c.name,
      jobTitle: c.discipline ?? c.role,
      url: `${SITE}/reverb/${c.id}`,
      image: imageUrl(c.image_file),
      memberOf: { "@id": `${SITE}/reverb#collective` },
    })),
    {
      "@type": "FAQPage",
      "@id": `${SITE}/reverb#faq`,
      isPartOf: { "@id": `${SITE}/reverb` },
      about: { "@id": `${SITE}/reverb#franchise` },
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    breadcrumbs([
      ["Home", SITE],
      ["Reverb", `${SITE}/reverb`],
    ]),
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
    `      <h2>Frequently Asked</h2>`,
    "      <dl>",
    ...faq.flatMap((item) => [
      `        <dt>${esc(item.q)}</dt>`,
      `        <dd>${esc(item.a)}</dd>`,
    ]),
    "      </dl>",
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
            "@type": ["ProfilePage", "WebPage"],
            "@id": url,
            url,
            name: `${c.name} | Reverb Collective`,
            description,
            inLanguage: "en",
            dateCreated: PROFILE_CREATED,
            dateModified: PROFILE_MODIFIED,
            primaryImageOfPage: imageUrl(c.figure_file ?? c.image_file),
            mainEntity: { "@id": `${url}#person` },
            about: { "@id": `${url}#person` },
            isPartOf: { "@id": `${SITE}/reverb#franchise` },
          },
          {
            "@type": "Person",
            "@id": `${url}#person`,
            name: c.name,
            jobTitle: c.discipline ?? c.role,
            description,
            image: imageUrl(c.figure_file ?? c.image_file),
            url,
            ...(c.origin ? { homeLocation: { "@type": "Place", name: c.origin } } : {}),
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
            "@id": `${url}#sheet`,
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
      image: imageUrl(c.figure_file ?? c.image_file),
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
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${SITE}/reverb/transmissions`,
          name: "Reverb // Transmissions",
          url: `${SITE}/reverb/transmissions`,
          description:
            "The Reverb transmission archive: artwork, recovered documents, character lore and anomalies from the Paradoxxia universe.",
          inLanguage: "en",
          isPartOf: { "@id": `${SITE}/reverb#franchise` },
          about: { "@id": `${SITE}/reverb#franchise` },
          hasPart: transmissions.map((t) => ({
            "@type": "WebPage",
            name: t.title,
            url: `${SITE}/reverb/transmissions/${t.slug}`,
          })),
        },
        {
          "@type": "CreativeWorkSeries",
          "@id": `${SITE}/reverb#franchise`,
          name: "Reverb",
          url: `${SITE}/reverb`,
          description: REVERB_DESC,
        },
        breadcrumbs([
          ["Home", SITE],
          ["Reverb", `${SITE}/reverb`],
          ["Transmissions", `${SITE}/reverb/transmissions`],
        ]),
      ],
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
        "@graph": [
          {
            "@type": "Article",
            "@id": `${url}#article`,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            headline: t.title.slice(0, 110),
            alternativeHeadline: t.subtitle ?? undefined,
            description,
            image: t.cover_image_url ? [t.cover_image_url] : undefined,
            url,
            datePublished: t.published_at,
            dateModified: t.updated_at ?? t.published_at,
            inLanguage: "en",
            author: { "@type": "Person", name: "Romer Garcia", url: SITE },
            publisher: {
              "@type": "Organization",
              name: "Romer Garcia",
              url: SITE,
              logo: { "@type": "ImageObject", url: `${SITE}/favicon-512.png` },
            },
            isPartOf: { "@id": `${SITE}/reverb#franchise` },
            about: { "@id": `${SITE}/reverb#franchise` },
            articleSection: "Reverb // Transmissions",
          },
          {
            "@type": "CreativeWorkSeries",
            "@id": `${SITE}/reverb#franchise`,
            name: "Reverb",
            url: `${SITE}/reverb`,
            description: REVERB_DESC,
          },
          breadcrumbs([
            ["Home", SITE],
            ["Reverb", `${SITE}/reverb`],
            ["Transmissions", `${SITE}/reverb/transmissions`],
            [t.title, url],
          ]),
        ],
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

/* --------------------------------------------------- /reverb/downloads */

{
  const url = `${SITE}/reverb/downloads`;
  const description = m(
    "reverb.downloads.description",
    "Free Reverb wallpapers and posters for Collective members — desktop and phone backgrounds plus printable artwork, with a waiting list for printed posters.",
  );
  const categories = [...new Set(downloads.map((d) => d.category))];
  writePage(
    "/reverb/downloads",
    head({
      title: m("reverb.downloads.title", "Free Downloads — Wallpapers & Posters | Reverb"),
      description,
      keywords: m(
        "reverb.downloads.keywords",
        "Reverb downloads, Reverb wallpapers, Reverb posters, Paradoxxia universe, free desktop wallpaper, phone wallpaper",
      ),
      canonical: url,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": url,
            name: "Reverb Downloads — Wallpapers & Posters",
            url,
            description,
            inLanguage: "en",
            isPartOf: { "@id": `${SITE}/reverb#franchise` },
            about: { "@id": `${SITE}/reverb#franchise` },
            hasPart: downloads.map((d) => ({
              "@type": "WebPage",
              name: d.title,
              url,
            })),
          },
          {
            "@type": "CreativeWorkSeries",
            "@id": `${SITE}/reverb#franchise`,
            name: "Reverb",
            url: `${SITE}/reverb`,
            description: REVERB_DESC,
          },
          breadcrumbs([
            ["Home", SITE],
            ["Reverb", `${SITE}/reverb`],
            ["Downloads", url],
          ]),
        ],
      },
    }),
    [
      "      <h1>Reverb Downloads — Wallpapers &amp; Posters</h1>",
      `      <p>${esc(description)}</p>`,
      "      <p>The vault is free for members of the Collective. Sign in with the email you joined with to download.</p>",
      ...categories.flatMap((cat) => [
        `      <h2>${esc(cat)}</h2>`,
        "      <ul>",
        ...downloads
          .filter((d) => d.category === cat)
          .map(
            (d) =>
              `        <li>${esc(d.title)}${d.size_label ? ` (${esc(d.size_label)})` : ""}${
                d.description ? ` — ${esc(d.description)}` : ""
              }</li>`,
          ),
        "      </ul>",
      ]),
      '      <p><a href="/reverb">Back to the Reverb Collective</a></p>',
    ].join("\n"),
  );
}

/* ------------------------------- other branded routes -------------------- */
// /paradoxxia, /char-gen and /meme used to get their social meta from the
// serve-index edge function via a rewrite. That proxy handed browsers HTML as
// plain text, so the rewrites are gone; these routes are pre-rendered instead.
// Values mirror each page's Helmet defaults, with the `metadata` table winning.

const PARADOXXIA_CREATOR = {
  "@type": "Person",
  name: "Romer Garcia",
  url: SITE,
  jobTitle: "Design Lead & AI-Driven Multimedia Strategist",
};
const PARADOXXIA_SAME_AS = [
  "https://open.spotify.com/artist/11NJVIZgdYbPyz9igDKTBr",
  "https://music.apple.com/us/artist/paradoxxia/1803632666",
];
const paradoxxiaMusicGroup = {
  "@type": "MusicGroup",
  "@id": `${SITE}/paradoxxia#artist`,
  name: "Paradoxxia",
  alternateName: "パラドクシア",
  description:
    "Paradoxxia is an AI-synthesized multimedia artist and character entity created by Romer Garcia, blending cinematic sci-fi storytelling with AI-generated electronic music.",
  url: `${SITE}/paradoxxia`,
  mainEntityOfPage: { "@id": `${SITE}/paradoxxia` },
  image: `${SITE}/paradoxxia-og.jpg`,
  logo: `${SITE}/paradoxxia-og.jpg`,
  sameAs: PARADOXXIA_SAME_AS,
  founder: PARADOXXIA_CREATOR,
  foundingLocation: { "@type": "Place", name: "The Cyber Boondocks" },
  genre: ["Electronic", "AI-Generated", "Cinematic", "Sci-Fi Soundtrack"],
  subjectOf: {
    "@type": "CreativeWorkSeries",
    name: "Reverb",
    url: `${SITE}/reverb`,
  },
};

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
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        paradoxxiaMusicGroup,
        {
          "@type": ["ProfilePage", "WebPage"],
          "@id": `${SITE}/paradoxxia`,
          url: `${SITE}/paradoxxia`,
          name: "Paradoxxia | AI Multimedia Artist & Music",
          dateCreated: PROFILE_CREATED,
          dateModified: PROFILE_MODIFIED,
          description:
            "Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring AI-synthesized music on Spotify and Apple Music and an interactive character generator.",
          inLanguage: "en",
          primaryImageOfPage: `${SITE}/paradoxxia-og.jpg`,
          isPartOf: { "@type": "WebSite", name: "Romer Garcia Portfolio", url: SITE },
          author: PARADOXXIA_CREATOR,
          mainEntity: { "@id": `${SITE}/paradoxxia#artist` },
          about: { "@id": `${SITE}/paradoxxia#artist` },
        },
        breadcrumbs([
          ["Home", SITE],
          ["Paradoxxia", `${SITE}/paradoxxia`],
        ]),
      ],
    },
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
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${SITE}/char-gen`,
          url: `${SITE}/char-gen`,
          name: "Paradoxxia AI Character Generator",
          description:
            "Create unique cinematic characters in the Paradoxxia sci-fi universe with AI-generated portraits, backstories, and stats.",
          inLanguage: "en",
          isPartOf: { "@type": "WebSite", name: "Romer Garcia Portfolio", url: SITE },
          mainEntity: { "@id": `${SITE}/char-gen#app` },
          about: { "@id": `${SITE}/char-gen#app` },
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${SITE}/char-gen#app`,
          name: "Paradoxxia AI Character Generator",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Web",
          url: `${SITE}/char-gen`,
          image: `${SITE}/paradoxxia-og.jpg`,
          description:
            "An interactive AI character generator set in the Paradoxxia sci-fi universe. Create unique characters with cinematic portraits, backstories, and stats.",
          featureList: [
            "Visual Synthesis",
            "AI Lore Generation",
            "Photo Reference Upload",
            "Character Stats Generation",
          ],
          author: PARADOXXIA_CREATOR,
          creator: PARADOXXIA_CREATOR,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          isPartOf: { "@id": `${SITE}/paradoxxia#artist` },
        },
        paradoxxiaMusicGroup,
        breadcrumbs([
          ["Home", SITE],
          ["Paradoxxia", `${SITE}/paradoxxia`],
          ["Character Generator", `${SITE}/char-gen`],
        ]),
      ],
    },
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
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${SITE}/story`,
          url: `${SITE}/story`,
          name: "Paradoxxia Story | Roleplay an Encounter with Paradoxxia",
          description:
            "Step into the Cyber Boondocks and roleplay a live, AI-driven encounter with Paradoxxia — the android from Romer Garcia's dystopian sci-fi universe.",
          inLanguage: "en",
          primaryImageOfPage: `${SITE}/paradoxxia-og.jpg`,
          isPartOf: { "@type": "WebSite", name: "Romer Garcia Portfolio", url: SITE },
          mainEntity: { "@id": `${SITE}/paradoxxia#artist` },
          author: PARADOXXIA_CREATOR,
          about: { "@id": `${SITE}/paradoxxia#artist` },
        },
        paradoxxiaMusicGroup,
        breadcrumbs([
          ["Home", SITE],
          ["Paradoxxia", `${SITE}/paradoxxia`],
          ["Story", `${SITE}/story`],
        ]),
      ],
    },
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
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${SITE}/meme`,
          url: `${SITE}/meme`,
          name: "Romer Garcia | Dev Memes & Coding Wisdom",
          description:
            "Random developer memes, coding tips, and tech trivia curated by Romer Garcia. Refresh for a new one every time.",
          inLanguage: "en",
          isPartOf: { "@type": "WebSite", name: "Romer Garcia Portfolio", url: SITE },
          author: { "@type": "Person", name: "Romer Garcia", url: SITE },
        },
        breadcrumbs([
          ["Home", SITE],
          ["Dev Memes", `${SITE}/meme`],
        ]),
      ],
    },
    body: [
      "      <h1>Dev memes and coding wisdom</h1>",
      "      <p>Random developer memes, coding tips, and tech trivia curated by Romer Garcia. Refresh for a new one every time.</p>",
    ].join("\n"),
  },
  {
    path: "/links",
    prefix: "links",
    title: "Romer Garcia — All Links",
    description:
      "Every Romer Garcia destination in one place — portfolio, Reverb, Paradoxxia, the Paradoxxia AI character generator and dev memes, plus social profiles.",
    keywords:
      "Romer Garcia, links, link in bio, portfolio, Reverb, Paradoxxia, AI character generator, dev memes, social profiles",
    image: `${SITE}/og-image.png`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ProfilePage",
          "@id": `${SITE}/links`,
          url: `${SITE}/links`,
          name: "Romer Garcia — All Links",
          description:
            "Every Romer Garcia destination in one place — portfolio, Reverb, Paradoxxia, the AI character generator and dev memes, plus social profiles.",
          inLanguage: "en",
          dateCreated: PROFILE_CREATED,
          dateModified: PROFILE_MODIFIED,
          isPartOf: { "@type": "WebSite", name: "Romer Garcia Portfolio", url: SITE },
          primaryImageOfPage: `${SITE}/og-image.png`,
          mainEntity: {
            "@type": "Person",
            "@id": `${SITE}#person`,
            name: "Romer Garcia",
            url: SITE,
            image:
              "https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1/download-file?bucket=profile&file=RomerSelfPortrait.jpg",
            jobTitle: "Design Lead & AI-Driven Multimedia Strategist",
            description:
              "Design Lead and AI-driven multimedia strategist; creator of the Reverb franchise and the AI-synthesized artist Paradoxxia.",
            sameAs: [
              "https://www.linkedin.com/in/romer-garcia/",
              "https://www.youtube.com/@romergarcia",
              "https://www.instagram.com/remowalrus/",
              "https://www.dvidshub.net/portfolio/1674800/romer-garcia",
            ],
          },
          about: { "@id": `${SITE}#person` },
          author: { "@id": `${SITE}#person` },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/links` },
          significantLink: [
            SITE,
            `${SITE}/reverb`,
            `${SITE}/paradoxxia`,
            `${SITE}/char-gen`,
            `${SITE}/meme`,
          ],
        },
        {
          "@type": "ItemList",
          "@id": `${SITE}/links#destinations`,
          name: "Romer Garcia destinations",
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: 5,
          itemListElement: [
            ["Portfolio", SITE, "Selected work and case studies"],
            ["Reverb", `${SITE}/reverb`, "Multimedia franchise — meet the Collective"],
            [
              "Paradoxxia",
              `${SITE}/paradoxxia`,
              "AI-synthesized music and multimedia artist",
            ],
            [
              "Character Generator",
              `${SITE}/char-gen`,
              "Create cinematic sci-fi characters with AI",
            ],
            ["Dev Memes", `${SITE}/meme`, "A new developer meme every refresh"],
          ].map(([name, url, description], i) => ({
            "@type": "ListItem",
            position: i + 1,
            name,
            url,
            description,
          })),
        },
        breadcrumbs([
          ["Home", SITE],
          ["Links", `${SITE}/links`],
        ]),
      ],
    },
    body: [
      "      <h1>romergarcia</h1>",
      "      <p>Romer Garcia — Design Lead &amp; AI-Driven Multimedia Strategist. Every destination in one place:</p>",
      "      <ul>",
      '        <li><a href="/">Portfolio</a> — selected work &amp; case studies</li>',
      '        <li><a href="/reverb">Reverb</a> — multimedia franchise, meet the Collective</li>',
      '        <li><a href="/paradoxxia">Paradoxxia</a> — AI-synthesized music &amp; multimedia artist</li>',
      '        <li><a href="/char-gen">Character Generator</a> — create cinematic sci-fi characters with AI</li>',
      '        <li><a href="/meme">Dev Memes</a> — a new one every refresh</li>',
      "      </ul>",
      '      <p>Social: <a href="https://www.linkedin.com/in/romer-garcia/">LinkedIn</a>, <a href="https://www.instagram.com/remowalrus/">Instagram</a>, <a href="https://www.youtube.com/@romergarcia">YouTube</a></p>',
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
      jsonLd: r.jsonLd,
    }),
    r.body,
  );
}

console.log("[prerender] done");
