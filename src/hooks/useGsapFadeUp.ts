import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import '../lib/eases';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Generic "fade up 30px" reveal for `.gs-reveal` elements.
 * Pass an external ref to attach to any element type.
 */
export function useGsapFadeUp<T extends HTMLElement = HTMLDivElement>(
  externalRef?: RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const ref = (externalRef ?? internalRef) as RefObject<T | null>;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      return;
    }

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'drift',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none', // anima 1x e fica — reverse no scroll-up deixa a página "nervosa"
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
