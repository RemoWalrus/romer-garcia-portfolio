
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-14">
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

      <img
        src="/favicon-512.png"
        alt="Romer Garcia — RG monogram"
        className="w-20 h-20 rounded-full border border-border"
        width={80}
        height={80}
      />
      <h1 className="mt-5 text-2xl font-bold tracking-[0.08em] lowercase">romergarcia</h1>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        Design Lead &amp; AI-Driven Multimedia Strategist
      </p>

      <nav aria-label="Social profiles" className="mt-6">
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

      <main className="mt-8 w-full max-w-sm">
        <ul className="flex flex-col gap-3">
          {LINKS.map(({ label, href, blurb }) => (
            <li key={href}>
              <a
                href={href}
                className="block w-full border border-border px-5 py-4 text-center transition-colors hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground"
              >
                <span className="block text-sm font-bold uppercase tracking-[0.18em]">{label}</span>
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
  );
};

export default LinkInBio;
