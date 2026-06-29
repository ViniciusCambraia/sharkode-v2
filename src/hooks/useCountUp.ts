import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startOnView?: boolean;
}

/**
 * Animates a number from 0 to `target` when the element scrolls into view.
 * Returns a ref to attach and the current display value.
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  options: UseCountUpOptions = {}
) {
  const { duration = 1500, startOnView = true } = options;
  const internalRef = useRef<T | null>(null);
  const ref = internalRef as RefObject<T | null>;
  const [value, setValue] = useState(0);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setValue(target);
      hasRunRef.current = true;
      return;
    }

    const animate = () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      const start = performance.now();
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setValue(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    if (!startOnView) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [target, duration, startOnView]);

  return { ref, value };
}
