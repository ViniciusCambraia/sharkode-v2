import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BiteTransition from './components/BiteTransition';
import { ToastProvider } from './hooks/useToast';

// Contato is a heavy 3D route — load it only when visited
const Contato = lazy(() => import('./pages/Contato'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <BiteTransition />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/contato"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#07070f' }} />}>
                <Contato />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#07070f' }} />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
