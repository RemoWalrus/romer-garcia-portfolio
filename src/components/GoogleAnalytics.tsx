
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GoogleAnalytics = () => {
  const analyticsId = useAnalytics();

  useEffect(() => {
    if (!analyticsId) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId);

    return () => {
      document.head.removeChild(script);
    };
  }, [analyticsId]);

  return null;
};

export const trackEvent = (category: string, action: string, label?: string) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
