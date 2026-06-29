import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // Dot follows instantly
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => ring.classList.add('cursor-hover');
    const onLeave = () => ring.classList.remove('cursor-hover');

    // Attach hover listeners to interactive elements
    const attach = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    attach();
    raf = requestAnimationFrame(tick);

    // Re-attach on DOM changes (lazy-loaded sections)
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot — instant follow */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--blue)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-100px, -100px)',
          marginLeft: -3,
          marginTop: -3,
          willChange: 'transform',
        }}
      />
      {/* Ring — lerp follow */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1.5px solid rgba(26,128,248,.55)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-100px, -100px)',
          marginLeft: -17,
          marginTop: -17,
          willChange: 'transform',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, opacity 0.2s',
        }}
      />
    </>
  );
}
