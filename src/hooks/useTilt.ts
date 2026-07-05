import { useEffect, useRef, type RefObject } from 'react';

/**
 * Subtle 3D tilt on mousemove. Sets CSS variables `--tilt-x` / `--tilt-y`
 * used by `.tilt-card` to apply a perspective rotation. Respects
 * `prefers-reduced-motion`.
 */
export function useTilt<T extends HTMLElement = HTMLElement>(
  externalRef?: RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const ref = (externalRef ?? internalRef) as RefObject<T | null>;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // Touch: taps emulate mousemove and leave cards stuck mid-tilt — skip.
    if (window.matchMedia('(hover: none)').matches) {
      return;
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--tilt-x', `${y * -6}deg`); // rotateX
      el.style.setProperty('--tilt-y', `${x * 6}deg`); // rotateY
    };

    const onLeave = () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return ref;
}
