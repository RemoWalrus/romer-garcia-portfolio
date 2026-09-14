import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ReverbDownload = {
  id: string;
  title: string;
  description: string | null;
  /** 'poster' | 'wallpaper-desktop' | 'wallpaper-mobile' — free-form so new kinds need no code change. */
  category: string;
  fileUrl: string;
  previewUrl: string | null;
  sizeLabel: string | null;
};

/**
 * REVERB // DOWNLOADS
 *
 * Posters and wallpapers live in the Supabase `reverb_downloads` table, so new
 * files only need a storage upload plus a row — no deploy.
 */
export const useReverbDownloads = () => {
  const [items, setItems] = useState<ReverbDownload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("reverb_downloads")
        .select("id,title,description,category,file_url,preview_url,size_label")
        .eq("visible", true)
        .order("sort_order", { ascending: true });

      if (cancelled) return;
      setItems(
        (data ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          fileUrl: row.file_url,
          previewUrl: row.preview_url,
          sizeLabel: row.size_label,
        })),
      );
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
};
