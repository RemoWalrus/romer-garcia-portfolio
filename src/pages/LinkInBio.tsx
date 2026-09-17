
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { getProxyUrl } from '@/utils/supabaseProxy';
import { getTrafficSource, trackLinkClick } from '@/lib/linkTracking';
import { ThemeToggle } from '@/components/ThemeToggle';

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

      {/* Camera-lens background — full image width at the top, fading to a soft gray */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 aspect-[1920/1786] md:aspect-auto md:h-full bg-no-repeat bg-top bg-[length:100%_auto] md:bg-cover md:bg-center opacity-[0.3] dark:opacity-[0.75] saturate-[1.25] brightness-[1.25] dark:brightness-100 [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)]"
          style={{ backgroundImage: `url(${LENS_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/60 from-[0%] via-background/40 via-[45%] to-neutral-200 dark:from-transparent dark:via-background/35 dark:to-background" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <img
          src={PROFILE_PHOTO}
          alt="Romer Garcia"
          className="w-28 h-28 rounded-full object-cover border border-border"
          width={112}
          height={112}
        />
        <h1 className="mt-4 font-roc text-[55px] leading-none font-medium tracking-tighter lowercase">
          <span className="text-foreground">romer</span>
          <span className="font-thin text-muted-foreground">garcia</span>
        </h1>
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
