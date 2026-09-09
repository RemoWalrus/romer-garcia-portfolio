
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/use-analytics';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __gaLoadedId?: string;
  }
}

/**
 * Loads gtag.js once per session (safe to mount on multiple pages).
 */
export const GoogleAnalytics = () => {
  const analyticsId = useAnalytics();

  useEffect(() => {
    if (!analyticsId) return;
    if (window.__gaLoadedId === analyticsId) return;
    window.__gaLoadedId = analyticsId;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    // SPA: we send page_view manually on every route change
    window.gtag('config', analyticsId, { send_page_view: false });
    trackPageView(window.location.pathname + window.location.search);
  }, [analyticsId]);

  return null;
};

export const trackEvent = (category: string, action: string, label?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: title ?? document.title,
    });
  }
};

/**
 * Global analytics: loads gtag once and reports every client-side route change.
 */
export const RouteAnalytics = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (lastPath.current === path) return;
    lastPath.current = path;
    // let the route's <Helmet> title land first
    const timer = window.setTimeout(() => trackPageView(path), 300);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return <GoogleAnalytics />;
};
