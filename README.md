
# Romer Garcia — Portfolio Site

**URL**: https://lovable.dev/projects/f17bb7a1-677e-48f9-9788-57f3494140be
**Live**: https://romer-garcia-portfolio.lovable.app

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** design system
- **Supabase** backend (database, edge functions, storage)
- **Framer Motion** animations
- **React Router** client-side routing
- **Capacitor** for native mobile features

## Site Architecture

A single-page portfolio with fixed hero and scrollable content sections:

| Section | Description |
|---------|-------------|
| **Hero** | Animated title sequence with chromatic aberration effects and AI-generated backgrounds |
| **Portfolio** | Project grid with modal detail views, galleries, and video embeds |
| **About** | Bio section with downloadable portfolio PDF |
| **Gallery** | Horizontal filmstrip with lightbox modals |
| **Quote** | Random inspirational quotes from database |
| **Contact** | Contact form powered by Supabase Edge Function |

### Additional Pages

| Route | Page | Description |
|-------|------|-------------|
| `/paradoxxia` | Paradoxxia | AI Character Generator with Gemini-powered image generation |
| `/char-gen` | AI Character Generator | Three-step character creation (species → gender → name) |
| `/meme` | Dev Memes | Random coding memes, tips, and fun facts |
| `/contact` | Contact Redirect | Redirects to homepage contact section |

## Key Features & Capabilities

### Hero Section — Chromatic Aberration Title Animation

The hero features a Paradoxxia-inspired glitch title system:

- **Word cycling**: Titles fetched from Supabase cycle with configurable timing
- **Chromatic ghost layers**: Red and cyan ghost text layers animate independently using Framer Motion `useAnimation` controls
- **Transition burst**: On each word switch, ghost layers burst outward with high offset/opacity, then settle to subtle resting positions (red: 1.5px, cyan: -1.5px offset at ~15-18% opacity)
- **Single-frame zoom punch**: Each word switch triggers a randomized scale (zoom in 1.06–1.12× or zoom out 0.88–0.94×) lasting exactly one animation frame, then instantly snaps back to normal
- **Scroll-driven effects**: As user scrolls, chromatic aberration intensifies, scan lines appear, skew increases, and title fades out with a burst zone around 50% scroll
- **AI-generated backgrounds**: Background images change when user scrolls back to top

### Custom Cursor

A performant gold-dot cursor with trailing ring, built outside React's render cycle:

- Dot follows mouse instantly; ring trails with interpolated easing (0.15 factor)
- Ring expands on hover over clickable elements with ghost/afterimage effect
- GPU-accelerated via `translate3d` and `will-change: transform`
- All state in `useRef` — zero re-renders during animation
- Hidden on touch devices (`pointer: coarse`)

### Portfolio Projects

- Grid layout with sort-order control
- Modal detail view with hero image, description, tech stack tags
- Image gallery with navigation
- YouTube video embeds
- External/GitHub/project URL links
- JSON-LD `CreativeWork` schema per project (first 2 sentences as meta description)

### AI Character Generator (Paradoxxia)

- Three-step creation: species → gender → name
- Google Gemini 2.5 Flash image generation via Supabase Edge Functions
- "Paradoxxia" easter egg with pre-designed character variants
- Triple-X names create "defective" character variants
- Capacitor integration for native save-to-photos and sharing

### Developer Memes

- Random meme display from `daily_memes` table
- Each meme includes coding tip and tech fun fact
- Fallback content on database errors

## SEO Optimization

- **Dynamic meta tags**: All titles, descriptions, OG/Twitter tags stored in Supabase `metadata` table, fetched via `usePageMeta` hook
- **JSON-LD structured data**: Person, CreativeWork, FAQPage, WebSite schemas
- **Semantic HTML**: Single H1 per page, proper heading hierarchy, alt text on all images
- **Sitemap & robots.txt**: Allows AI crawlers (GPTBot, Claude-Web, OAI-SearchBot)
- **Canonical tags**: Set per page

### Managing Meta Tags via Supabase

Meta tags use a key convention in the `metadata` table:

| Page | Prefix | Route |
|------|--------|-------|
| Homepage | *(none)* | `/` |
| Paradoxxia | `paradoxxia` | `/paradoxxia` |
| AI Character Generator | `chargen` | `/char-gen` |
| Dev Memes | `meme` | `/meme` |

Keys: `title`, `description`, `keywords`, `og_title`, `og_description`, `og_url`, `og_image`, `twitter_title`, `twitter_description`, `twitter_image` — prefixed with page slug for non-homepage (e.g. `paradoxxia.title`).

## Content Management (Supabase)

All content is database-driven — no code changes needed for updates.

| Table | Purpose |
|-------|---------|
| `hero_titles` | Animated hero titles with font weight arrays and sort order |
| `projects` | Portfolio projects (title, category, description, images, tech stack, URLs) |
| `sections` | About, contact, and social media section content |
| `gallery` | Gallery images with optional titles, descriptions, alt text |
| `quotes` | Inspirational quotes (randomly selected via `get_random_quote` function) |
| `daily_memes` | Developer memes with coding tips and fun facts |
| `metadata` | Page-level SEO meta tags |
| `config` | Site configuration key-value pairs |
| `profile` | Profile information |

### Alt Text for Images

Both `projects` and `gallery` tables have an `alt_text` column. When empty, descriptive alt text is auto-generated from title/category/creator. For best SEO: *"UI design for U.S. Army website rebrand by Romer Garcia showing responsive layout."*

## Deployment

### Lovable (Recommended)
Open [Lovable](https://lovable.dev/projects/f17bb7a1-677e-48f9-9788-57f3494140be) → Share → Publish.

### GitHub Pages
The repo includes `.github/workflows/static.yml` — pushes to main auto-deploy via GitHub Actions.

### Netlify
`netlify.toml` is included for Netlify deployments with SPA redirect support.

## Local Development

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

Requires Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
