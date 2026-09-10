
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://xxigtbxqgbdcfpmnrzvp.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    // Split long-lived vendor code so app updates don't bust the whole cache
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Vite's dynamic-import preload helper must sit with React, otherwise it
          // lands in the Supabase chunk and drags it into the initial load.
          if (id.includes("vite/preload-helper")) return "react";
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id))
            return "react";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/@supabase")) return "supabase";
          // Keep our Supabase client/data helpers with the SDK chunk instead of the
          // entry chunk, so pages that never query the database don't download it.
          if (/src\/(integrations\/supabase|lib\/supabase|utils\/supabase)/.test(id)) return "supabase";
          if (id.includes("node_modules/@tanstack/react-query")) return "query";
          return undefined;
        },
      },
    },
  },
}));
