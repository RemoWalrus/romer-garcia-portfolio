import { Navigate, useParams } from 'react-router-dom';

/**
 * Vanity short links: /ig, /tt, /yt ... land on /links with the UTM tags
 * already attached, so Google Analytics always knows the traffic source
 * even when the platform strips the referrer.
 */
const SOURCE_MAP: Record<string, string> = {
  ig: 'instagram',
  instagram: 'instagram',
  tt: 'tiktok',
  tiktok: 'tiktok',
  fb: 'facebook',
  facebook: 'facebook',
  x: 'twitter',
  twitter: 'twitter',
  li: 'linkedin',
  linkedin: 'linkedin',
  yt: 'youtube',
  youtube: 'youtube',
  th: 'threads',
  threads: 'threads',
  qr: 'qr_code',
  email: 'email',
  card: 'business_card',
  bio: 'bio',
};

const MEDIUM_MAP: Record<string, string> = {
  qr_code: 'offline',
  business_card: 'offline',
  email: 'email',
};

export const VANITY_SLUGS = Object.keys(SOURCE_MAP);

const LinkVanity = () => {
  const { slug = '' } = useParams();
  const source = SOURCE_MAP[slug.toLowerCase()];

  if (!source) return <Navigate to="/links" replace />;

  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: MEDIUM_MAP[source] || 'social',
    utm_campaign: 'link_in_bio',
  });

  return <Navigate to={`/links?${params.toString()}`} replace />;
};

export default LinkVanity;
