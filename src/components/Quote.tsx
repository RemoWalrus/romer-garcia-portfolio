
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
    const fetchRandomQuote = async () => {
      const { data, error } = await supabase
        .from('quotes')
        .select('quote, author')
        .order('random()')
        .limit(1)
        .single();
      
      if (data && !error) {
        setQuoteData(data);
      } else {
        console.error('Error fetching random quote:', error);
      }
    };

    fetchRandomQuote();
  }, []);

  return (
    <section className="relative bg-white dark:bg-neutral-900 py-24 overflow-hidden isolate">
      {/* Enhanced Grain Noise Effect */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-multiply dark:mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />
      
      {/* Chromatic Aberration Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015] bg-red-500 translate-x-[1px]" />
        <div className="absolute inset-0 opacity-[0.015] bg-blue-500 -translate-x-[1px]" />
      </div>

      {/* Quote Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-roc font-light text-neutral-800 dark:text-white mb-6 relative">
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
