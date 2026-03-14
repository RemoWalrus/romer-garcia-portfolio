import { useState, useEffect } from 'react';
import { getProxiedData } from '@/utils/proxyHelper';

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
 * Fetches page-specific meta tags from the Supabase `metadata` table.
 * 
 * Keys follow the convention:
 * - Homepage: `title`, `description`, `keywords`, `og_title`, etc.
 * - Other pages: `{prefix}.title`, `{prefix}.description`, etc.
 * 
 * @param prefix - Page prefix (e.g. 'paradoxxia', 'chargen', 'meme'). 
 *                 Pass empty string or undefined for the homepage.
 * @param fallback - Hardcoded fallback values used while loading or on error.
 */
export function usePageMeta(prefix: string | undefined, fallback: PageMeta): PageMeta {
  const [meta, setMeta] = useState<PageMeta>(fallback);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const keyPrefix = prefix ? `${prefix}.` : '';
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

        const data = await getProxiedData('metadata', {
          columns: 'meta_key,meta_value',
        });

        if (!data || data.length === 0) return;

        const map: Record<string, string> = {};
        for (const row of data) {
          if (keys.includes(row.meta_key)) {
            map[row.meta_key] = row.meta_value;
          }
        }

        const get = (field: string) => map[`${keyPrefix}${field}`];

        setMeta({
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
        });
      } catch (error) {
        console.error('Failed to fetch page meta:', error);
        // Keep fallback values
      }
    };

    fetchMeta();
  }, [prefix]);

  return meta;
}
