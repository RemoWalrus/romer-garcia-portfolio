// Runs before `vite build` (prebuild hook); writes public/sitemap.xml.
// Static routes plus every Reverb character sheet and published transmission.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SITE, fetchCharacters, fetchTransmissions } from "./reverb-data.mjs";

const entries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/paradoxxia", changefreq: "weekly", priority: "0.9" },
  { path: "/reverb", changefreq: "weekly", priority: "0.8" },
  { path: "/char-gen", changefreq: "weekly", priority: "0.8" },
  { path: "/story", changefreq: "weekly", priority: "0.8" },
  { path: "/meme", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/reverb/transmissions", changefreq: "weekly", priority: "0.7" },
];

const characters = await fetchCharacters();
for (const c of characters) {
  // Skip hidden, locked and unfinished sheets — those render noindex.
  if (c.is_hidden || c.is_locked || c.has_profile === false) continue;
  entries.push({
    path: `/reverb/${c.id}`,
    changefreq: "monthly",
    priority: "0.6",
    lastmod: c.updated_at?.slice(0, 10),
  });
}

const transmissions = await fetchTransmissions();
for (const t of transmissions) {
  entries.push({
    path: `/reverb/transmissions/${t.slug}`,
    changefreq: "monthly",
    priority: "0.5",
    lastmod: (t.updated_at ?? t.published_at)?.slice(0, 10),
  });
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((e) =>
    [
      "  <url>",
      `    <loc>${SITE}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  "</urlset>",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), `${xml}\n`);
console.log(`sitemap.xml written (${entries.length} entries)`);
