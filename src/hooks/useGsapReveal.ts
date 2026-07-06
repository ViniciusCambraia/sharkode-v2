import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../lib/eases';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Word-by-word reveal for headings. The target element should contain
 * `.scroll-reveal-word` children that start translated down (CSS or inline).
 */
export function useGsapReveal() {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const words = el.querySelectorAll<HTMLElement>('.scroll-reveal-word');
      words.forEach((w) => {
        w.style.transform = 'translateY(0%)';
      });
      return;
    }

    const words = el.querySelectorAll<HTMLElement>('.scroll-reveal-word');
    const tween = gsap.to(words, {
      y: '0%',
      duration: 1.2,
      ease: 'drift',
      stagger: 0.15,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none', // anima 1x e fica — reverse no scroll-up deixa a página "nervosa"
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}
