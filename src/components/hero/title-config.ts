
export interface TitleConfig {
  text: string;
  weights: string[];
  scale: number;
}

export const titles: TitleConfig[] = [
  { text: "Multimedia Artist", weights: ["font-thin", "font-medium"], scale: 0.7 },
  { text: "Illustrator", weights: ["font-thin"], scale: 0.8 },
  { text: "Photographer", weights: ["font-thin"], scale: 0.85 },
  { text: "Video Editor", weights: ["font-thin", "font-medium"], scale: 0.9 },
  { text: "Five Tool Player", weights: ["font-thin", "font-medium"], scale: 0.95 },
  { text: "Web Master", weights: ["font-thin", "font-medium"], scale: 1 },
  { text: "Social Media Manager", weights: ["font-thin", "font-medium"], scale: 1.05 },
  { text: "Art Director", weights: ["font-thin", "font-medium"], scale: 1.1 },
  { text: "romergarcia", weights: ["font-medium", "font-thin"], scale: 1.15 }
];
