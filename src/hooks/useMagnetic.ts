import { useEffect, useRef } from 'react';

/**
 * Magnetic pull — the element leans toward the cursor while hovered, then
 * springs back on leave. Pairs with the HunterCursor lock-on for a tactile,
 * "the site reaches for you" feel. No-op on touch / reduced motion.
 *
 * @param strength how far (px, roughly) the element travels toward the pointer
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };

    const animate = () => {
      cur.x += (tgt.x - cur.x) * 0.2;
      cur.y += (tgt.y - cur.y) * 0.2;
      el.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      if (Math.abs(tgt.x - cur.x) > 0.1 || Math.abs(tgt.y - cur.y) > 0.1) {
        raf = requestAnimationFrame(animate);
      }
    };
    const kick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tgt.x = (e.clientX - (r.left + r.width / 2)) * strength;
      tgt.y = (e.clientY - (r.top + r.height / 2)) * strength;
      kick();
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
      kick();
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.style.transform = '';
    };
  }, [strength]);

  return ref;
}
