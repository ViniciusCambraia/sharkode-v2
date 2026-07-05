import { useEffect, useRef, useState } from 'react';

/**
 * Hunting cursor — a sonar reticle that stalks the pointer, locks onto
 * interactive targets (a/button/[data-magnetic]) like a predator acquiring
 * prey, and snaps a "bite" pulse on click. Hidden on touch + reduced motion.
 */
export default function HunterCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide once whether the hunter applies (fine pointer + motion allowed).
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !reduce) setEnabled(true);
  }, []);

  // Wire the DOM logic only after the reticle has actually rendered.
  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add('hunter-on');

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    // Track the ELEMENT, not its rect — rects go stale the moment layout
    // shifts (accordion opening, scroll). We re-measure every frame instead.
    let lockedEl: HTMLElement | null = null;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      lockedEl = (e.target as HTMLElement)?.closest?.(
        'a, button, [data-magnetic], [role="button"], input, textarea',
      ) as HTMLElement | null;
      ring.classList.toggle('locked', !!lockedEl);
    };

    const onDown = () => {
      ring.classList.remove('bite');
      void ring.offsetWidth; // reflow so the animation retriggers on rapid clicks
      ring.classList.add('bite');
    };
    const onBiteEnd = () => ring.classList.remove('bite');
    ring.addEventListener('animationend', onBiteEnd);

    // Only wrap targets up to this size; on big rows (FAQ items, wide cards)
    // wrapping reads as a giant clunky box, so the reticle just grows a bit
    // and stays with the pointer instead.
    const MAX_WRAP_W = 380;
    const MAX_WRAP_H = 120;

    const loop = () => {
      if (lockedEl && !lockedEl.isConnected) lockedEl = null; // target left the DOM

      // Fresh rect every frame → follows accordions, scroll, any reflow
      const r = lockedEl ? lockedEl.getBoundingClientRect() : null;
      const wrap = !!r && r.width <= MAX_WRAP_W && r.height <= MAX_WRAP_H;

      const tx = wrap && r ? r.left + r.width / 2 : mouse.x;
      const ty = wrap && r ? r.top + r.height / 2 : mouse.y;
      pos.x += (tx - pos.x) * 0.18;
      pos.y += (ty - pos.y) * 0.18;

      const w = wrap && r ? r.width + 18 : lockedEl ? 48 : 34;
      const h = wrap && r ? r.height + 18 : lockedEl ? 48 : 34;
      ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      ring.style.width = `${w}px`;
      ring.style.height = `${h}px`;
      ring.style.borderRadius = wrap ? '14px' : '50%';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      ring.removeEventListener('animationend', onBiteEnd);
      document.documentElement.classList.remove('hunter-on');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="hunter" aria-hidden="true">
      <div ref={ringRef} className="hunter-ring">
        <span className="hunter-tick tl" />
        <span className="hunter-tick tr" />
        <span className="hunter-tick bl" />
        <span className="hunter-tick br" />
      </div>
      <div ref={dotRef} className="hunter-dot" />
    </div>
  );
}
