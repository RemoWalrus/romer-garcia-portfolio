import reverbImg from "@/assets/reverb-char-reverb.png.asset.json";
import sparkImg from "@/assets/reverb-char-spark.png.asset.json";
import harmonixImg from "@/assets/reverb-char-harmonix.png.asset.json";
import eduqImg from "@/assets/reverb-char-eduq.png.asset.json";
import widaImg from "@/assets/reverb-char-wida.png.asset.json";
import sparkFigure from "@/assets/reverb-spark-main.png.asset.json";
import harmonixFigure from "@/assets/reverb-harmonix-main.png.asset.json";
import widaFigure from "@/assets/reverb-wida-main.png.asset.json";

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
  notes?: string[];
  palette?: string[];
  gear?: string[];
  signOff?: string;
  closingQuote?: string;
}


export const CHARACTERS: ReverbCharacter[] = [
  {
    id: "reverb",
    name: "Reverb",
    role: "Music Producer // Visionary",
    quote: "\u201cFeel it. Create it. Move it.\u201d",
    caption: "From the streets to a brighter tomorrow.",
    image: reverbImg.url,
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.55)",
    hasProfile: false,
  },
  {
    id: "spark",
    name: "Spark",
    role: "Idea Generator // Creative Lead",
    quote: "\u201cBig ideas start with a spark.\u201d",
    caption: "People change worlds. Sometimes by just being them.",
    image: sparkImg.url,
    figure: sparkFigure.url,
    accent: "#ff2e88",
    glow: "rgba(255,46,136,0.55)",
    hasProfile: true,
    kanji: "\u706b\u82b1",
    title: "Reverb Collective // Idea Generator",
    tagline: ["Loud.", "Restless.", "First to move."],
    notes: [
      "IDEA GENERATOR",
      "IMPULSIVE. FEARLESS.",
      "STARTS WHAT OTHERS FINISH",
      "TURNS NOISE INTO ENERGY",
      "SPEAKS BEFORE SHE THINKS",
      "BELIEVES IN MOMENTUM",
      "NO PLAN, ONLY DIRECTION",
      "SAME CREW. DIFFERENT TIMES.",
    ],
    palette: ["#0a0a0c", "#1d1116", "#ff2e88", "#ff6bb0", "#f2f2f4"],
    gear: [
      "Strap harness rig",
      "Fingerless tape gloves",
      "SPRK cargo panels",
      "Reverb sling straps",
      "Signal-pink runners",
    ],
    signOff: "ONE SPARK. WHOLE CITY.",
    closingQuote: "\u201cIf it scares you, it's the right idea.\u201d",
  },
  {
    id: "harmonix",
    name: "Harmonix",
    role: "Community Builder // Strategist",
    quote: "\u201cDifferent voices. Stronger together.\u201d",
    caption: "Systems link people. People make them matter.",
    image: harmonixImg.url,
    figure: harmonixFigure.url,
    accent: "#2f8cff",
    glow: "rgba(47,140,255,0.55)",
    hasProfile: true,
    kanji: "\u8abf\u548c\u8005",
    title: "Reverb Collective // Strategist",
    tagline: ["Control.", "Synchronize.", "Move together."],
    notes: [
      "STRATEGIST",
      "CALM. CALCULATED.",
      "SEES THE BIGGER PICTURE",
      "TURNS CHAOS INTO RHYTHM",
      "CONNECTS PEOPLE",
      "THROUGH MOVEMENT",
      "BELIEVES IN SYNCHRONY",
      "EVERY MOVE HAS A TIME",
      "SAME CREW. DIFFERENT TIMES.",
    ],
    palette: ["#0d0d0f", "#1a1f2b", "#5a616b", "#12439e", "#3aa0ff", "#dbe6f5"],
    gear: [
      "Tactical backpack",
      "Signal visor",
      "Segmented face mask",
      "Utility straps + clips",
      "Reverb lanyard",
      "R-series trainers",
    ],
    signOff: "DIFFERENT ROADS. SAME FREQUENCY. REVERB.",
    closingQuote: "\u201cEvery move is in sync.\u201d",
  },
  {
    id: "eduq",
    name: "Eduq",
    role: "Infiltration Specialist // Tech",
    quote: "\u201cInformation is freedom. Control is survival.\u201d",
    caption: "Tradition meets tomorrow. Same places. Different times.",
    image: eduqImg.url,
    accent: "#b6f13b",
    glow: "rgba(182,241,59,0.55)",
    hasProfile: false,
  },
  {
    id: "wida",
    name: "Wida",
    role: "Time Traveler // Impact Lead",
    quote: "\u201cA kinder, brighter world is possible.\u201d",
    caption: "Same frequency. Louder together.",
    image: widaImg.url,
    figure: widaFigure.url,
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.55)",
    hasProfile: true,
    kanji: "\u6642\u9593\u65c5\u4eba",
    title: "Reverb Collective // Time Traveler",
    tagline: ["Different times.", "Same people."],
    notes: [
      "TIME TRAVELER",
      "OPTIMISTIC",
      "KEEPS US GROUNDED",
      "COLLECTS PEOPLE,",
      "MEMORIES, MOMENTS",
      "SEES THE BIGGER PICTURE",
      "ALWAYS BRINGS",
      "A PIECE OF HOME",
    ],
    palette: ["#c8434c", "#a855f7", "#151515", "#d5d7dc", "#7fcfc4"],
    gear: [
      "Hourglass backpack",
      "Rag doll charm",
      "Chrono wristwatch",
      "Purple strap rings",
      "Grid cargo pants",
    ],
    signOff: "SOMEWHERE. SOMETIME. WE'RE STILL REVERB.",
    closingQuote: "\u201cTime isn't a line. It's a crew.\u201d",
  },
];

export const getCharacter = (id?: string) =>
  CHARACTERS.find((c) => c.id === id?.toLowerCase());
