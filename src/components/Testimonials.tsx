import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

/* ── Testimonial data ── */
const testimonials = [
  {
    quote: 'A Sharkode entregou nosso site em 18 dias, antes do prazo. No primeiro mês, as conversões pelo formulário subiram 84%.',
    name: 'Marina Castelli',
    role: 'Diretora de Marketing, Vértice',
    initials: 'MC',
    color: '#10b981',
  },
  {
    quote: 'A automação com IA transformou nosso processo de qualificação de leads. A taxa de resposta subiu de 31% para 79% em 60 dias.',
    name: 'Rafael Henrique',
    role: 'CEO, NutriFlow',
    initials: 'RH',
    color: '#1a80f8',
  },
  {
    quote: 'Pela primeira vez o marketing edita o site sozinho, sem depender de programador. A entrega foi impecável e já aparecemos no topo do Google.',
    name: 'Camila Bertolini',
    role: 'Head de Ops, Mapa Soluções',
    initials: 'CB',
    color: '#3f19f7',
  },
  {
    quote: 'O site abre num piscar de olhos, sem nenhum erro no ar e entregue duas semanas antes do prazo. Difícil não recomendar.',
    name: 'Lucas Faria',
    role: 'CTO, Helios Cloud',
    initials: 'LF',
    color: '#f59e0b',
  },
  {
    quote: 'O suporte é outro nível — cada dúvida respondida em minutos. A equipe mais responsiva com que já trabalhei.',
    name: 'Aisha Mendes',
    role: 'Fundadora, Quantia Studio',
    initials: 'AM',
    color: '#ec4899',
  },
  {
    quote: 'Substituímos quatro ferramentas separadas por um sistema único desenvolvido pela Sharkode. Economizamos R$4k/mês em licenças.',
    name: 'Sara Kim',
    role: 'Head de Ops, Lumen Analytics',
    initials: 'SK',
    color: '#19c7f7',
  },
];

/* ── Inline CSS for marquee (avoids injecting global styles) ── */
const marqueeStyle = `
  @keyframes testimonial-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .tm-track { animation: testimonial-marquee 48s linear infinite; }
  .tm-track:hover { animation-play-state: paused; }
`;

/* ── Avatar circle (no real photos — initials) ── */
function Avatar({ initials, color, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-grotesk font-bold select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${color}44, ${color}22)`,
        border: `1.5px solid ${color}55`,
        color,
      }}
    >
      {initials}
    </div>
  );
}

/* ── Single testimonial card ── */
function TestimonialCard({ t, highlight }: { t: typeof testimonials[0]; highlight?: boolean }) {
  return (
    <div
      className="flex-shrink-0 rounded-[20px] p-6 flex flex-col gap-4 select-none"
      style={{
        width: 300,
        background: 'rgba(12,14,22,.85)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${highlight ? t.color + '44' : 'rgba(255,255,255,.08)'}`,
        boxShadow: highlight ? `0 0 0 1px ${t.color}22` : 'none',
      }}
    >
      {/* Stars + quote mark */}
      <div className="flex items-start justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="font-syncopate text-[28px] font-bold leading-none select-none" style={{ color: 'rgba(255,255,255,.08)' }}>
          "
        </span>
      </div>

      {/* Quote */}
      <p className="font-grotesk text-[13px] leading-[1.65] flex-1" style={{ color: 'rgba(255,255,255,.72)' }}>
        "{t.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <Avatar initials={t.initials} color={t.color} size={36} />
        <div>
          <p className="font-grotesk text-[13px] font-semibold text-white leading-tight">{t.name}</p>
          <p className="font-grotesk text-[11px] leading-tight" style={{ color: 'rgba(255,255,255,.38)' }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function Testimonials() {
  const headerRef = useGsapFadeUp();

  // Avatar stack — first 4 unique authors
  const stackAvatars = testimonials.slice(0, 4);

  return (
    <section
      id="testimonials"
      className="py-24 md:py-36 overflow-hidden"
      style={{ borderTop: '1px solid var(--bd)' }}
    >
      {/* Inject marquee keyframes */}
      <style>{marqueeStyle}</style>

      {/* Header — centered */}
      <div ref={headerRef} className="text-center mb-16 px-5">
        <p
          className="font-grotesk text-[11px] font-semibold tracking-[.16em] uppercase mb-5"
          style={{ color: 'var(--blue)' }}
        >
          Amado por clientes
        </p>
        <h2
          className="font-grotesk font-bold text-white mb-6"
          style={{ fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, letterSpacing: '-.025em' }}
        >
          Não acredite só na nossa palavra
        </h2>

        {/* Overlapping avatars + rating */}
        <div className="flex items-center justify-center gap-3">
          {/* Stacked avatars */}
          <div className="flex items-center">
            {stackAvatars.map((t, i) => (
              <div
                key={t.initials}
                style={{
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: i,
                  borderRadius: '50%',
                  border: '2px solid #07070f',
                }}
              >
                <Avatar initials={t.initials} color={t.color} size={34} />
              </div>
            ))}
          </div>
          {/* Rating text */}
          <div className="flex items-center gap-2">
            <span className="font-grotesk font-bold text-[15px]" style={{ color: 'var(--blue)' }}>
              4.9/5
            </span>
            <span className="font-grotesk text-[13px]" style={{ color: 'rgba(255,255,255,.4)' }}>
              de 200+ clientes
            </span>
          </div>
        </div>
      </div>

      {/* Full-viewport marquee */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden">
        <div className="tm-track flex gap-5" style={{ width: 'max-content' }}>
          {/* Original set */}
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} highlight={i === 2} />
          ))}
          {/* Duplicate for seamless loop */}
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name + '-dup'} t={t} highlight={i === 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
