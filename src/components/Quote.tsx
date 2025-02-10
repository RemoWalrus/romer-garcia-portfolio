
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { motion } from 'framer-motion';

interface QuoteSection {
  quote: string;
  author: string;
}

export const Quote = () => {
  const [quoteData, setQuoteData] = useState<QuoteSection>({
    quote: "Design is intelligence made visible",
    author: "Alina Wheeler"
  });

  useEffect(() => {
    const fetchQuoteSection = async () => {
      const { data, error } = await supabase
        .from('sections')
        .select('quote, author')
        .eq('section_name', 'quote')
        .single();
      
      if (data && !error) {
        setQuoteData(data);
      }
    };

    fetchQuoteSection();
  }, []);

  return (
    <section className="relative bg-white dark:bg-neutral-900 py-24 overflow-hidden">
      {/* Grain Noise Effect */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Quote Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-roc font-light text-neutral-800 dark:text-white mb-6">
            "{quoteData.quote}"
          </p>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 font-roc">
            — {quoteData.author}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
