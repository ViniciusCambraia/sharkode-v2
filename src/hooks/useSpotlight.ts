import { useEffect, useRef, type RefObject } from 'react';

/**
 * Attach a mousemove listener that sets `--mouse-x` / `--mouse-y` CSS
 * variables on the ref'd element — used together with the
 * `.spotlight-card` CSS class for the radial glow effect.
 */
export function useSpotlight<T extends HTMLElement = HTMLElement>(
  externalRef?: RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const ref = (externalRef ?? internalRef) as RefObject<T | null>;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
    };
  }, []);

  return ref;
}
