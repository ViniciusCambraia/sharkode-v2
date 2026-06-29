import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal escalonado dos filhos diretos de um container.
 * Cada filho entra com fade + sobe + escala, em sequência.
 */
export function useGsapStagger<T extends HTMLElement = HTMLDivElement>(
  externalRef?: RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const ref = (externalRef ?? internalRef) as RefObject<T | null>;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
      return;
    }

    const tween = gsap.fromTo(
      items,
      { autoAlpha: 0, y: 40, scale: 0.96 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}
