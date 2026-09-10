
import { useEffect, useState } from 'react';

export const useAnalytics = () => {
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAnalyticsId = async () => {
      try {
        // Imported dynamically so the Supabase client never blocks first paint.
        const { getProxiedData } = await import('@/utils/proxyHelper');
        const data = await getProxiedData('config', {
          columns: 'value',
          filter: 'key:eq:google_analytics_id'
        });

        if (!cancelled && data && data.length > 0) {
          setAnalyticsId(data[0].value);
        }
      } catch (error) {
        console.error('Error fetching analytics ID:', error);
      }
    };

    // Analytics is never critical for rendering — wait until the page is idle.
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback;
    let timer: number | undefined;
    if (idle) {
      idle(() => fetchAnalyticsId());
    } else {
      timer = window.setTimeout(fetchAnalyticsId, 1200);
    }

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return analyticsId;
};
