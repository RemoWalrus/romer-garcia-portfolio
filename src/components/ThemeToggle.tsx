import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Check if running in iframe (edit mode)
    setIsEditMode(window.self !== window.top);
    
    // Get initial theme
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  if (!isEditMode) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-20 right-4 md:bottom-4 md:top-auto z-50 bg-background/80 backdrop-blur-sm border-border"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
