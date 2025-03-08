
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useMetadata } from "./hooks/use-metadata";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <MetadataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MetadataProvider>
    </QueryClientProvider>
  );
};

// Component to load and apply metadata
const MetadataProvider = ({ children }: { children: React.ReactNode }) => {
  // This hook will fetch and apply metadata
  useMetadata();
  return <>{children}</>;
};

export default App;
