import { useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp';

interface StatCellProps {
  value: number;
  suffix: string;
  label: string;
  last?: boolean;
}

function StatCell({ value, suffix, label, last }: StatCellProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const { ref, value: current } = useCountUp<HTMLDivElement>(value, { duration: 1800 });

  return (
    <div
      ref={divRef}
      className="py-7 px-4 text-center transition-colors hover:bg-[rgba(26,128,248,.03)] relative"
      style={last ? {} : { borderRight: '1px solid var(--bd)' }}
    >
      <div
        ref={ref}
        className="font-syncopate font-bold text-white leading-none mb-2.5 flex items-center justify-center"
        style={{ fontSize: 'clamp(28px,3.5vw,52px)', minHeight: '52px' }}
      >
        {current}{suffix}
      </div>
      <div className="font-grotesk text-[11px] font-semibold tracking-[.1em] uppercase text-white/30">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="px-10 py-9">
      <div
        className="max-w-[var(--w)] mx-auto grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-[20px]"
        style={{ border: '1px solid var(--bd)', background: 'rgba(255,255,255,.015)' }}
      >
        <StatCell value={200} suffix="+" label="Projetos Entregues" />
        <StatCell value={98}  suffix="%" label="Retenção de Clientes" />
        <StatCell value={95}  suffix="/100"  label="Nota de Velocidade" />
        <StatCell value={5}   suffix="+" label="Anos de Mercado" last />
      </div>
    </section>
  );
}
