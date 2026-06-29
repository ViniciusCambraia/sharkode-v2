import { useGsapFadeUp } from '../hooks/useGsapFadeUp';
import { useGsapStagger } from '../hooks/useGsapStagger';
import { useCountUp } from '../hooks/useCountUp';

/* ── Mini UI — Card 1: Crescimento de Usuários ── */
function UserGrowthWidget() {
  const { ref, value } = useCountUp<HTMLSpanElement>(192269);
  return (
    <div
      className="rounded-2xl p-4 mt-4"
      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}
    >
      <p className="text-[13px] font-semibold text-white mb-3">Crescimento de Usuários</p>
      {/* Time tabs */}
      <div className="flex gap-1.5 mb-4">
        {['12h', '24h', 'Semana'].map((t, i) => (
          <span
            key={t}
            className="text-[11px] px-2.5 py-1 rounded-full"
            style={{
              background: i === 0 ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.05)',
              color: i === 0 ? '#fff' : 'rgba(255,255,255,.4)',
            }}
          >
            {t}
          </span>
        ))}
      </div>
      {/* Big number + badge */}
      <div className="flex items-center gap-3 mb-3">
        <span ref={ref} className="text-[26px] font-bold text-white leading-none">
          {value.toLocaleString('pt-BR')}
        </span>
        <span
          className="text-[11px] font-semibold px-2 py-1 rounded-full flex items-center gap-1"
          style={{ background: 'rgba(26,128,248,.2)', color: '#19c7f7' }}
        >
          ↑+24%
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,.08)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: '72%', background: 'linear-gradient(90deg,#1a80f8,#3f19f7)' }}
        />
      </div>
      <div className="flex justify-between text-[11px]" style={{ color: 'rgba(255,255,255,.35)' }}>
        <span>Monitorando totais</span>
        <span>+120 hoje</span>
      </div>
    </div>
  );
}

/* ── Mini UI — Card 2: Recorde de Vendas (área chart) ── */
function SalesChartWidget() {
  return (
    <div
      className="rounded-2xl p-4 mt-4"
      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-white">Recorde de Vendas</p>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: '#1a80f8', color: '#fff' }}
        >
          +89%
        </span>
      </div>
      {/* SVG area chart */}
      <div className="rounded-xl overflow-hidden mb-3" style={{ background: 'rgba(26,128,248,.07)' }}>
        <svg viewBox="0 0 200 72" fill="none" className="w-full" preserveAspectRatio="none" style={{ height: 90 }}>
          <defs>
            <linearGradient id="wt-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a80f8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1a80f8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <path
            d="M0 65 C30 62 60 52 90 40 C120 28 150 16 200 6 L200 72 L0 72 Z"
            fill="url(#wt-area)"
          />
          {/* Line */}
          <path
            d="M0 65 C30 62 60 52 90 40 C120 28 150 16 200 6"
            stroke="#1a80f8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-[22px] font-bold text-white">
        $491K <span className="text-[14px] font-normal text-white/40">/dia</span>
      </p>
    </div>
  );
}

/* ── Mini UI — Card 3: Total de Insights ── */
function InsightsDashWidget() {
  const { ref, value } = useCountUp<HTMLSpanElement>(159789);
  return (
    <div
      className="rounded-2xl p-4 mt-4"
      style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-white">Total de Insights</p>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(26,128,248,.18)', border: '1px solid rgba(26,128,248,.25)' }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#19c7f7" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
      {/* Big number */}
      <p className="text-[28px] font-bold text-white mb-3 leading-none">
        R$ <span ref={ref}>{value.toLocaleString('pt-BR')}</span>
      </p>
      {/* Badge + label */}
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-semibold px-2 py-1 rounded-full"
          style={{ background: 'rgba(26,128,248,.2)', color: '#19c7f7' }}
        >
          +1.5%
        </span>
        <span className="text-[12px]" style={{ color: 'rgba(255,255,255,.4)' }}>
          Que o mês passado
        </span>
      </div>
    </div>
  );
}

/* ── Main Section ── */
const cards = [
  {
    title: 'Análise de Sentimento',
    desc: 'Mensure o interesse dos clientes com insights orientados por IA em todos os projetos.',
    widget: <UserGrowthWidget />,
  },
  {
    title: 'Insights com IA',
    desc: 'Insights de IA capacitam equipes com análise de dados em tempo real.',
    widget: <SalesChartWidget />,
  },
  {
    title: 'Dashboard de Performance',
    desc: 'O dashboard de performance oferece insights em tempo real de forma imediata.',
    widget: <InsightsDashWidget />,
  },
];

export default function WhyTrust() {
  const headerRef = useGsapFadeUp();
  const gridRef = useGsapStagger();

  return (
    <section className="py-24 md:py-36" style={{ borderTop: '1px solid var(--bd)' }}>
      <div className="max-w-[var(--w)] mx-auto px-5">

        {/* Heading */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-[clamp(28px,4vw,52px)] font-bold text-white leading-tight">
            Por que empresas confiam na{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(135deg,#1a80f8 0%,#3f19f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
              }}
            >
              Sharkode
            </em>
          </h2>
        </div>

        {/* 3-column card grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(({ title, desc, widget }) => (
            <div
              key={title}
              className="rounded-[20px] p-6"
              style={{
                background: 'rgba(14,14,26,.7)',
                border: '1px solid rgba(255,255,255,.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <h3 className="text-[16px] font-semibold text-white mb-2">{title}</h3>
              <p className="text-[13px] leading-[1.6]" style={{ color: 'rgba(255,255,255,.45)' }}>
                {desc}
              </p>
              {widget}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
