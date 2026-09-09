
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { CustomCursor } from "./components/CustomCursor";
import { ThemeColor } from "./components/ThemeColor";
import { RouteAnalytics } from "./components/GoogleAnalytics";
import { applyTheme, getThemeOverride } from "./lib/theme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load heavy routes so initial paint is fast
const Meme = lazy(() => import("./pages/Meme"));
const AICharacterGenerator = lazy(() => import("./pages/AICharacterGenerator"));
const ContactRedirect = lazy(() => import("./pages/ContactRedirect"));
const Paradoxxia = lazy(() => import("./pages/Paradoxxia"));
const Story = lazy(() => import("./pages/Story"));
const Reverb = lazy(() => import("./pages/Reverb"));
const ReverbCharacter = lazy(() => import("./pages/ReverbCharacter"));

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
  const originalRef = useRef<{ href: string; type: string } | null>(null);

  useEffect(() => {
    const link =
      document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
      document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
    if (!link) return;

    if (originalRef.current === null) {
      originalRef.current = { href: link.href, type: link.type };
    }

    const path = location.pathname;
    const isParadoxxia = path === '/paradoxxia' || path === '/char-gen' || path === '/story';
    const isReverb = path === '/reverb' || path.startsWith('/reverb/');
    const brand = isParadoxxia ? 'paradoxxia' : isReverb ? 'reverb' : null;

    // Managed extra icon sizes (large PNGs + apple touch icon)
    const MANAGED = 'data-brand-icon';
    document.querySelectorAll(`link[${MANAGED}]`).forEach((el) => el.remove());

    if (brand) {
      link.href = `/favicon-${brand}.png`;
      link.type = 'image/png';

      const extras: Array<{ rel: string; sizes?: string; href: string }> = [
        { rel: 'icon', sizes: '192x192', href: `/favicon-${brand}-192.png` },
        { rel: 'icon', sizes: '512x512', href: `/favicon-${brand}-512.png` },
        { rel: 'apple-touch-icon', sizes: '180x180', href: `/apple-touch-icon-${brand}.png` },
      ];

      extras.forEach((cfg) => {
        const el = document.createElement('link');
        el.rel = cfg.rel;
        el.type = 'image/png';
        if (cfg.sizes) el.setAttribute('sizes', cfg.sizes);
        el.href = cfg.href;
        el.setAttribute(MANAGED, brand);
        document.head.appendChild(el);
      });
    } else {
      const original = originalRef.current;
      link.href = original.href;
      link.type = original.type;
    }
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
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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

