
import { useEffect, useState } from 'react';
import { getProxiedData } from '@/utils/proxyHelper';

export const useAnalytics = () => {
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsId = async () => {
      try {
        const data = await getProxiedData('config', {
          columns: 'value',
          filter: 'key:eq:google_analytics_id'
        });
        
        if (data && data.length > 0) {
          setAnalyticsId(data[0].value);
        }
      } catch (error) {
        console.error('Error fetching analytics ID:', error);
      }
    };

    fetchAnalyticsId();
  }, []);

  return analyticsId;
};
