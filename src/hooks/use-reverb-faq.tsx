import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { REVERB_FAQ } from "../../scripts/reverb-faq.mjs";

export type ReverbFaqItem = { q: string; a: string };

/**
 * REVERB // FAQ
 *
 * Questions live in the Supabase `reverb_faq` table (question, answer,
 * sort_order, visible), so copy can be edited without a deploy. The bundled
 * `scripts/reverb-faq.mjs` list is the fallback used before the fetch resolves
 * and by the pre-renderer, so the visible Q&A and the FAQPage JSON-LD always
 * come from the same source.
 */
export const useReverbFaq = (): ReverbFaqItem[] => {
  const [items, setItems] = useState<ReverbFaqItem[]>(REVERB_FAQ);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("reverb_faq")
        .select("question,answer,sort_order,visible")
        .eq("visible", true)
        .order("sort_order", { ascending: true });

      if (cancelled || error || !data?.length) return;
      setItems(data.map((row: any) => ({ q: row.question, a: row.answer })));
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
};
