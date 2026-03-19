
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, useState, lazy, Suspense } from "react";
import { CustomCursor } from "./components/CustomCursor";
import { ThemeColor } from "./components/ThemeColor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load heavy routes so initial paint is fast
const Meme = lazy(() => import("./pages/Meme"));
const AICharacterGenerator = lazy(() => import("./pages/AICharacterGenerator"));
const ContactRedirect = lazy(() => import("./pages/ContactRedirect"));
const Paradoxxia = lazy(() => import("./pages/Paradoxxia"));

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

const RoutedCursor = () => {
  const location = useLocation();
  const [isYellowPhase, setIsYellowPhase] = useState(false);

  useEffect(() => {
    const handlePhaseChange = (event: Event) => {
      const customEvent = event as CustomEvent<number>;
      setIsYellowPhase(customEvent.detail === 2);
    };

    window.addEventListener('paradoxxia-phase-change', handlePhaseChange as EventListener);
    return () => window.removeEventListener('paradoxxia-phase-change', handlePhaseChange as EventListener);
  }, []);

  const useNeonCursor = location.pathname === '/char-gen' || location.pathname === '/paradoxxia';
  const useBlackCursor = location.pathname === '/paradoxxia' && (isYellowPhase || paradoxxiaPhase === 3);

  return (
    <CustomCursor
      color={useBlackCursor ? BLACK_CURSOR : useNeonCursor ? NEON_BLUE : undefined}
      ghostColor={useBlackCursor ? BLACK_CURSOR_GHOST : useNeonCursor ? NEON_BLUE_GHOST : undefined}
    />
  );
};

const App = () => {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', e.matches);
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
            <RoutedCursor />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/meme" element={<Meme />} />
                <Route path="/char-gen" element={<AICharacterGenerator />} />
                <Route path="/contact" element={<ContactRedirect />} />
                <Route path="/paradoxxia" element={<Paradoxxia />} />
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
