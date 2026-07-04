import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Barra de progresso de scroll fixa no topo — gradiente azul→roxo. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-[3px] z-[999] origin-left pointer-events-none"
      style={{
        transform: 'scaleX(0)',
        // smooths the scaleX steps the way framer's useSpring did, minus the dep
        transition: 'transform 0.1s linear',
        background: 'linear-gradient(90deg, var(--blue), var(--purple))',
      }}
    />
  );
}
