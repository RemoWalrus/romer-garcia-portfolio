/**
 * Adaptive performance detection hook.
 * Detects hardware capabilities and network conditions to decide
 * whether to run full or lite animations.
 */
import { useState, useEffect } from 'react';

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
}

const getPerformanceTier = (): PerformanceTier => {
  const cores = navigator.hardwareConcurrency || 2;

  // Save-data hint
  const nav = navigator as any;
  const saveData = !!(nav.connection?.saveData);

  // Reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Device memory (Chrome-only API)
  const deviceMemory: number | null = (nav as any).deviceMemory ?? null;

  // Determine tier
  const isLite =
    cores < 4 ||
    saveData ||
    prefersReducedMotion ||
    (deviceMemory !== null && deviceMemory < 4);

  return {
    tier: isLite ? 'lite' : 'full',
    cores,
    saveData,
    prefersReducedMotion,
    deviceMemory,
  };
};

export const usePerformanceTier = (): PerformanceTier => {
  const [perf] = useState<PerformanceTier>(getPerformanceTier);
  return perf;
};

/** Standalone check (no hook needed) */
export const isLiteMode = (): boolean => getPerformanceTier().tier === 'lite';
