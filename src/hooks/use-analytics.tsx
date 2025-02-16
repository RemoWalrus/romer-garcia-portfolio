
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAnalytics = () => {
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsId = async () => {
      const { data, error } = await supabase
        .from('config')
        .select('value')
        .eq('key', 'google_analytics_id')
        .single();
      
      if (data && !error) {
        setAnalyticsId(data.value);
      }
    };

    fetchAnalyticsId();
  }, []);

  return analyticsId;
};
