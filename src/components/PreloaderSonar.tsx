import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../lib/eases';

/**
 * Preloader-sonar: o primeiro segundo do mergulho. Pings expandindo, cota de
 * profundidade EMERGINDO (-3.800m → 0m: o visitante sobe à superfície, onde o
 * hero é 0m no profundímetro) e handoff sem corte — quando o véu sobe, o
 * word-reveal do hero dispara (classe `dive-ready` no <html>).
 *
 * Adaptativo (emenda do crítico, LCP): ~1.8s na primeira visita da sessão,
 * ~0.45s nas seguintes. Reduced-motion: pula direto.
 */
export default function PreloaderSonar() {
  const [gone, setGone] = useState(false);
  const veilRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revisit = sessionStorage.getItem('sk-dived') === '1';
    const veil = veilRef.current;
    const meter = meterRef.current;

    if (reduce || !veil || !meter) {
      document.documentElement.classList.add('dive-ready');
      setGone(true);
      return;
    }

    const DIVE = revisit ? 0.45 : 1.8;
    const counter = { m: 3800 };
    const fonts = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 900)),
    ]);

    const tl = gsap.timeline({ paused: true });
    // a cota EMERGE em queda-livre com tranco de instrumento
    tl.to(counter, {
      m: 0,
      duration: DIVE,
      ease: 'drift',
      snap: { m: 20 },
      onUpdate: () => {
        meter.textContent = `-${Math.round(counter.m).toLocaleString('pt-BR')}m`;
      },
    });
    // o véu rompe a superfície (sobe) e o hero assume
    tl.to(veil, {
      yPercent: -100,
      duration: 0.8,
      ease: 'bite',
      onStart: () => {
        document.documentElement.classList.add('dive-ready');
        sessionStorage.setItem('sk-dived', '1');
      },
      onComplete: () => setGone(true),
    }, '+=0.12');

    // só começa a contagem com a Syncopate carregada (handoff sem troca de fonte)
    fonts.then(() => tl.play());

    return () => { tl.kill(); };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={veilRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ background: '#04060c' }}
      aria-hidden="true"
    >
      {/* pings do sonar */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 0.55, 1.1].map((delay) => (
          <div
            key={delay}
            className="absolute rounded-full border"
            style={{
              width: 90,
              height: 90,
              borderColor: 'rgba(25,199,247,.35)',
              animation: `preloaderPing 1.7s cubic-bezier(0.2,0,0.1,1) ${delay}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="font-grotesk text-[10px] font-semibold uppercase tracking-[.22em] text-white/35">
        Sondando águas profundas
      </p>
      <span
        ref={meterRef}
        className="mt-3 font-syncopate text-[34px] font-bold text-white"
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-.02em' }}
      >
        -3.800m
      </span>
      <p className="mt-2 font-grotesk text-[10px] uppercase tracking-[.16em] text-[var(--cyan)]/60">
        subindo à superfície
      </p>
    </div>
  );
}
