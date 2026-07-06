import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

// Self-hosted fonts — only latin subset (drops ~70% of font weight)
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/syncopate/latin-400.css';
import '@fontsource/syncopate/latin-700.css';
import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-500.css';

import './index.css';
import App from './App.tsx';

// Gate de fontes: o word-reveal do hero só dispara com a Syncopate carregada
// (senão o headline "pisca" trocando de fonte no meio da animação em 3G).
// Race com timeout — nunca segura o site refém de uma fonte.
Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((r) => setTimeout(r, 600)),
]).then(() => document.documentElement.classList.add('fonts-ready'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);