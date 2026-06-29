import { ArrowUpRight, ArrowRight } from 'lucide-react';
import HologramBackground from './HologramBackground';

/* ── Circular scroll indicator ── */
const SPIN_STYLE = `@keyframes spin-slow { to { transform: rotate(360deg); } }`;

function ScrollIndicator() {
  return (
    <>
      <style>{SPIN_STYLE}</style>
      <a
        href="#main"
        className="absolute bottom-10 right-10 z-10 flex items-center justify-center"
        aria-label="Rolar para baixo"
      >
        <div style={{ animation: 'spin-slow 10s linear infinite', width: 80, height: 80 }}>
          <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
            <path id="sp-circle" d="M40 8 A32 32 0 1 1 39.9 8" fill="none" />
            <text
              fontSize="7.2"
              fill="rgba(255,255,255,.4)"
              letterSpacing="2.6"
              fontFamily="'Space Grotesk', sans-serif"
            >
              <textPath href="#sp-circle">
                SCROLL TO EXPLORE • SCROLL TO EXPLORE •
              </textPath>
            </text>
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,.45)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </a>
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ paddingTop: '120px', paddingBottom: '100px' }}
    >
      {/* Animated gradient background */}
      <HologramBackground />

      {/* Content — left-aligned */}
      <div
        className="relative z-10 max-w-[var(--w)] mx-auto px-5 w-full"
        style={{ animation: 'fadeSlideIn 1s ease-out 0.3s both' }}
      >
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-8 font-grotesk text-[11px] font-semibold tracking-[.12em] uppercase"
          style={{
            borderColor: 'rgba(26,128,248,.25)',
            background: 'rgba(26,128,248,.06)',
            color: 'rgba(255,255,255,.65)',
          }}
        >
          <span style={{ color: 'var(--blue)' }}>+</span>
          Agência Digital — Est. 2022
        </div>

        {/* H1 — two lines */}
        <h1
          className="font-syncopate font-bold text-white uppercase leading-[0.92] mb-8"
          style={{ fontSize: 'clamp(44px,7vw,96px)', letterSpacing: '-.02em' }}
        >
          <span className="block">WEBSITES</span>
          <span
            className="block bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
          >
            QUE MORDEM.
          </span>
        </h1>

        {/* Description + CTAs */}
        <div className="max-w-[500px]">
          <p
            className="font-grotesk text-[15px] leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,.45)' }}
          >
            Sites institucionais, landing pages e sistemas web sob medida —
            com SEO técnico, performance Lighthouse 95+ e integrações com IA
            que transformam visitantes em clientes.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full py-3.5 px-7 font-grotesk text-[14px] font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(26,128,248,.5)]"
              style={{ background: 'var(--blue)', color: '#fff' }}
            >
              Iniciar Projeto
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#portfolio"
              className="group inline-flex items-center gap-2 rounded-full py-3.5 px-7 font-grotesk text-[14px] font-semibold border transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)' }}
            >
              Ver Trabalhos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Circular scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
