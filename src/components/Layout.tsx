import type { ReactNode } from 'react';
import ScrollProgress from './ScrollProgress';
import Toaster from './Toaster';
import OceanDepth from './OceanDepth';
import HunterCursor from './HunterCursor';
import TapPing from './TapPing';
import { useLenis } from '../hooks/useLenis';

interface LayoutProps {
  children: ReactNode;
}

/** Top-level layout: deep-water backdrop + hunting cursor + smooth scroll + toasts. */
export default function Layout({ children }: LayoutProps) {
  useLenis();

  return (
    <>
      <OceanDepth />
      <ScrollProgress />
      <div className="relative z-10">{children}</div>
      <div className="grain" aria-hidden="true" />
      <HunterCursor />
      <TapPing />
      <Toaster />
    </>
  );
}
