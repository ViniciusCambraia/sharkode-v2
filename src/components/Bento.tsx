import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import '../lib/eases';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTilt } from '../hooks/useTilt';
import { useSpotlight } from '../hooks/useSpotlight';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';
import { useSinkExit } from '../hooks/useSinkExit';

gsap.registerPlugin(ScrollTrigger);

function BentoCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useTilt<HTMLDivElement>();
  useSpotlight(ref);
  return (
    <div
      ref={ref}
      className={`tilt-card spotlight-card rounded-[22px] border p-7 flex flex-col ${className}`}
      style={{ borderColor: 'var(--bd)', background: 'rgba(14,14,26,.85)', backdropFilter: 'blur(16px)' }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, color = 'var(--blue)' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="font-grotesk text-[10px] font-bold tracking-[.16em] uppercase mb-2" style={{ color }}>
      {children}
    </span>
  );
}

export default function Bento() {
  const headRef = useGsapFadeUp();
  const gridRef = useRef<HTMLDivElement>(null);
  const sinkRef = useSinkExit<HTMLElement>();

  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(i => { i.style.opacity = '1'; i.style.transform = 'none'; });
      return;
    }

    const xOffsets = [-55, 0, 55, 0];

    // Set initial state immediately so items start hidden before scroll trigger fires
    items.forEach((item, idx) => {
      gsap.set(item, { autoAlpha: 0, y: 45, x: xOffsets[idx] ?? 0, scale: 0.96 });
    });

    const tween = gsap.to(items, {
      autoAlpha: 1, y: 0, x: 0, scale: 1,
      duration: 0.75,
      ease: 'drift',
      stagger: 0.12,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none', // anima 1x e fica — reverse no scroll-up deixa a página "nervosa"
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(items, { clearProps: 'opacity,visibility,transform,x,y,scale' });
    };
  }, []);

  return (
    // overflow-x-clip: os cards esperam o reveal com translateX(±55) — sem o
    // clip, esse offset invisível ALARGA o layout do celular (Nav estica,
    // página balança). A seção contém os próprios transforms.
    <section ref={sinkRef} className="overflow-x-clip py-24 md:py-32">
      <div className="max-w-[var(--w)] mx-auto px-5">
        {/* Header */}
        <div ref={headRef} className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-5 font-grotesk text-[11px] font-semibold tracking-[.12em] uppercase"
            style={{ borderColor: 'rgba(26,128,248,.2)', background: 'rgba(26,128,248,.06)', color: 'var(--blue)' }}
          >
            Por que Sharkode
          </div>
          <h2
            className="font-grotesk font-bold text-white"
            style={{ fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, letterSpacing: '-.025em', maxWidth: '640px' }}
          >
            Excelência que gera <em className="not-italic" style={{ color: 'var(--blue)' }}>resultados</em>
          </h2>
        </div>

        {/* Bento grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* LEFT — Alta Performance */}
          <BentoCard className="md:row-span-2 justify-between min-h-[380px]">
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(26,128,248,.1)', border: '1px solid rgba(26,128,248,.2)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19c7f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="flex flex-col">
                <Eyebrow>Alta Performance</Eyebrow>
                <h3 className="font-grotesk font-bold text-white text-[22px] mb-3 leading-tight">Entrega ultra-rápida</h3>
              </div>
              <p className="text-white/45 text-sm leading-relaxed">
                Seu site abre em menos de 1,2 segundo. Rápido em qualquer conexão e pronto para o Google desde o primeiro dia.
              </p>
            </div>

            {/* Speedometer + stats */}
            <div>
              <div className="flex flex-col items-center gap-1 mb-6">
                <svg width="120" height="68" viewBox="0 0 120 70">
                  <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="#1a80f8" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="157" strokeDashoffset="32" style={{ filter: 'drop-shadow(0 0 6px #1a80f8)' }} />
                  <text x="60" y="58" textAnchor="middle" fill="white" fontFamily="Syncopate, sans-serif" fontWeight="700" fontSize="20">95</text>
                </svg>
                <span className="font-grotesk text-[10px] tracking-[.12em] uppercase text-white/30">Nota de Velocidade</span>
              </div>

              <div className="grid grid-cols-2 pt-5" style={{ borderTop: '1px solid var(--bd)' }}>
                <div className="flex flex-col">
                  <span className="font-syncopate font-bold text-white text-[22px] leading-none">98%</span>
                  <span className="font-grotesk text-[11px] text-white/35 mt-1.5">Retenção de clientes</span>
                </div>
                <div className="flex flex-col pl-5" style={{ borderLeft: '1px solid var(--bd)' }}>
                  <span className="font-syncopate font-bold text-white text-[22px] leading-none">6 sem</span>
                  <span className="font-grotesk text-[11px] text-white/35 mt-1.5">Ideia ao lançamento</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* CENTER TOP — Escale sem limites */}
          <BentoCard className="relative overflow-hidden">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(63,25,247,.1)', border: '1px solid rgba(63,25,247,.2)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <Eyebrow color="var(--purple)">Flexível &amp; Escalável</Eyebrow>
            <h3 className="font-grotesk font-bold text-white text-xl mb-2 leading-tight">Escale sem limites</h3>
            <p className="text-white/45 text-sm leading-relaxed max-w-[62%]">
              Do primeiro rascunho ao ar sem tropeços — construído para crescer junto com o seu negócio.
            </p>

            {/* Momentum pill */}
            <div
              className="inline-flex items-center gap-2 self-start mt-5 px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'rgba(63,25,247,.25)', background: 'rgba(63,25,247,.08)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
              <span className="font-grotesk text-[11px] font-medium text-white/65">No ritmo certo</span>
            </div>

            {/* Isometric 3D cube */}
            <div className="absolute top-6 right-6 pointer-events-none">
              <svg width="130" height="120" viewBox="0 0 130 120">
                <defs>
                  <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#19c7f7" /><stop offset="100%" stopColor="#3f19f7" />
                  </linearGradient>
                  <linearGradient id="cubeLeft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a80f8" /><stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                  <linearGradient id="cubeRight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                {/* top face */}
                <polygon points="55,8 100,30 55,52 10,30" fill="url(#cubeTop)" style={{ filter: 'drop-shadow(0 0 12px rgba(25,199,247,.5))' }} />
                {/* left face */}
                <polygon points="10,30 55,52 55,78 10,56" fill="url(#cubeLeft)" />
                {/* right face */}
                <polygon points="100,30 55,52 55,78 100,56" fill="url(#cubeRight)" />
                {/* reflection rings */}
                <ellipse cx="55" cy="100" rx="40" ry="11" fill="none" stroke="rgba(63,25,247,.3)" strokeWidth="1" />
                <ellipse cx="55" cy="104" rx="26" ry="7" fill="none" stroke="rgba(25,199,247,.25)" strokeWidth="1" />
              </svg>
            </div>
          </BentoCard>

          {/* RIGHT — Insights em Tempo Real */}
          <BentoCard className="md:row-span-2 justify-between min-h-[380px]">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.2)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>

              {/* Signals badge */}
              <div
                className="absolute top-0 right-0 flex flex-col items-end px-3 py-2 rounded-xl border"
                style={{ borderColor: 'var(--bd)', background: 'rgba(255,255,255,.03)' }}
              >
                <span className="font-syncopate font-bold text-white text-[15px] leading-none">74.2K</span>
                <span className="font-grotesk text-[9px] tracking-[.08em] uppercase text-white/30 mt-1">Dados coletados</span>
              </div>

              <Eyebrow color="#4ade80">Números em Tempo Real</Eyebrow>
              <h3 className="font-grotesk font-bold text-white text-[22px] mb-3 leading-tight">Monitore. Analise. Decida.</h3>
              <p className="text-white/45 text-sm leading-relaxed">
                Painéis e números que você entende de verdade. Dados que viram decisão.
              </p>
            </div>

            {/* Mini chart + trend */}
            <div>
              <svg width="100%" height="80" viewBox="0 0 240 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a80f8" stopOpacity=".3" />
                    <stop offset="100%" stopColor="#1a80f8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 60 L40 45 L80 50 L120 30 L160 35 L200 15 L240 20 L240 80 L0 80Z" fill="url(#chartGrad)" />
                <path d="M0 60 L40 45 L80 50 L120 30 L160 35 L200 15 L240 20"
                  fill="none" stroke="#1a80f8" strokeWidth="2" strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 4px #1a80f8)' }} />
              </svg>
              <div className="flex items-center justify-between mt-3 pt-4" style={{ borderTop: '1px solid var(--bd)' }}>
                <div className="flex items-center gap-2">
                  <span className="font-syncopate font-bold text-[15px]" style={{ color: '#4ade80' }}>+18.6%</span>
                  <span className="font-grotesk text-[11px] text-white/35">vs últimos 7 dias</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
          </BentoCard>

          {/* CENTER BOTTOM — 2 mini cards */}
          <div className="grid grid-cols-2 gap-4">
            <BentoCard className="justify-between min-h-[160px]">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'rgba(26,128,248,.1)', border: '1px solid rgba(26,128,248,.2)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#19c7f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div>
                <Eyebrow>Segurança de Verdade</Eyebrow>
                <h4 className="font-grotesk font-bold text-white text-[15px] leading-tight mb-1">Seguro por padrão</h4>
                <p className="text-white/35 text-xs leading-relaxed">Segurança e privacidade dos seus dados em cada detalhe.</p>
              </div>
              <svg className="mt-3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#19c7f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </BentoCard>

            <BentoCard className="justify-between min-h-[160px]">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'rgba(63,25,247,.1)', border: '1px solid rgba(63,25,247,.2)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <Eyebrow color="var(--purple)">Base Sólida</Eyebrow>
                <h4 className="font-grotesk font-bold text-white text-[15px] leading-tight mb-1">Feito para durar</h4>
                <p className="text-white/35 text-xs leading-relaxed">Código limpo e organizado, fácil de manter e evoluir.</p>
              </div>
              <svg className="mt-3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
