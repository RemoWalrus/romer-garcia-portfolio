import { Helmet } from 'react-helmet-async';

const SPOTIFY_URL = 'https://open.spotify.com/artist/11NJVIZgdYbPyz9igDKTBr';
const APPLE_MUSIC_URL = 'https://music.apple.com/us/artist/paradoxxia/1803632666';

const romerGarciaCreator = {
  "@type": "Person",
  "name": "Romer Garcia",
  "url": "https://romergarcia.com",
  "jobTitle": "Design Lead & AI-Driven Multimedia Strategist",
};

export const ParadoxxiaLandingSchema = () => {
  const musicGroupSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "Paradoxxia",
    "alternateName": "パラドクシア",
    "description": "Paradoxxia is an AI-synthesized multimedia artist and character entity created by Romer Garcia. Blending cinematic sci-fi storytelling with AI-generated electronic music available on Spotify and Apple Music.",
    "sameAs": [SPOTIFY_URL, APPLE_MUSIC_URL],
    "url": "https://romergarcia.com/paradoxxia",
    "founder": romerGarciaCreator,
    "genre": ["Electronic", "AI-Generated", "Cinematic", "Sci-Fi Soundtrack"],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://romergarcia.com/paradoxxia"
    }
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Paradoxxia | AI Multimedia Artist & Music",
    "url": "https://romergarcia.com/paradoxxia",
    "description": "Explore Paradoxxia, an AI-driven multimedia experience by Romer Garcia. Featuring AI-synthesized music on Spotify and Apple Music and an interactive character generator.",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Romer Garcia Portfolio",
      "url": "https://romergarcia.com"
    },
    "author": romerGarciaCreator,
    "about": {
      "@type": "MusicGroup",
      "name": "Paradoxxia",
      "sameAs": [SPOTIFY_URL, APPLE_MUSIC_URL]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Paradoxxia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paradoxxia (パラドクシア) is an AI-synthesized multimedia artist and character entity created by Romer Garcia. It combines cinematic sci-fi storytelling with AI-generated electronic music and an interactive character generator."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I listen to Paradoxxia's music?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paradoxxia's AI-synthesized music is available on Spotify and Apple Music. Visit the Paradoxxia page at romergarcia.com/paradoxxia for direct links."
        }
      },
      {
        "@type": "Question",
        "name": "Who created Paradoxxia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Paradoxxia was created by Romer Garcia, a Design Lead and AI-Driven Multimedia Strategist specializing in AI-assisted design and multimedia strategy."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Paradoxxia AI Character Generator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Paradoxxia AI Character Generator is a free interactive web tool that lets users create unique cinematic characters set in the Paradoxxia sci-fi universe, complete with AI-generated portraits, backstories, and stats."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(musicGroupSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export const CharGenSchema = () => {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Paradoxxia AI Character Generator",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "url": "https://romergarcia.com/char-gen",
    "description": "An interactive AI character generator set in the Paradoxxia sci-fi universe. Create unique characters with cinematic portraits, backstories, and stats.",
    "featureList": ["Visual Synthesis", "AI Lore Generation", "Photo Reference Upload", "Character Stats Generation"],
    "author": romerGarciaCreator,
    "creator": romerGarciaCreator,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "associatedMedia": {
      "@type": "MusicGroup",
      "name": "Paradoxxia",
      "description": "An AI-synthesized multimedia artist and character entity.",
      "sameAs": [SPOTIFY_URL, APPLE_MUSIC_URL]
    }
  };

  const musicGroupSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "Paradoxxia",
    "description": "An AI-synthesized multimedia artist and character entity.",
    "sameAs": [SPOTIFY_URL, APPLE_MUSIC_URL],
    "founder": romerGarciaCreator,
    "genre": ["Electronic", "AI-Generated", "Cinematic"]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(musicGroupSchema)}
      </script>
    </Helmet>
  );
};

export const SpotifyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

export const AppleMusicIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.25 10.496 10.496 0 0017.479.04 48.17 48.17 0 0015.11 0H8.89c-.852 0-1.703.02-2.554.06A10.496 10.496 0 004.3.25a5.022 5.022 0 00-1.875.64C1.307 1.633.562 2.633.245 3.943a9.23 9.23 0 00-.24 2.19L0 6.87v10.26l.005.745a9.23 9.23 0 00.24 2.19c.317 1.31 1.062 2.31 2.18 3.043.532.354 1.16.594 1.875.64.852.05 1.703.07 2.554.08H15.11c.852-.01 1.703-.03 2.554-.08a5.022 5.022 0 001.875-.64c1.118-.733 1.863-1.733 2.18-3.043a9.23 9.23 0 00.24-2.19l.005-.745V6.87l-.005-.745h-.965zm-6.898 4.042l-.005 7.064c0 .354-.05.692-.15 1.014-.163.54-.49.96-.978 1.233a2.156 2.156 0 01-1.093.336c-.217.013-.436-.002-.654-.044a1.782 1.782 0 01-1.328-1.152 1.77 1.77 0 01-.076-.89c.066-.344.23-.64.49-.886.237-.226.52-.378.838-.462.236-.063.48-.103.722-.147.243-.044.486-.088.724-.15a.76.76 0 00.545-.6c.013-.088.02-.177.02-.267V9.584a.533.533 0 00-.057-.257.422.422 0 00-.313-.217c-.064-.012-.128-.017-.193-.013-.13.008-.26.03-.39.057l-4.332.965a.667.667 0 00-.424.278.53.53 0 00-.076.276l-.003.08v8.486c0 .393-.053.777-.184 1.146-.19.536-.524.943-1.017 1.203a2.23 2.23 0 01-1.044.302c-.239.016-.478-.002-.714-.056a1.768 1.768 0 01-1.262-1.127 1.771 1.771 0 01-.07-.887c.068-.34.23-.633.488-.877a2.2 2.2 0 01.832-.457c.242-.068.49-.11.738-.157.238-.044.476-.088.71-.15a.78.78 0 00.546-.585c.018-.102.022-.205.022-.309V7.682c0-.208.035-.41.116-.6a.981.981 0 01.5-.518c.164-.08.34-.13.52-.162.18-.033.363-.06.545-.087l3.697-.792c.612-.13 1.224-.257 1.836-.383.152-.03.305-.046.458-.032.244.022.445.122.578.34.076.125.112.265.12.41.004.057.005.115.005.173v6.765z"/>
  </svg>
);

export const YouTubeMusicIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
  </svg>
);
