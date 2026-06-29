import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

export default function CTABanner() {
  const ref = useGsapFadeUp();

  return (
    <section
      className="py-32 md:py-48 relative overflow-hidden"
      style={{ borderTop: '1px solid var(--bd)' }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(26,128,248,.07) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 40% 60% at 50% 100%, rgba(63,25,247,.05) 0%, transparent 60%)',
          }}
        />
      </div>

      <div ref={ref} className="max-w-[var(--w)] mx-auto px-5 text-center">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 font-grotesk text-[11px] font-semibold tracking-[.12em] uppercase"
          style={{ borderColor: 'rgba(26,128,248,.2)', background: 'rgba(26,128,248,.06)', color: 'var(--blue)' }}
        >
          Vamos construir juntos
        </div>

        {/* Heading */}
        <h2
          className="font-grotesk font-bold text-white mx-auto mb-6"
          style={{ fontSize: 'clamp(40px,7vw,96px)', lineHeight: 1.0, letterSpacing: '-.035em', maxWidth: '740px' }}
        >
          Pronto para{' '}
          <em className="not-italic" style={{ color: 'var(--blue)' }}>dominar</em>
          {' '}o digital?
        </h2>

        {/* Subtext */}
        <p className="text-white/40 max-w-md mx-auto mb-12 font-grotesk" style={{ fontSize: 'clamp(15px,1.1vw,18px)', lineHeight: 1.7 }}>
          Do projeto ao lançamento em semanas. Performance de verdade, resultados mensuráveis.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-grotesk font-semibold text-[14px] text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-px"
            style={{ background: 'var(--blue)', boxShadow: '0 0 48px rgba(26,128,248,.45)' }}
          >
            Iniciar Projeto
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-grotesk font-semibold text-[14px] transition-all duration-200 hover:border-white/20 hover:-translate-y-px"
            style={{ border: '1px solid var(--bd)', color: 'rgba(255,255,255,.6)', background: 'rgba(255,255,255,.04)' }}
          >
            Ver Trabalhos
          </a>
        </div>

        {/* Decorative gradient line */}
        <div
          className="mt-20 mx-auto"
          style={{ height: '1px', maxWidth: '280px', background: 'linear-gradient(90deg, transparent, var(--blue), var(--purple), transparent)' }}
        />
      </div>
    </section>
  );
}
