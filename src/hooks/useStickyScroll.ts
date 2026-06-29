import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Tracks scroll progress (0–1) within a tall sticky section.
 * Returns progress where 0 = section just entered viewport, 1 = section fully scrolled.
 */
export function useStickyScroll(externalRef?: RefObject<HTMLElement | null>) {
  const internalRef = useRef<HTMLElement | null>(null);
  const ref = (externalRef ?? internalRef) as RefObject<HTMLElement | null>;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return { ref, progress };
}
