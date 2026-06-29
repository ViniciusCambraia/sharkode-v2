import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('gsap')) {
              return 'gsap';
            }
            if (id.includes('lucide-react') || id.includes('lucide')) {
              return 'icons';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
