/**
 * Adaptive performance detection hook.
 * Detects hardware capabilities and network conditions to decide
 * whether to run full or lite animations.
 */
import { useState } from 'react';

interface PerformanceTier {
  /** 'full' = all effects, 'lite' = reduced animations */
  tier: 'full' | 'lite';
  /** Number of logical CPU cores */
  cores: number;
  /** Whether the user has requested reduced data usage */
  saveData: boolean;
  /** Whether the user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Device memory in GB (if available) */
  deviceMemory: number | null;
  /** Network quality hint when available */
  effectiveType: string | null;
}

const getPerformanceTier = (): PerformanceTier => {
  const cores = navigator.hardwareConcurrency || 2;
  const nav = navigator as Navigator & {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
    deviceMemory?: number;
  };

  const saveData = !!nav.connection?.saveData;
  const effectiveType = nav.connection?.effectiveType ?? null;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const deviceMemory = nav.deviceMemory ?? null;
  const hasSlowNetworkHint = effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g';

  const isLite =
    cores < 4 ||
    saveData ||
    prefersReducedMotion ||
    hasSlowNetworkHint ||
    (deviceMemory !== null && deviceMemory < 4);

  return {
    tier: isLite ? 'lite' : 'full',
    cores,
    saveData,
    prefersReducedMotion,
    deviceMemory,
    effectiveType,
  };
};

export const usePerformanceTier = (): PerformanceTier => {
  const [perf] = useState<PerformanceTier>(getPerformanceTier);
  return perf;
};

/** Standalone check (no hook needed) */
export const isLiteMode = (): boolean => getPerformanceTier().tier === 'lite';
