/**
 * Traffic-source detection + Google Analytics events for the /links page,
 * so every button click reports where the visitor came from (IG, TikTok, etc.).
 */

const STORAGE_KEY = 'links-traffic-source';

const REFERRER_MAP: Array<[RegExp, string]> = [
  [/instagram\.com|l\.instagram|ig\.me/i, 'instagram'],
  [/tiktok\.com|vt\.tiktok|vm\.tiktok/i, 'tiktok'],
  [/facebook\.com|fb\.me|l\.facebook/i, 'facebook'],
  [/(twitter\.com|t\.co|x\.com)/i, 'twitter'],
  [/linkedin\.com|lnkd\.in/i, 'linkedin'],
  [/youtube\.com|youtu\.be/i, 'youtube'],
  [/threads\.net/i, 'threads'],
  [/reddit\.com/i, 'reddit'],
  [/pinterest\./i, 'pinterest'],
  [/whatsapp/i, 'whatsapp'],
  [/t\.me|telegram/i, 'telegram'],
  [/google\./i, 'google'],
  [/bing\.com/i, 'bing'],
];

export interface TrafficSource {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
}

/**
 * utm_source wins; otherwise the referring domain is mapped to a known network.
 * Resolved once per session so it survives in-page navigation.
 */
export const getTrafficSource = (): TrafficSource => {
  if (typeof window === 'undefined') {
    return { source: 'unknown', medium: 'none', campaign: '(not set)', referrer: '' };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const referrer = document.referrer || '';

  let resolved: TrafficSource;

  if (utmSource) {
    resolved = {
      source: utmSource.toLowerCase(),
      medium: (params.get('utm_medium') || 'social').toLowerCase(),
      campaign: params.get('utm_campaign') || '(not set)',
      referrer,
    };
  } else if (referrer && !referrer.includes(window.location.host)) {
    const matched = REFERRER_MAP.find(([re]) => re.test(referrer));
    resolved = {
      source: matched ? matched[1] : new URL(referrer).hostname.replace(/^www\./, ''),
      medium: 'referral',
      campaign: '(not set)',
      referrer,
    };
  } else {
    // No UTM and no referrer — typical for app in-app browsers that strip both.
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as TrafficSource;
    } catch {
      /* ignore */
    }
    resolved = { source: 'direct', medium: 'none', campaign: '(not set)', referrer };
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resolved));
  } catch {
    /* ignore */
  }

  return resolved;
};

/**
 * Sends a GA4 event with the destination and the visitor's traffic source.
 */
export const trackLinkClick = (
  linkLabel: string,
  destination: string,
  linkType: 'destination' | 'social',
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  const { source, medium, campaign, referrer } = getTrafficSource();

  window.gtag('event', 'link_in_bio_click', {
    event_category: 'link_in_bio',
    event_label: linkLabel,
    link_label: linkLabel,
    link_url: destination,
    link_type: linkType,
    traffic_source: source,
    traffic_medium: medium,
    traffic_campaign: campaign,
    page_referrer: referrer,
  });
};
