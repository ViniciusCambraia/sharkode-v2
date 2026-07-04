import { useGsapFadeUp } from '../hooks/useGsapFadeUp';
import { useGsapStagger } from '../hooks/useGsapStagger';

const capabilities = [
  {
    num: '01',
    cat: 'DESIGN',
    title: 'Marca & Identidade',
    body: 'Identidade visual, logo e um visual consistente que faz sua marca ser lembrada — e escolhida — em qualquer tela.',
    tags: ['Identidade Visual', 'Logo', 'Design'],
    accent: '#1a80f8',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    num: '02',
    cat: 'PRODUTO',
    title: 'Design de Experiência',
    body: 'Telas e caminhos pensados para o seu cliente entender rápido e agir — testados com gente de verdade, não no chute.',
    tags: ['Experiência', 'Interface', 'Protótipo'],
    accent: '#3f19f7',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    num: '03',
    cat: 'DESENVOLVIMENTO',
    title: 'Desenvolvimento',
    body: 'Sites e sistemas sólidos, prontos para crescer com o seu negócio. Do projeto ao ar em semanas, não em trimestres.',
    tags: ['React', 'Next.js', 'Integrações'],
    accent: '#10a37f',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    num: '04',
    cat: 'CRESCIMENTO',
    title: 'Crescimento',
    body: 'Medimos, ajustamos e automatizamos para transformar o impulso do lançamento em resultado que se acumula mês a mês.',
    tags: ['Dados', 'Google', 'Conversão'],
    accent: '#f59e0b',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
];

export default function Capabilities() {
  const headRef = useGsapFadeUp();
  const gridRef = useGsapStagger();

  return (
    <section
      id="capabilities"
      className="py-24 md:py-32"
      style={{ borderTop: '1px solid var(--bd)' }}
    >
      <div className="max-w-[var(--w)] mx-auto px-5">
        {/* Header */}
        <div ref={headRef} className="flex items-start justify-between gap-8 mb-14 flex-wrap">
          <div className="flex-1" style={{ minWidth: '280px' }}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-5 font-grotesk text-[11px] font-semibold tracking-[.12em] uppercase"
              style={{ borderColor: 'rgba(26,128,248,.2)', background: 'rgba(26,128,248,.06)', color: 'var(--blue)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }} />
              Capabilities reel
            </div>
            <h2
              className="font-grotesk font-bold text-white"
              style={{ fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.05, letterSpacing: '-.025em', maxWidth: '520px' }}
            >
              Quatro formas de mover marcas para frente
            </h2>
          </div>
          {/* Decorative rule */}
          <div className="self-end pb-2 hidden md:block flex-1" style={{ height: '1px', background: 'var(--bd)', maxWidth: '320px' }} />
        </div>

        {/* 4-card grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {capabilities.map((cap) => (
            <div
              key={cap.num}
              className="rounded-[20px] border p-6 flex flex-col gap-5"
              style={{
                borderColor: 'var(--bd)',
                background: 'rgba(14,14,26,.7)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Icon badge */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${cap.accent}14`, border: `1px solid ${cap.accent}30`, color: cap.accent }}
              >
                {cap.icon}
              </div>

              {/* Num + category */}
              <span
                className="font-grotesk text-[10px] font-bold tracking-[.16em] uppercase"
                style={{ color: cap.accent }}
              >
                {cap.num} — {cap.cat}
              </span>

              {/* Title */}
              <h3
                className="font-grotesk font-bold text-white leading-tight"
                style={{ fontSize: 'clamp(18px,1.6vw,22px)', letterSpacing: '-.02em' }}
              >
                {cap.title}
              </h3>

              {/* Body */}
              <p className="text-white/40 text-sm leading-relaxed flex-1">
                {cap.body}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2" style={{ borderTop: '1px solid var(--bd)' }}>
                {cap.tags.map(tag => (
                  <span
                    key={tag}
                    className="font-grotesk text-[11px] font-medium px-2.5 py-1 rounded-full border"
                    style={{
                      borderColor: 'rgba(255,255,255,.08)',
                      background: 'rgba(255,255,255,.04)',
                      color: 'rgba(255,255,255,.45)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
