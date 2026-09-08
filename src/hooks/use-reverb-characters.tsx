import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  CHARACTERS,
  ReverbCharacter,
  reverbImage,
} from "@/data/reverbCharacters";

type Row = {
  id: string;
  name: string;
  role: string | null;
  quote: string | null;
  caption: string | null;
  image_file: string | null;
  figure_file: string | null;
  accent: string | null;
  glow: string | null;
  has_profile: boolean | null;
  kanji: string | null;
  title: string | null;
  tagline: string[] | null;
  discipline: string | null;
  identity: { label: string; value: string }[] | null;
  notes: string[] | null;
  color_name: string | null;
  specialties: string[] | null;
  palette: string[] | null;
  gear: string[] | null;
  overview: string[] | null;
  sign_off: string | null;
  gallery: { type: "image" | "video"; src: string; caption?: string }[] | null;
  is_hidden: boolean | null;
};

const mapRow = (row: Row): ReverbCharacter => ({
  id: row.id,
  name: row.name,
  role: row.role ?? "",
  quote: row.quote ?? "",
  caption: row.caption ?? "",
  image: row.image_file ? reverbImage(row.image_file) : "",
  figure: row.figure_file ? reverbImage(row.figure_file) : undefined,
  accent: row.accent ?? "#ffffff",
  glow: row.glow ?? "rgba(255,255,255,0.5)",
  hasProfile: row.has_profile ?? true,
  kanji: row.kanji ?? undefined,
  title: row.title ?? undefined,
  tagline: row.tagline ?? [],
  discipline: row.discipline ?? undefined,
  identity: row.identity ?? [],
  notes: row.notes ?? [],
  colorName: row.color_name ?? undefined,
  specialties: row.specialties ?? [],
  palette: row.palette ?? [],
  gear: row.gear ?? [],
  overview: row.overview ?? [],
  signOff: row.sign_off ?? undefined,
  gallery: row.gallery ?? [],
  hidden: row.is_hidden ?? false,
});

/**
 * Reverb character sheets, editable straight from the Supabase
 * `reverb_characters` table. Falls back to the bundled copy so the pages
 * always render something on first paint or if the fetch fails.
 */
export const useReverbCharacters = () => {
  const [characters, setCharacters] = useState<ReverbCharacter[]>(CHARACTERS);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("reverb_characters")
        .select("*")
        .order("sort_order", { ascending: true });

      if (cancelled || error || !data?.length) return;
      setCharacters((data as unknown as Row[]).map(mapRow));
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return characters;
};

export const useReverbCharacter = (id?: string) => {
  const characters = useReverbCharacters();
  return characters.find((c) => c.id === id?.toLowerCase());
};
