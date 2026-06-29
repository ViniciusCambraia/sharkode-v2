import { useState } from 'react';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

const steps = [
  {
    number: '01',
    title: 'Descoberta',
    description: 'Mergulhamos nos seus objetivos, usuários e dados para mapear a oportunidade real antes de um pixel ser desenhado.',
    tags: ['Pesquisa', 'Auditoria', 'Estratégia'],
  },
  {
    number: '02',
    title: 'Design',
    description: 'Conceitos, sistemas e protótipos que convertem — validados com seus usuários desde o início.',
    tags: ['UX', 'UI', 'Brand'],
  },
  {
    number: '03',
    title: 'Construção',
    description: 'Engenharia escalável com analytics integrado desde o dia um. Do projeto ao ar em semanas, não trimestres.',
    tags: ['Desenvolvimento', 'QA', 'Analytics'],
  },
  {
    number: '04',
    title: 'Escalar',
    description: 'Medimos, iteramos e crescemos — transformando o momentum do lançamento em resultados compostos.',
    tags: ['Otimização', 'Suporte', 'Crescimento'],
  },
];

export default function Process() {
  const [hovered, setHovered] = useState<string | null>(null);
  const headRef = useGsapFadeUp();
  const listRef = useGsapFadeUp();

  return (
    <section
      id="process"
      className="py-24 md:py-32"
      style={{ borderTop: '1px solid var(--bd)' }}
    >
      <div className="max-w-[var(--w)] mx-auto px-5">
        {/* Header */}
        <div ref={headRef} className="mb-16 md:mb-20">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-5 font-grotesk text-[11px] font-semibold tracking-[.12em] uppercase"
            style={{ borderColor: 'rgba(26,128,248,.2)', background: 'rgba(26,128,248,.06)', color: 'var(--blue)' }}
          >
            Como trabalhamos
          </div>
          <h2
            className="font-grotesk font-bold text-white mb-4"
            style={{ fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.05, letterSpacing: '-.025em', maxWidth: '560px' }}
          >
            Um processo desenhado para{' '}
            <em className="not-italic" style={{ color: 'var(--blue)' }}>momentum</em>
          </h2>
          <p className="text-white/40 font-grotesk" style={{ fontSize: 'clamp(14px,1vw,16px)' }}>
            Quatro fases focadas que levam você da ideia ao impacto — rápido.
          </p>
        </div>

        {/* Steps list */}
        <div ref={listRef}>
          {steps.map((step) => {
            const isHovered = hovered === step.number;
            return (
              <div
                key={step.number}
                className="group cursor-default"
                onMouseEnter={() => setHovered(step.number)}
                onMouseLeave={() => setHovered(null)}
                style={{ borderTop: '1px solid var(--bd)' }}
              >
                <div className="grid py-10 gap-6 md:gap-0" style={{ gridTemplateColumns: 'clamp(80px,10vw,140px) 1fr' }}>
                  {/* Number */}
                  <div className="flex items-start pt-1">
                    <span
                      className="font-syncopate font-bold select-none transition-colors duration-300"
                      style={{
                        fontSize: 'clamp(36px,5vw,64px)',
                        lineHeight: 1,
                        color: isHovered ? 'var(--blue)' : 'rgba(255,255,255,.1)',
                        letterSpacing: '-.02em',
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3">
                    <h3
                      className="font-grotesk font-bold text-white transition-colors duration-200 group-hover:text-white"
                      style={{ fontSize: 'clamp(20px,2vw,28px)', letterSpacing: '-.02em', lineHeight: 1.15 }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-white/40 font-grotesk text-sm leading-relaxed" style={{ maxWidth: '560px' }}>
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {step.tags.map(tag => (
                        <span
                          key={tag}
                          className="font-grotesk text-[12px] font-medium px-3 py-1 rounded-full border transition-colors duration-200"
                          style={{
                            borderColor: isHovered ? 'rgba(26,128,248,.3)' : 'rgba(255,255,255,.1)',
                            background: isHovered ? 'rgba(26,128,248,.06)' : 'rgba(255,255,255,.03)',
                            color: isHovered ? 'rgba(255,255,255,.65)' : 'rgba(255,255,255,.35)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Bottom border */}
          <div style={{ borderTop: '1px solid var(--bd)' }} />
        </div>
      </div>
    </section>
  );
}
