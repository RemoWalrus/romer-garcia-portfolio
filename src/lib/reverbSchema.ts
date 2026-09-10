import type { ReverbCharacter } from "@/data/reverbCharacters";

const SITE = "https://romergarcia.com";

const identity = (c: ReverbCharacter, label: string) =>
  c.identity?.find((r) => r.label.toLowerCase() === label.toLowerCase())?.value;

export const reverbUrl = (path = "") => `${SITE}/reverb${path}`;

/**
 * Structured data for a single Reverb character sheet so search engines and
 * AI crawlers can index the dossier content (identity, role, gear, overview).
 */
export function characterSchema(c: ReverbCharacter) {
  const url = reverbUrl(`/${c.id}`);
  const realName = identity(c, "Real Name");
  const origin = identity(c, "Origin");
  const description = (c.overview ?? []).join(" ") || `${c.name} — ${c.role}.`;

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${url}#person`,
    name: c.name,
    ...(realName && realName.toLowerCase() !== "unknown" && realName !== c.name
      ? { alternateName: realName }
      : {}),
    jobTitle: c.discipline ?? c.role,
    description,
    image: c.figure ?? c.image,
    url,
    ...(origin ? { homeLocation: { "@type": "Place", name: origin } } : {}),
    ...(c.specialties?.length ? { knowsAbout: c.specialties } : {}),
    memberOf: {
      "@type": "Organization",
      "@id": `${reverbUrl()}#collective`,
      name: "Reverb Collective",
      url: reverbUrl(),
    },
    subjectOf: {
      "@type": "CreativeWork",
      name: "Reverb",
      description:
        "Multimedia franchise following five outsiders who turn sound into resistance.",
      url: reverbUrl(),
    },
  };

  return {
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
      person,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Reverb", item: reverbUrl() },
          { "@type": "ListItem", position: 3, name: c.name, item: url },
        ],
      },
    ],
  };
}

/** Structured data for the Reverb landing page: the franchise plus its roster. */
export function rosterSchema(characters: ReverbCharacter[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWorkSeries",
        "@id": `${reverbUrl()}#franchise`,
        name: "Reverb",
        alternateName: "Reverb Collective",
        url: reverbUrl(),
        description:
          "Reverb is a multimedia franchise following five outsiders who turn sound into resistance.",
        genre: ["Science Fiction", "Cyberpunk", "Multimedia"],
        author: { "@type": "Person", name: "Romer Garcia", url: SITE },
        character: characters.map((c) => ({
          "@type": "Person",
          name: c.name,
          jobTitle: c.discipline ?? c.role,
          url: reverbUrl(`/${c.id}`),
          image: c.image,
        })),
      },
      {
        "@type": "ItemList",
        name: "Reverb Collective members",
        itemListElement: characters.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          description: c.discipline ?? c.role,
          url: reverbUrl(`/${c.id}`),
        })),
      },
    ],
  };
}
