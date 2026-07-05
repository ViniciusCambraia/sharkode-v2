import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Dev-only self-signed HTTPS — iOS/Android only expose the gyroscope
// (DeviceOrientation) on secure origins, needed to test /contato on a phone.
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Heavy 3D stack — kept out of the main vendor/react chunks so it
            // only loads on the lazy /contato route, never on the home page.
            if (
              id.includes('/three/') ||
              id.includes('@react-three') ||
              id.includes('meshline') ||
              id.includes('@dimforge')
            ) {
              return 'three';
            }
            if (id.includes('react-router')) {
              return 'react';
            }
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
