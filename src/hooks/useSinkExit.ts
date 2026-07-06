import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cover-overlap: a seção que SAI do viewport "afunda" — recua levemente
 * (scale, transform puro) e escurece via VÉU de opacidade (overlay simples).
 *
 * NUNCA animar filter: brightness() aqui — em seções grandes isso força
 * recálculo de estilo do subtree inteiro a cada frame de scroll e TRAVA o
 * site (aprendido na prática). Opacity num overlay é composite puro.
 * NUNCA aplicar em seção com sticky interno (transform vira containing block).
 */
export function useSinkExit<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const veil = document.createElement('div');
    veil.setAttribute('aria-hidden', 'true');
    Object.assign(veil.style, {
      position: 'absolute',
      inset: '0',
      background: '#05070d',
      opacity: '0',
      pointerEvents: 'none',
      zIndex: '60',
    });
    el.appendChild(veil);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'bottom 70%',
        end: 'bottom 10%',
        scrub: true,
      },
    });
    tl.to(el, { scale: 0.955, ease: 'none' }, 0);
    tl.to(veil, { opacity: 0.55, ease: 'none' }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      veil.remove();
      gsap.set(el, { clearProps: 'transform,scale' });
    };
  }, []);

  return ref;
}
