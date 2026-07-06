import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Profundímetro — o scroll é um mergulho. Substitui a barra de progresso
 * genérica por um HUD de instrumento: cota em metros (com "tranco" de leitura
 * quantizada, como sonar de verdade) + zona oceânica + linha de imersão.
 * Também publica --depth (0..1) no :root — o sinal global que fundo, boids e
 * seções consomem pra escurecer/rarear conforme a descida.
 */
const MAX_DEPTH = 3800; // m — fossa do footer
const ZONES: Array<[number, string]> = [
  [0, 'SUPERFÍCIE'],
  [50, '01 · ZONA EPIPELÁGICA'],
  [760, '02 · ZONA MESOPELÁGICA'],
  [1900, '03 · ZONA BATIPELÁGICA'],
  [3000, '04 · ZONA ABISSAL'],
];

export default function ScrollProgress() {
  const meterRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const meter = meterRef.current;
    const zone = zoneRef.current;
    const line = lineRef.current;
    if (!meter || !zone || !line) return;

    let lastDepth = -1;
    let lastZone = '';

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        // sinal global de profundidade (consumido via CSS var, nunca state React)
        document.documentElement.style.setProperty('--depth', self.progress.toFixed(4));

        // leitura quantizada em passos de 20m = tranco de instrumento
        const depth = Math.round((self.progress * MAX_DEPTH) / 20) * 20;
        if (depth !== lastDepth) {
          lastDepth = depth;
          meter.textContent = `-${depth.toLocaleString('pt-BR')}m`;
          const z = ZONES.reduce((acc, [min, label]) => (depth >= min ? label : acc), ZONES[0][1]);
          if (z !== lastZone) {
            lastZone = z;
            zone.textContent = z;
          }
        }
        line.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-5 z-40 hidden select-none items-end gap-2.5 sm:flex"
      aria-hidden="true"
    >
      {/* linha de imersão */}
      <div className="relative h-12 w-px overflow-hidden bg-white/10">
        <div
          ref={lineRef}
          className="absolute inset-0 origin-top"
          style={{ background: 'linear-gradient(180deg, var(--cyan), var(--blue))', transform: 'scaleY(0)' }}
        />
      </div>
      <div className="flex flex-col gap-0.5 font-grotesk">
        <span
          ref={meterRef}
          className="text-[13px] font-semibold text-white/70"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          -0m
        </span>
        <span ref={zoneRef} className="text-[9px] uppercase tracking-[.16em] text-white/30">
          SUPERFÍCIE
        </span>
      </div>
    </div>
  );
}
