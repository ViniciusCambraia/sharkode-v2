import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cover-overlap: a seção que SAI do viewport "afunda" — recua levemente
 * (scale) e escurece (brightness) enquanto a seção seguinte a cobre. É o que
 * transforma fade-ups soltos em mergulho contínuo.
 *
 * Brightness + scale APENAS — sem blur (gatilho vestibular + custo de frame;
 * decisão do review). NUNCA aplicar em seção com sticky interno: transform/
 * filter criam containing block e matam o pin (ver gotcha overflow-x-mata-sticky).
 */
export function useSinkExit<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.fromTo(
      el,
      { scale: 1, filter: 'brightness(1)' },
      {
        scale: 0.955,
        filter: 'brightness(0.45)',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'bottom 70%',
          end: 'bottom 10%',
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'transform,filter,scale' });
    };
  }, []);

  return ref;
}
