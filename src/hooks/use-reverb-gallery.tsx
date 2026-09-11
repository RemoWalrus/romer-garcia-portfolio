import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProxyUrl } from "@/utils/supabaseProxy";

export type ReverbGalleryItem = {
  id: string;
  src: string;
  thumbSrc: string;
  caption?: string;
  altText?: string;
  mediaType: "image" | "video";
  characterIds: string[];
};

/**
 * Shared Reverb gallery: each image is stored once in the `reverb_gallery`
 * table and tagged with every character that appears in it, so a group shot
 * shows up on several profiles without being duplicated.
 */
export const useReverbGallery = (characterId?: string) => {
  const [items, setItems] = useState<ReverbGalleryItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let query = supabase
        .from("reverb_gallery")
        .select("id,image_file,caption,alt_text,character_ids,media_type,sort_order")
        .order("sort_order", { ascending: true });

      if (characterId) query = query.contains("character_ids", [characterId]);

      const { data, error } = await query;
      if (cancelled || error || !data) return;

      setItems(
        data.map((row: any) => ({
          id: row.id,
          src: getProxyUrl("images", row.image_file),
          thumbSrc: getProxyUrl(
            "images",
            row.image_file.replace(/([^/]+)$/, "thumb-$1"),
          ),
          caption: row.caption ?? undefined,
          altText: row.alt_text ?? undefined,
          mediaType: (row.media_type as "image" | "video") ?? "image",
          characterIds: row.character_ids ?? [],
        })),
      );
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [characterId]);

  return items;
};
