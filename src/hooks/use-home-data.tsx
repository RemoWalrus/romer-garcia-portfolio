import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HomePageData {
  projects: any[];
  heroTitles: any[];
  gallery: any[];
  sections: any[];
  metadata: any[];
  quote: any | null;
}

const defaultData: HomePageData = {
  projects: [],
  heroTitles: [],
  gallery: [],
  sections: [],
  metadata: [],
  quote: null,
};

const HomeDataContext = createContext<HomePageData>(defaultData);

export const useHomeData = () => useContext(HomeDataContext);

// Helper to extract a section by name
export const useSection = (sectionName: string) => {
  const { sections } = useHomeData();
  return sections.find((s: any) => s.section_name === sectionName) || null;
};

export const HomeDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<HomePageData>(defaultData);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await supabase.functions.invoke('page-data', {
          body: null,
          headers: {},
        });

        // supabase.functions.invoke sends GET-like requests; use query params via fetch
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const url = `https://${projectId}.supabase.co/functions/v1/page-data?page=home`;
        const response = await fetch(url);
        const json = await response.json();

        if (json?.data) {
          setData(json.data);
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      }
    };

    fetchAll();
  }, []);

  return (
    <HomeDataContext.Provider value={data}>
      {children}
    </HomeDataContext.Provider>
  );
};
