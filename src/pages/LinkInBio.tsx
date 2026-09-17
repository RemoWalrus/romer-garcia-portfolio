
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { getProxyUrl } from '@/utils/supabaseProxy';

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

const LinkInBio = () => {
  const [socials, setSocials] = useState<Socials>(FALLBACK_SOCIALS);

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
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-14 overflow-hidden">
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
      </Helmet>

      {/* Camera-lens background from the portfolio hero, kept subtle */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src={LENS_BG}
          alt=""
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover opacity-[0.2] dark:opacity-[0.45]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
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
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground"
                  >
                    <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </nav>

        <main className="mt-5 w-full max-w-sm">
          <ul className="flex flex-col gap-3">
            {LINKS.map(({ label, href, blurb }) => (
              <li key={href}>
                <a
                  href={href}
                  className="block w-full bg-secondary border border-border px-5 py-4 text-center transition-colors hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
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

        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Romer Garcia
        </p>
      </div>
    </div>
  );
};

export default LinkInBio;
