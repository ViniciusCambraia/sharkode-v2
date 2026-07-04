import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ToastProvider } from './hooks/useToast';

// Contato is a heavy 3D route — load it only when visited
const Contato = lazy(() => import('./pages/Contato'));

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
