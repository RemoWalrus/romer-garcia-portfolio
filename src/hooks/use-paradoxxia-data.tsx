import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ParadoxxiaPageData {
  carousel: any[];
  loreText: string;
  metadata: any[];
  social: any | null;
}

const defaultData: ParadoxxiaPageData = {
  carousel: [],
  loreText: '',
  metadata: [],
  social: null,
};

const ParadoxxiaDataContext = createContext<ParadoxxiaPageData>(defaultData);

export const useParadoxxiaData = () => useContext(ParadoxxiaDataContext);

export const ParadoxxiaDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ParadoxxiaPageData>(defaultData);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const url = `https://${projectId}.supabase.co/functions/v1/page-data?page=paradoxxia`;
        const response = await fetch(url);
        const json = await response.json();
        if (json?.data) {
          setData(json.data);
        }
      } catch (error) {
        console.error('Error fetching paradoxxia page data:', error);
      }
    };
    fetchAll();
  }, []);

  return (
    <ParadoxxiaDataContext.Provider value={data}>
      {children}
    </ParadoxxiaDataContext.Provider>
  );
};
