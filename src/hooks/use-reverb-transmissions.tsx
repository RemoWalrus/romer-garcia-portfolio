import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProxyUrl, toProxyUrl } from "@/utils/supabaseProxy";

/**
 * REVERB // TRANSMISSIONS
 *
 * Every entry lives in the Supabase `reverb_transmissions` table, so publishing
 * new material never requires a code change: add a row, set `status` to
 * `published` and give it a `published_at` in the past.
 *
 * Row-level security already hides drafts, archived rows and future-dated
 * (scheduled) rows from the public key, so the client never has to be trusted
 * with that decision — the filters below are belt-and-braces only.
 */

export type TransmissionPreview = {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  excerpt?: string;
  characterSlug?: string;
  category: string;
  publishedAt?: string;
  coverImage?: string;
  thumbnail?: string;
  featured: boolean;
  isAnomaly: boolean;
  isCollectiveOnly: boolean;
  sortOrder?: number;
};

export type Transmission = TransmissionPreview & {
  body?: string;
  mediaUrl?: string;
  externalUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

/** Archive placeholder — presentation only, never exposes draft content. */
export type ArchiveSlot = {
  id: string;
  label?: string;
  title: string;
  order: number;
  status: "released" | "locked" | "classified" | "missing" | "corrupted" | string;
  transmissionId?: string;
};

/** Columns needed for cards — deliberately excludes the long-form `body`. */
const PREVIEW_COLUMNS =
  "id,slug,transmission_number,title,subtitle,excerpt,character_slug,category,published_at,cover_image_url,thumbnail_url,featured,is_anomaly,is_collective_only,sort_order";

const DETAIL_COLUMNS = `${PREVIEW_COLUMNS},body,media_url,external_url,cta_label,cta_url`;

/**
 * Media may be stored either as a full Supabase URL or as a path inside the
 * public `images` bucket (e.g. `reverb/transmissions/spark/before-the-fall.webp`).
 * Both are served through the site's asset proxy.
 */
export const transmissionMedia = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  if (/^(https?:)?\/\//i.test(value)) return toProxyUrl(value);
  if (value.startsWith("/")) return value;
  return getProxyUrl("images", value);
};

const mapPreview = (row: any): TransmissionPreview => ({
  id: row.id,
  slug: row.slug,
  number: row.transmission_number ?? 0,
  title: row.title,
  subtitle: row.subtitle ?? undefined,
  excerpt: row.excerpt ?? undefined,
  characterSlug: row.character_slug ?? undefined,
  category: row.category ?? "archive",
  publishedAt: row.published_at ?? undefined,
  coverImage: transmissionMedia(row.cover_image_url),
  thumbnail: transmissionMedia(row.thumbnail_url ?? row.cover_image_url),
  featured: !!row.featured,
  isAnomaly: !!row.is_anomaly,
  isCollectiveOnly: !!row.is_collective_only,
  sortOrder: row.sort_order ?? undefined,
});

const mapDetail = (row: any): Transmission => ({
  ...mapPreview(row),
  body: row.body ?? undefined,
  mediaUrl: transmissionMedia(row.media_url),
  externalUrl: row.external_url ?? undefined,
  ctaLabel: row.cta_label ?? undefined,
  ctaUrl: row.cta_url ?? undefined,
});

const publishedOnly = (query: any) =>
  query.eq("status", "published").lte("published_at", new Date().toISOString());

/**
 * Published transmissions, newest first. Rows with an explicit `sort_order`
 * are pinned ahead of the date-ordered feed.
 */
export const useTransmissions = (options: {
  character?: string;
  category?: string;
  limit?: number;
} = {}) => {
  const { character, category, limit } = options;
  const [items, setItems] = useState<TransmissionPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      let query = publishedOnly(
        supabase.from("reverb_transmissions").select(PREVIEW_COLUMNS),
      )
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("published_at", { ascending: false });

      if (character) query = query.eq("character_slug", character);
      if (category) query = query.eq("category", category);
      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (cancelled) return;
      setItems(error || !data ? [] : data.map(mapPreview));
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [character, category, limit]);

  return { items, loading };
};

/** Newest published transmission — used by the LATEST TRANSMISSION section. */
export const useLatestTransmission = () => {
  const { items, loading } = useTransmissions({ limit: 1 });
  return { transmission: items[0], loading };
};

/** A single transmission by slug, including its long-form body. */
export const useTransmission = (slug?: string) => {
  const [transmission, setTransmission] = useState<Transmission | null>(null);
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setTransmission(null);

    if (!slug) {
      setState("missing");
      return;
    }

    const load = async () => {
      const { data, error } = await publishedOnly(
        supabase.from("reverb_transmissions").select(DETAIL_COLUMNS).eq("slug", slug),
      ).maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        setState("missing");
        return;
      }
      setTransmission(mapDetail(data));
      setState("found");
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { transmission, state };
};

/** Future-facing archive placeholders for a character page. */
export const useArchiveSlots = (characterSlug?: string) => {
  const [slots, setSlots] = useState<ArchiveSlot[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (!characterSlug) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("reverb_archive_slots")
        .select("id,label,title,display_order,release_status,linked_transmission_id")
        .eq("character_slug", characterSlug)
        .eq("visible", true)
        .order("display_order", { ascending: true });

      if (cancelled || error || !data) return;
      setSlots(
        data.map((row: any) => ({
          id: row.id,
          label: row.label ?? undefined,
          title: row.title,
          order: row.display_order ?? 0,
          status: row.release_status ?? "locked",
          transmissionId: row.linked_transmission_id ?? undefined,
        })),
      );
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [characterSlug]);

  return slots;
};

/** TRANSMISSION // 003 */
export const formatTransmissionNumber = (n: number) => String(n).padStart(3, "0");

/** Anomalies carry a partially unreadable record number. */
export const displayTransmissionNumber = (n: number, isAnomaly = false) => {
  const padded = formatTransmissionNumber(n);
  if (!isAnomaly) return padded;
  return `${padded.slice(0, 1)}▚${padded.slice(2)}`;
};

export const formatTransmissionDate = (value?: string, isAnomaly = false) => {
  if (!value) return isAnomaly ? "DATE UNRESOLVED" : "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const formatted = date
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })
    .toUpperCase();
  return isAnomaly ? `${formatted} / ??` : formatted;
};
