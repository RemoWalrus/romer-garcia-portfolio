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

/** Same shared `metadata` rows, named for non-Reverb pages. */
export const useSiteMeta = useReverbMeta;

/** Reads a metadata row with a fallback default. */
export function metaValue(rows: MetaRow[], key: string, fallback: string): string {
  const row = rows.find((r) => r.meta_key === key);
  const value = row?.meta_value?.trim();
  return value ? value : fallback;
}

/** Reads a comma-separated metadata row as a list. */
export function metaList(rows: MetaRow[], key: string, fallback: string[]): string[] {
  const raw = metaValue(rows, key, '');
  if (!raw) return fallback;
  const items = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return items.length ? items : fallback;
}

/** Reads a JSON metadata row, falling back when missing or invalid. */
export function metaJson<T>(rows: MetaRow[], key: string, fallback: T): T {
  const raw = metaValue(rows, key, '');
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}
