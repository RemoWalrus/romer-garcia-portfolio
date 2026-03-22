import { useState, useMemo } from 'react';

export interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl?: string;
  ogImage?: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
}

/**
 * Derives page meta from a pre-fetched metadata array (no network call).
 */
export function usePageMetaFromData(
  prefix: string | undefined,
  metadataRows: { meta_key: string; meta_value: string }[],
  fallback: PageMeta
): PageMeta {
  return useMemo(() => {
    if (!metadataRows || metadataRows.length === 0) return fallback;

    const keyPrefix = prefix ? `${prefix}.` : '';
    const map: Record<string, string> = {};
    const keys = [
      `${keyPrefix}title`,
      `${keyPrefix}description`,
      `${keyPrefix}keywords`,
      `${keyPrefix}og_title`,
      `${keyPrefix}og_description`,
      `${keyPrefix}og_url`,
      `${keyPrefix}og_image`,
      `${keyPrefix}twitter_title`,
      `${keyPrefix}twitter_description`,
      `${keyPrefix}twitter_image`,
    ];

    for (const row of metadataRows) {
      if (keys.includes(row.meta_key)) {
        map[row.meta_key] = row.meta_value;
      }
    }

    const get = (field: string) => map[`${keyPrefix}${field}`];

    return {
      title: get('title') || fallback.title,
      description: get('description') || fallback.description,
      keywords: get('keywords') || fallback.keywords,
      ogTitle: get('og_title') || fallback.ogTitle,
      ogDescription: get('og_description') || fallback.ogDescription,
      ogUrl: get('og_url') || fallback.ogUrl,
      ogImage: get('og_image') || fallback.ogImage,
      twitterTitle: get('twitter_title') || fallback.twitterTitle,
      twitterDescription: get('twitter_description') || fallback.twitterDescription,
      twitterImage: get('twitter_image') || fallback.twitterImage,
    };
  }, [prefix, metadataRows, fallback]);
}

/**
 * @deprecated Use usePageMetaFromData with pre-fetched data instead.
 * Legacy hook that fetches metadata on its own.
 */
export function usePageMeta(prefix: string | undefined, fallback: PageMeta): PageMeta {
  const [metadata, setMetadata] = useState<{ meta_key: string; meta_value: string }[]>([]);

  // Keep legacy behavior for pages not yet migrated
  useState(() => {
    import('@/utils/proxyHelper').then(({ getProxiedData }) => {
      getProxiedData('metadata', { columns: 'meta_key,meta_value' })
        .then((data) => { if (data) setMetadata(data); })
        .catch(console.error);
    });
  });

  return usePageMetaFromData(prefix, metadata, fallback);
}
