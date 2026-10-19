import { lazy, type ComponentType } from "react";

const RELOAD_KEY = "chunk-reload-at";

/**
 * After a new deploy, an open tab may request old chunk files that no longer
 * exist. Reload once (guarded against loops) so the tab picks up the new build.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: T,
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      let last = 0;
      try {
        last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
      } catch {
        /* storage unavailable */
      }
      if (Date.now() - last > 10_000) {
        try {
          sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
        } catch {
          /* storage unavailable */
        }
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      if (fallback) return { default: fallback };
      throw err;
    }
  });
}
