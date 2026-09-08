const KEY = "theme-override";

export type ThemeOverride = "light" | "dark" | null;

export const getThemeOverride = (): ThemeOverride => {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

export const setThemeOverride = (value: ThemeOverride) => {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
};

export const applyTheme = (isDark: boolean) => {
  document.documentElement.classList.toggle("dark", isDark);
};

export const isDarkNow = () =>
  document.documentElement.classList.contains("dark");
