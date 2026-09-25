
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { getProxyUrl } from '@/utils/supabaseProxy';
import { getTrafficSource, trackLinkClick } from '@/lib/linkTracking';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileTiltBackground } from '@/components/links/MobileTiltBackground';

interface Socials {
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  instagram_url: string;
  youtube_url: string;
}

// Mirrors the sameAs list shipped in index.html, so the page is never empty.
const FALLBACK_SOCIALS: Socials = {
  facebook_url: '',
  twitter_url: '',
  linkedin_url: 'https://www.linkedin.com/in/romer-garcia/',
  instagram_url: 'https://www.instagram.com/remowalrus/',
  youtube_url: 'https://www.youtube.com/@romergarcia',
};

// Same camera-lens artwork as the portfolio hero section.
const LENS_BG = getProxyUrl('images', 'romergarciacover.webp');
const PROFILE_PHOTO = getProxyUrl('profile', 'RomerSelfPortrait.jpg');

const LINKS = [
  { label: 'Portfolio', href: '/', blurb: 'Selected work & case studies' },
  { label: 'Reverb', href: '/reverb', blurb: 'Multimedia franchise — meet the Collective' },
  { label: 'Paradoxxia', href: '/paradoxxia', blurb: 'AI-synthesized music & multimedia artist' },
  { label: 'Character Generator', href: '/char-gen', blurb: 'Create cinematic sci-fi characters with AI' },
  { label: 'Dev Memes', href: '/meme', blurb: 'A new one every refresh' },
];

const SITE = 'https://romergarcia.com';

const WordmarkText = ({ inheritColor = false }: { inheritColor?: boolean }) => (
  <>
    <span className={inheritColor ? undefined : 'text-foreground'}>romer</span>
    <span className={`font-thin ${inheritColor ? '' : 'text-muted-foreground'}`}>garcia</span>
  </>
);

const GlitchWordmark = () => {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = !reduceMotion;
  const wordmarkClass =
    'font-roc text-[55px] leading-none font-medium tracking-tighter lowercase whitespace-nowrap [font-feature-settings:"ss01"_1,"calt"_1]';

  return (
    <div className="relative mt-4" aria-label="Romer Garcia">
      {shouldAnimate && (
        <>
          <motion.span
            aria-hidden="true"
            className={`${wordmarkClass} absolute inset-0 pointer-events-none text-red-500 mix-blend-screen`}
            initial={{ x: 18, y: -3, opacity: 0.8 }}
            animate={{ x: [18, -7, 4, -1, 0], y: [-3, 2, -1, 0, 0], opacity: [0.8, 0.62, 0.38, 0.16, 0] }}
            transition={{ duration: 0.68, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.2, 0.45, 0.72, 1] }}
          >
            <WordmarkText inheritColor />
          </motion.span>
          <motion.span
            aria-hidden="true"
            className={`${wordmarkClass} absolute inset-0 pointer-events-none text-cyan-400 mix-blend-screen`}
            initial={{ x: -16, y: 3, opacity: 0.75 }}
            animate={{ x: [-16, 7, -3, 1, 0], y: [3, -2, 1, 0, 0], opacity: [0.75, 0.56, 0.34, 0.14, 0] }}
            transition={{ duration: 0.68, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.2, 0.45, 0.72, 1] }}
          >
            <WordmarkText inheritColor />
          </motion.span>
          <motion.span
            aria-hidden="true"
            className={`${wordmarkClass} absolute inset-0 pointer-events-none text-foreground mix-blend-difference`}
            initial={{ x: 12, opacity: 0.65, clipPath: 'inset(34% 0 42% 0)' }}
            animate={{ x: [12, -8, 4, 0], opacity: [0.65, 0.4, 0.18, 0] }}
            transition={{ duration: 0.52, ease: 'easeOut', times: [0, 0.35, 0.7, 1] }}
          >
            <WordmarkText inheritColor />
          </motion.span>
        </>
      )}

      <motion.h1
        className={`${wordmarkClass} relative z-10`}
        initial={shouldAnimate ? { scale: 1.06, skewX: -2, opacity: 0.9 } : false}
        animate={{ scale: 1, skewX: 0, opacity: 1 }}
        transition={{ duration: 0.62, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <WordmarkText />
      </motion.h1>
    </div>
  );
};

// Mirrors the pre-rendered structured data in scripts/prerender-reverb.mjs.
const LINKS_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/links`,
      url: `${SITE}/links`,
      name: 'Romer Garcia — All Links',
      description:
        'Every Romer Garcia destination in one place — portfolio, Reverb, Paradoxxia, the AI character generator and dev memes, plus social profiles.',
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: 'Romer Garcia Portfolio', url: SITE },
      mainEntity: {
        '@type': 'Person',
        '@id': `${SITE}#person`,
        name: 'Romer Garcia',
        url: SITE,
        jobTitle: 'Design Lead & AI-Driven Multimedia Strategist',
        image: PROFILE_PHOTO,
        sameAs: [
          'https://www.linkedin.com/in/romer-garcia/',
          'https://www.youtube.com/@romergarcia',
          'https://www.instagram.com/remowalrus/',
          'https://www.dvidshub.net/portfolio/1674800/romer-garcia',
        ],
      },
      about: { '@id': `${SITE}#person` },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/links#destinations`,
      name: 'Romer Garcia destinations',
      numberOfItems: LINKS.length,
      itemListElement: LINKS.map((l, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: l.label,
        url: l.href === '/' ? SITE : `${SITE}${l.href}`,
        description: l.blurb,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Links', item: `${SITE}/links` },
      ],
    },
  ],
};

