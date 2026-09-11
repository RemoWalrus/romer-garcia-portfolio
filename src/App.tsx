
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, useState, lazy, Suspense } from "react";
import { CustomCursor } from "./components/CustomCursor";
import { ThemeColor } from "./components/ThemeColor";
import { RouteAnalytics } from "./components/GoogleAnalytics";
import { applyTheme, getThemeOverride } from "./lib/theme";
import ReverbTransmission from "./pages/ReverbTransmission";

// Lazy-load heavy routes so initial paint is fast
const Index = lazy(() => import("./pages/Index"));
const Meme = lazy(() => import("./pages/Meme"));
const AICharacterGenerator = lazy(() => import("./pages/AICharacterGenerator"));
const ContactRedirect = lazy(() => import("./pages/ContactRedirect"));
const Paradoxxia = lazy(() => import("./pages/Paradoxxia"));
const Story = lazy(() => import("./pages/Story"));
const Reverb = lazy(() => import("./pages/Reverb"));
const ReverbCharacter = lazy(() => import("./pages/ReverbCharacter"));
const ReverbTransmissions = lazy(() => import("./pages/ReverbTransmissions"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Toasts are never needed for first paint — load them once the page is idle.
const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

const DeferredToasters = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) {
      idle(() => setReady(true));
    } else {
      const t = window.setTimeout(() => setReady(true), 1500);
      return () => window.clearTimeout(t);
    }
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <Toaster />
      <Sonner />
    </Suspense>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const NEON_BLUE = 'hsl(192, 100%, 50%)';
const NEON_BLUE_GHOST = 'hsla(192, 100%, 50%, 0.3)';
const BLACK_CURSOR = 'hsl(0, 0%, 0%)';
const BLACK_CURSOR_GHOST = 'hsla(0, 0%, 0%, 0.28)';

const RoutedFavicon = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const isParadoxxia = path === '/paradoxxia' || path === '/char-gen' || path === '/story';
    const isReverb = path === '/reverb' || path.startsWith('/reverb/');
    const brand = isParadoxxia ? 'paradoxxia' : isReverb ? 'reverb' : null;

    // Remove every icon link we manage (including the ones from index.html)
    document
      .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"], link[rel="manifest"]')
      .forEach((el) => el.remove());

    const small = brand ? `/favicon-${brand}.png` : '/favicon-32.png';
    const medium = brand ? `/favicon-${brand}-192.png` : '/favicon-192.png';
    const large = brand ? `/favicon-${brand}-512.png` : '/favicon-512.png';
    const apple = brand ? `/apple-touch-icon-${brand}.png` : '/apple-touch-icon.png';

    const ico = brand === 'reverb'
      ? '/favicon-reverb.ico'
      : brand === 'paradoxxia'
        ? '/favicon-paradoxxia.ico'
        : '/favicon.ico';

    const links: Array<{ rel: string; sizes?: string; href: string; type?: string }> = [
      // .ico first (legacy browsers), PNGs last so modern browsers prefer them
      { rel: 'shortcut icon', sizes: 'any', href: ico, type: 'image/x-icon' },
      ...(brand !== 'paradoxxia'
        ? [{ rel: 'icon', sizes: '16x16', href: brand === 'reverb' ? '/favicon-reverb-16.png' : '/favicon-16.png' }]
        : []),
      { rel: 'icon', sizes: '32x32', href: small },
      { rel: 'icon', sizes: '192x192', href: medium },
      { rel: 'icon', sizes: '512x512', href: large },
      { rel: 'apple-touch-icon', sizes: '180x180', href: apple },
      { rel: 'apple-touch-icon-precomposed', sizes: '180x180', href: apple },
      ...(brand === 'reverb' ? [{ rel: 'manifest', href: '/reverb.webmanifest', type: 'application/manifest+json' }] : []),
    ];

    links.forEach((cfg) => {
      const el = document.createElement('link');
      el.rel = cfg.rel;
      el.type = cfg.type ?? 'image/png';
      if (cfg.sizes) el.setAttribute('sizes', cfg.sizes);
      // cache-bust so browsers that pinned an old icon pick this one up
      el.href = `${cfg.href}?v=4`;
      document.head.appendChild(el);
    });
  }, [location.pathname]);

  return null;
};

const RoutedCursor = () => {
  const location = useLocation();
  const [isYellowPhase, setIsYellowPhase] = useState(false);

  useEffect(() => {
    const handlePhaseChange = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      setIsYellowPhase(customEvent.detail === 2 || customEvent.detail === 3);
    };

    window.addEventListener('paradoxxia-phase-change', handlePhaseChange as EventListener);
    return () => window.removeEventListener('paradoxxia-phase-change', handlePhaseChange as EventListener);
  }, []);

  const useNeonCursor = location.pathname === '/char-gen' || location.pathname === '/paradoxxia' || location.pathname === '/story';
  const useBlackCursor = location.pathname === '/paradoxxia' && isYellowPhase;
  const noTrail = location.pathname === '/story' || location.pathname.startsWith('/reverb');

  return (
    <CustomCursor
      color={useBlackCursor ? BLACK_CURSOR : useNeonCursor ? NEON_BLUE : undefined}
      ghostColor={useBlackCursor ? BLACK_CURSOR_GHOST : useNeonCursor ? NEON_BLUE_GHOST : undefined}
      noTrail={noTrail}
    />
  );
};

const App = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const override = getThemeOverride();
      applyTheme(override ? override === 'dark' : e.matches);
    };
    updateTheme(mediaQuery);

    // Older iOS Safari only supports addListener/removeListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateTheme);
    } else {
      mediaQuery.addListener(updateTheme);
    }

    // iOS can miss the change event when returning to the app — re-check on focus/visibility
    const recheck = () => updateTheme(mediaQuery);
    window.addEventListener('focus', recheck);
    document.addEventListener('visibilitychange', recheck);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateTheme);
      } else {
        mediaQuery.removeListener(updateTheme);
      }
      window.removeEventListener('focus', recheck);
      document.removeEventListener('visibilitychange', recheck);
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DeferredToasters />
          <BrowserRouter>
            <ThemeColor />
            <RouteAnalytics />
            <RoutedFavicon />
            <RoutedCursor />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/meme" element={<Meme />} />
                <Route path="/char-gen" element={<AICharacterGenerator />} />
                <Route path="/contact" element={<ContactRedirect />} />
                <Route path="/paradoxxia" element={<Paradoxxia />} />
                <Route path="/story" element={<Story />} />
                <Route path="/reverb" element={<Reverb />} />
                <Route path="/reverb/transmissions" element={<ReverbTransmissions />} />
                <Route path="/reverb/transmissions/:slug" element={<ReverbTransmission />} />
                <Route path="/reverb/:id" element={<ReverbCharacter />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

