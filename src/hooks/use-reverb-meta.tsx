import { useEffect, useState } from 'react';
import { getProxiedData } from '@/utils/proxyHelper';

export type MetaRow = { meta_key: string; meta_value: string };

let cache: MetaRow[] | null = null;

/**
 * Loads the shared `metadata` rows so Reverb pages can be edited from Supabase.
 */
export function useReverbMeta(): MetaRow[] {
  const [rows, setRows] = useState<MetaRow[]>(cache ?? []);

  useEffect(() => {
    if (cache) return;
    getProxiedData('metadata', { columns: 'meta_key,meta_value' })
      .then((data) => {
        cache = data || [];
        setRows(cache);
      })
      .catch(console.error);
  }, []);

  return rows;
}
