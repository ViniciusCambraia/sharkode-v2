import type { ReactNode } from 'react';
import ScrollProgress from './ScrollProgress';
import Cursor from './Cursor';
import Toaster from './Toaster';
import { useLenis } from '../hooks/useLenis';

interface LayoutProps {
  children: ReactNode;
}

/** Top-level layout: smooth scroll + cursor + toast portal. */
export default function Layout({ children }: LayoutProps) {
  useLenis();

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <div className="relative z-10">{children}</div>
      <Toaster />
    </>
  );
}
