import { getProxyUrl } from "@/utils/supabaseProxy";

export const reverbImage = (filename: string) => getProxyUrl("images", `reverb/${filename}`);

/** Tiny (320px) preview used for crew thumbnails — keeps navigation lightweight. */
export const reverbThumb = (id: string) => reverbImage(`reverb-char-${id}-thumb.webp`);

export interface ReverbCharacter {
  id: string;
  name: string;
  role: string;
  quote: string;
  caption: string;
  image: string;
  /** Full-body cutout used as the main figure on the character sheet. */
  figure?: string;
  accent: string;
  glow: string;
  /** Full character sheet available? Otherwise the profile shows "coming soon". */
  hasProfile: boolean;
  kanji?: string;
  title?: string;
  tagline?: string[];
  /** Dossier line items: label + value pairs. */
  identity?: { label: string; value: string }[];
  /** Discipline strip, e.g. "URBAN OPERATIVE // COLLECTIVE FOUNDER". */
  discipline?: string;
  notes?: string[];
  colorName?: string;
  specialties?: string[];
  palette?: string[];
  gear?: string[];
  overview?: string[];
  signOff?: string;
  closingQuote?: string;
}


export const CHARACTERS: ReverbCharacter[] = [
  {
    id: "reverb",
    name: "Reverb",
    role: "Founder / Leader",
    quote: "\u201cI don't follow the shadows. I am the gap between them.\u201d",
    caption: "From the streets to a brighter tomorrow.",
    image: reverbImage("reverb-char-reverb.webp"),
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.55)",
    hasProfile: true,
    title: "Reverb Collective // Founder",
    tagline: ["Reads cities.", "Recognizes people."],
    discipline: "Urban Operative // Collective Founder",
    identity: [
      { label: "Real Name", value: "Unknown" },
      { label: "Age", value: "Early 20s" },
      { label: "Origin", value: "Baltimore, Maryland" },
      { label: "Role", value: "Founder / Leader" },
      { label: "Affiliation", value: "Reverb Collective" },
    ],
    notes: [
      "CALM / INTUITIVE / ELUSIVE",
      "OBSERVANT AND STREET-SMART",
      "LEADS WITHOUT NEEDING AUTHORITY",
      "TRUSTS INSTINCT OVER SYSTEMS",
      "CREATES SPACE FOR OTHERS TO BELONG",
    ],
    colorName: "Purple",
    specialties: [
      "Parkour",
      "Urban Navigation",
      "Staff Combat",
      "Infiltration",
      "Improvisation",
    ],
    palette: ["#0a0a0c", "#170f22", "#a855f7", "#c99bff", "#f2f2f4"],
    gear: [
      "Optical Goggles",
      "Collapsible Staff",
      "Cross-Body Harness",
      "Fingerless Gloves",
      "Reverb Urban Kit",
    ],
    overview: [
      "Born in Baltimore, Reverb grew up reading cities as other people read maps—not simply as streets and buildings, but as interconnected spaces waiting to be explored.",
      "He becomes the center of an unconventional collective where art, music, technology, movement and urban exploration collide. Reverb isn't interested in commanding people. His talent is recognizing them.",
      "Spark, Harmonix, Eduq and eventually Wida are radically different people. Reverb gives them the space to become a family.",
    ],
    signOff: "DIFFERENT ROADS. SAME FREQUENCY. REVERB.",
    closingQuote: "\u201cI am the gap between them.\u201d",
  },
  {
    id: "spark",
    name: "Spark",
    role: "Demolitions / Close-Quarters / Runner",
    quote: "\u201cSame fire. Just louder.\u201d",
    caption: "People change worlds. Sometimes by just being them.",
    image: reverbImage("reverb-char-spark.webp"),
    figure: reverbImage("reverb-spark-main.webp"),
    accent: "#ff2e88",
    glow: "rgba(255,46,136,0.55)",
    hasProfile: true,
    kanji: "\u706b\u82b1",
    title: "Reverb Collective // Demolitions",
    tagline: ["Loud.", "Restless.", "First to move."],
    discipline: "Demolitions // Close-Quarters",
    identity: [
      { label: "Real Name", value: "Unknown" },
      { label: "Age", value: "19" },
      { label: "Origin", value: "Porvoo, Finland" },
      { label: "Role", value: "Demolitions / Close-Quarters / Runner" },
      { label: "Affiliation", value: "Reverb Collective" },
    ],
    notes: [
      "LOUD / IMPULSIVE / FEARLESS",
      "FIERCE AND PHYSICALLY POWERFUL",
      "PROTECTIVE OF HER PEOPLE",
      "THRIVES ON MOVEMENT AND RISK",
      "TURNS BEING DIFFERENT INTO IDENTITY",
    ],
    colorName: "Hot Pink",
    specialties: [
      "Demolitions",
      "Close-Quarters",
      "Parkour",
      "Strength",
      "Improvisation",
    ],
    palette: ["#0a0a0c", "#1d1116", "#ff2e88", "#ff6bb0", "#f2f2f4"],
    gear: [
      "Holographic Visor",
      "Demolition Kit",
      "Strap Harness",
      "Fingerless Gloves",
      "Signal-Pink Runners",
    ],
    overview: [
      "Born in Porvoo, Finland, Spark has always been impossible to overlook. Her albinism makes her visibly different; her personality makes disappearing into a crowd even less likely.",
      "She joins Reverb at sixteen and finds a collective where her intensity isn't something that needs to be corrected. By nineteen, Spark has become its kinetic heart—fearless, funny, fiercely loyal and usually moving before everyone else has finished discussing the plan.",
      "That same fearlessness will eventually lead to the accident that changes Spark, Eduq and the future of the Paradoxxiaverse.",
    ],
    signOff: "ONE SPARK. WHOLE CITY.",
    closingQuote: "\u201cIf it scares you, it's the right idea.\u201d",
  },
  {
    id: "harmonix",
    name: "Harmonix",
    role: "Strategist / Technology Specialist",
    quote: "\u201cHarmony is control. Control is freedom.\u201d",
    caption: "Systems link people. People make them matter.",
    image: reverbImage("reverb-char-harmonix.webp"),
    figure: reverbImage("reverb-harmonix-main.webp"),
    accent: "#0ea5e9",
    glow: "rgba(14,165,233,0.55)",
    hasProfile: true,
    kanji: "\u8abf\u548c\u8005",
    title: "Reverb Collective // Strategist",
    tagline: ["Control.", "Synchronize.", "Move together."],
    discipline: "Strategy // Tactical Technology",
    identity: [
      { label: "Real Name", value: "Lee Do-jun" },
      { label: "Age", value: "Early 20s" },
      { label: "Origin", value: "Seoul, South Korea" },
      { label: "Role", value: "Strategist / Technology Specialist" },
      { label: "Affiliation", value: "Reverb Collective" },
    ],
    notes: [
      "CALM / CALCULATED / PRECISE",
      "ALWAYS THINKING SEVERAL MOVES AHEAD",
      "EMOTIONALLY GUARDED",
      "LOYAL BUT DIFFICULT TO READ",
      "UNCOMFORTABLE WITH VARIABLES HE CANNOT CONTROL",
    ],
    colorName: "Electric Blue",
    specialties: [
      "Strategy",
      "Surveillance",
      "Martial Arts",
      "Infiltration",
      "Tactical Technology",
    ],
    palette: ["#0d0d0f", "#1a1f2b", "#5a616b", "#0ea5e9", "#38bdf8", "#dbe6f5"],
    gear: [
      "HUD Visor",
      "Respirator",
      "Tactical Electronics",
      "Infiltration Kit",
      "Full Ninja Configuration",
    ],
    overview: [
      "Born in Seoul into the orbit of a powerful technology dynasty, Lee Do-jun grew up surrounded by resources, expectations and control.",
      "Reverb offers something different.",
      "As Harmonix, Do-jun becomes the collective's strategist—the person who turns reckless ideas into executable plans. His precision makes him the natural counterweight to Spark's impulsiveness and Reverb's instinctive leadership.",
      "But the same family connections that make Harmonix invaluable to Reverb will eventually help give Eduq an opportunity that changes both men's lives.",
    ],
    signOff: "DIFFERENT ROADS. SAME FREQUENCY. REVERB.",
    closingQuote: "\u201cEvery move is in sync.\u201d",
  },
  {
    id: "eduq",
    name: "Eduq",
    role: "Hacker / Engineer / Infiltration Specialist",
    quote: "\u201cInformation is freedom. Control is survival.\u201d",
    caption: "Tradition meets tomorrow. Same places. Different times.",
    image: reverbImage("reverb-char-eduq.webp"),
    figure: reverbImage("reverb-eduq-main.webp"),
    accent: "#b6f13b",
    glow: "rgba(182,241,59,0.55)",
    hasProfile: true,
    title: "Reverb Collective // Engineer",
    tagline: ["Quiet.", "Curious.", "Always building."],
    discipline: "Hacking // Experimental Technology",
    identity: [
      { label: "Real Name", value: "Eduardo Quispe" },
      { label: "Age", value: "18" },
      { label: "Origin", value: "Potos\u00ed, Bolivia" },
      { label: "Role", value: "Hacker / Engineer / Infiltration Specialist" },
      { label: "Affiliation", value: "Reverb Collective" },
    ],
    notes: [
      "QUIET / CURIOUS / OBSERVANT",
      "SEES PATTERNS OTHERS MISS",
      "DRY, UNDERSTATED HUMOR",
      "OBSESSIVE PROBLEM SOLVER",
      "TREATS TECHNICAL LIMITATIONS AS TEMPORARY",
    ],
    colorName: "Acid Lime",
    specialties: [
      "Hacking",
      "Electronics",
      "Engineering",
      "Infiltration",
      "Experimental Technology",
    ],
    palette: ["#0a0c07", "#161c10", "#b6f13b", "#d8ff8a", "#eef0e6"],
    gear: [
      "Andean Chulo",
      "Modified Laptop",
      "Portable Hacking Rig",
      "Custom Electronics",
      "Bolivian Textile Details",
    ],
    overview: [
      "Born in Potos\u00ed, Bolivia, Eduardo Quispe immigrates to the United States at ten. By eighteen, the quiet teenager everyone calls Eduq has developed an extraordinary ability to understand—and dismantle—technological systems.",
      "Reverb gives that ability somewhere to grow.",
      "Initially, Eduq is simply the collective's unusually gifted hacker and engineer. Then Spark's accident presents him with a problem existing technology cannot solve.",
      "Instead of accepting that limitation, Eduq begins inventing what doesn't yet exist.",
      "That decision will eventually change the world.",
    ],
    signOff: "SAME CREW. DIFFERENT TIMES.",
    closingQuote: "\u201cLimitations are just temporary.\u201d",
  },
  {
    id: "wida",
    name: "Wida",
    role: "Temporal Traveler / Connector",
    quote: "\u201cTime isn't a line. It's a crew.\u201d",
    caption: "Same frequency. Louder together.",
    image: reverbImage("reverb-char-wida.webp"),
    figure: reverbImage("reverb-wida-main.webp"),
    accent: "#2dd4bf",
    glow: "rgba(45,212,191,0.55)",
    hasProfile: true,
    kanji: "\u6642\u9593\u65c5\u4eba",
    title: "Reverb Collective // Time Traveler",
    tagline: ["Different times.", "Same people."],
    discipline: "Time Traveler // Connector",
    identity: [
      { label: "Real Name", value: "Withaya \u201cWida\u201d" },
      { label: "Age", value: "19" },
      { label: "Origin", value: "Bangkok, Thailand" },
      { label: "Timeline", value: "Alternate" },
      { label: "Role", value: "Temporal Traveler / Connector" },
      { label: "Affiliation", value: "Reverb Collective" },
    ],
    notes: [
      "OPTIMISTIC / CURIOUS / ADAPTABLE",
      "COLLECTS MOMENTS, NOT THINGS",
      "MUSIC KEEPS HER GROUNDED",
      "OBSERVES BEFORE INTERFERING",
      "DESPERATELY WANTS TO BELONG WITHOUT CHANGING HISTORY",
    ],
    colorName: "Turquoise",
    specialties: [
      "Temporal Awareness",
      "Adaptation",
      "Observation",
      "Cultural Fluency",
      "Survival",
    ],
    palette: ["#c8434c", "#a855f7", "#151515", "#d5d7dc", "#2dd4bf"],
    gear: [
      "Vintage Music Player",
      "Wired Earphones",
      "Temporal Watch",
      "Modular Backpack",
      "Ragdoll Charm",
    ],
    overview: [
      "Wida is from Bangkok.",
      "Just not this Bangkok.",
      "An accidental temporal displacement pulls nineteen-year-old Wida from an earlier period of a completely different timeline and deposits her in Reverb's world.",
      "She understands enough about what has happened to know that interfering could be dangerous. Her solution is to remain in the background, observe and leave as little impact as possible.",
      "Then she meets Reverb.",
      "She joins the collective before Eduq arrives, grows particularly close to Spark, and remains through the accident and recovery—slowly discovering that avoiding history is much easier than avoiding attachment.",
    ],
    signOff: "SOMEWHERE. SOMETIME. WE'RE STILL REVERB.",
    closingQuote: "\u201cTime isn't a line. It's a crew.\u201d",
  },
];

export const getCharacter = (id?: string) =>
  CHARACTERS.find((c) => c.id === id?.toLowerCase());
