
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { CustomCursor } from "./components/CustomCursor";
import Index from "./pages/Index";
import Meme from "./pages/Meme";
import AICharacterGenerator from "./pages/AICharacterGenerator";
import ContactRedirect from "./pages/ContactRedirect";
import NotFound from "./pages/NotFound";

const NEON_BLUE = 'hsl(190, 100%, 50%)';

const CursorWrapper = () => {
  const location = useLocation();
  const isCharGen = location.pathname === '/char-gen';
  return <CustomCursor color={isCharGen ? NEON_BLUE : undefined} />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Set theme based on browser preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    // Initial theme setting
    updateTheme(mediaQuery);

    // Listen for changes in system theme
    mediaQuery.addEventListener('change', updateTheme);

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CustomCursor />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/meme" element={<Meme />} />
              <Route path="/char-gen" element={<AICharacterGenerator />} />
              <Route path="/contact" element={<ContactRedirect />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