const LinkInBio = () => {
  const [socials, setSocials] = useState<Socials>(FALLBACK_SOCIALS);

  // Record where this visit came from (IG, TikTok, …) once GA is ready.
  useEffect(() => {
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (window.gtag) {
        const { source, medium, campaign, referrer } = getTrafficSource();
        window.gtag('event', 'link_in_bio_view', {
          event_category: 'link_in_bio',
          event_label: source,
          traffic_source: source,
          traffic_medium: medium,
          traffic_campaign: campaign,
          page_referrer: referrer,
        });
        window.clearInterval(timer);
      } else if (tries > 20) {
        window.clearInterval(timer);
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, []);


  // Socials stay editable from the Supabase dashboard (sections.social).
  useEffect(() => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    if (!projectId) return;
    fetch(`https://${projectId}.supabase.co/functions/v1/page-data?page=home`)
      .then((r) => r.json())
      .then((json) => {
        const social = json?.data?.sections?.find(
          (s: { section_name: string }) => s.section_name === 'social',
        );
        if (social) {
          setSocials((prev) => ({
            facebook_url: social.facebook_url || prev.facebook_url,
            twitter_url: social.twitter_url || prev.twitter_url,
            linkedin_url: social.linkedin_url || prev.linkedin_url,
            instagram_url: social.instagram_url || prev.instagram_url,
            youtube_url: social.youtube_url || prev.youtube_url,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const circles: { url: string; label: string; Icon: typeof Facebook }[] = [
    { url: socials.facebook_url, label: 'Facebook', Icon: Facebook },
    { url: socials.twitter_url, label: 'Twitter / X', Icon: Twitter },
    { url: socials.linkedin_url, label: 'LinkedIn', Icon: Linkedin },
    { url: socials.instagram_url, label: 'Instagram', Icon: Instagram },
    { url: socials.youtube_url, label: 'YouTube', Icon: Youtube },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      <ThemeToggle />
      <Helmet>
        <title>Romer Garcia — All Links</title>
        <meta
          name="description"
          content="Every Romer Garcia destination in one place — portfolio, Reverb, Paradoxxia, the Paradoxxia AI character generator and dev memes, plus social profiles."
        />
        <link rel="canonical" href="https://romergarcia.com/links" />
        <meta property="og:title" content="Romer Garcia — All Links" />
        <meta
          property="og:description"
          content="Portfolio, Reverb, Paradoxxia, the AI character generator and dev memes — all of Romer Garcia in one place."
        />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://romergarcia.com/links" />
        <meta property="og:image" content="https://romergarcia.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Romer Garcia — All Links" />
        <meta
          name="twitter:description"
          content="Portfolio, Reverb, Paradoxxia, the AI character generator and dev memes — all of Romer Garcia in one place."
        />
        <meta name="twitter:image" content="https://romergarcia.com/og-image.png" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Romer Garcia, links, link in bio, portfolio, Reverb, Paradoxxia, AI character generator, dev memes, social profiles"
        />
        <meta property="og:image:alt" content="Romer Garcia" />
        <meta property="og:site_name" content="Romer Garcia" />
        <script type="application/ld+json">{JSON.stringify(LINKS_JSON_LD)}</script>
      </Helmet>

      <MobileTiltBackground imageUrl={LENS_BG} />

      <div className="relative z-10 flex flex-col items-center">
        <img
          src={PROFILE_PHOTO}
          alt="Romer Garcia"
          className="w-28 h-28 rounded-full object-cover border border-border"
          width={112}
          height={112}
        />
        <GlitchWordmark />
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Design Lead &amp; AI-Driven Multimedia Strategist
        </p>

        <nav aria-label="Social profiles" className="mt-3">
          <ul className="flex items-center gap-3">
            {circles.map(({ url, label, Icon }) =>
              url ? (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={() => trackLinkClick(label, url, 'social')}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </nav>

        <main className="mt-4 w-full max-w-sm">
          <ul className="flex flex-col gap-2.5">
            {LINKS.map(({ label, href, blurb }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => trackLinkClick(label, href, 'destination')}
                  className="block w-full bg-secondary border border-border px-5 py-3.5 text-center transition-colors hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
                >
                  <span className="block font-roc text-lg font-black tracking-[0.08em] uppercase">
                    {label}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </main>

        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Romer Garcia
        </p>
      </div>
    </div>
  );
};

export default LinkInBio;
