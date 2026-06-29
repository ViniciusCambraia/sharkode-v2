import { useRef } from 'react';
import { AnimatedBeam } from './ui/animated-beam';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

interface IntegNodeProps {
  color: string;
  name: string;
  icon: React.ReactNode;
  refProp: React.RefObject<HTMLDivElement | null>;
  align?: 'left' | 'right';
}

function IntegNode({ color, name, icon, refProp, align = 'left' }: IntegNodeProps) {
  return (
    <div className={`flex items-center gap-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      <div
        ref={refProp}
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
        style={{
          background: `${color}14`,
          border: `1px solid ${color}35`,
          boxShadow: `0 0 24px ${color}14`,
        }}
      >
        {icon}
      </div>
      <span
        className="font-grotesk text-[13px] font-medium"
        style={{ color: 'rgba(255,255,255,.5)' }}
      >
        {name}
      </span>
    </div>
  );
}

export default function Integrations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef       = useRef<HTMLDivElement>(null);
  const headRef      = useGsapFadeUp();

  const r1  = useRef<HTMLDivElement>(null);
  const r2  = useRef<HTMLDivElement>(null);
  const r3  = useRef<HTMLDivElement>(null);
  const r4  = useRef<HTMLDivElement>(null);
  const r5  = useRef<HTMLDivElement>(null);
  const r6  = useRef<HTMLDivElement>(null);
  const r7  = useRef<HTMLDivElement>(null);
  const r8  = useRef<HTMLDivElement>(null);
  const r9  = useRef<HTMLDivElement>(null);
  const r10 = useRef<HTMLDivElement>(null);

  const leftItems: IntegNodeProps[] = [
    { name: 'WhatsApp', color: '#25d366', refProp: r1, align: 'left', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    )},
    { name: 'n8n', color: '#ff6600', refProp: r2, align: 'left', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    )},
    { name: 'OpenAI', color: '#10a37f', refProp: r3, align: 'left', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6z"/>
      </svg>
    )},
    { name: 'Google', color: '#4285f4', refProp: r4, align: 'left', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053z"/>
      </svg>
    )},
    { name: 'Stripe', color: '#635bff', refProp: r5, align: 'left', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#635bff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    )},
  ];

  const rightItems: IntegNodeProps[] = [
    { name: 'Notion', color: '#e0e0e0', refProp: r6, align: 'right', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1"/>
        <rect x="13" y="3" width="8" height="8" rx="1"/>
        <rect x="3" y="13" width="8" height="8" rx="1"/>
        <rect x="13" y="13" width="8" height="8" rx="1"/>
      </svg>
    )},
    { name: 'Vercel', color: '#ffffff', refProp: r7, align: 'right', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    )},
    { name: 'Supabase', color: '#3ecf8e', refProp: r8, align: 'right', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="4"/>
        <path d="M2 12c0 2.21 4.48 4 10 4s10-1.79 10-4"/>
        <path d="M2 12v4c0 2.21 4.48 4 10 4s10-1.79 10-4v-4"/>
      </svg>
    )},
    { name: 'Make', color: '#19c7f7', refProp: r9, align: 'right', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#19c7f7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="8 12 12 16 16 12"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
      </svg>
    )},
    { name: '+ 20 mais', color: '#3f19f7', refProp: r10, align: 'right', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3f19f7" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    )},
  ];

  const beamPairs = [
    { from: r1,  color: '#25d366', delay: 0.2  },
    { from: r2,  color: '#ff6600', delay: 1.5  },
    { from: r3,  color: '#10a37f', delay: 0.7  },
    { from: r4,  color: '#4285f4', delay: 2.1  },
    { from: r5,  color: '#635bff', delay: 1.1  },
    { from: r6,  color: '#c0c0c0', delay: 0.9,  reverse: true },
    { from: r7,  color: '#ffffff', delay: 0.4,  reverse: true },
    { from: r8,  color: '#3ecf8e', delay: 1.8,  reverse: true },
    { from: r9,  color: '#19c7f7', delay: 0.15, reverse: true },
    { from: r10, color: '#3f19f7', delay: 1.35, reverse: true },
  ];

  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ borderTop: '1px solid var(--bd)' }}
    >
      {/* Contained center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 50% at 50% 55%, rgba(26,128,248,.03) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[var(--w)] mx-auto px-5">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-5 font-grotesk text-[11px] font-semibold tracking-[.12em] uppercase"
            style={{ borderColor: 'rgba(26,128,248,.2)', background: 'rgba(26,128,248,.06)', color: 'var(--blue)' }}
          >
            Integrações
          </div>
          <h2
            className="font-grotesk font-bold text-white mb-4"
            style={{ fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, letterSpacing: '-.025em' }}
          >
            Conecte suas{' '}
            <em className="not-italic" style={{ color: 'var(--blue)' }}>ferramentas favoritas</em>
          </h2>
          <p className="text-white/45 text-base max-w-lg mx-auto font-grotesk">
            Integração nativa com as principais plataformas do mercado.
          </p>
        </div>

        {/* Beam diagram — full width of section */}
      </div>

      {/* Wide container — breaks out of --w to use more screen */}
      <div className="px-4 md:px-8">
        <div
          ref={containerRef}
          className="relative mx-auto grid"
          style={{
            maxWidth: '1280px',
            gridTemplateColumns: '1fr 88px 1fr',
            alignItems: 'center',
            minHeight: '520px',
            gap: 0,
          }}
        >
          {/* Animated beams */}
          {beamPairs.map(({ from, color, delay, reverse }) => (
            <AnimatedBeam
              key={`${delay}-${color}`}
              containerRef={containerRef as React.RefObject<HTMLElement | null>}
              fromRef={reverse ? (hubRef as React.RefObject<HTMLElement | null>) : (from as React.RefObject<HTMLElement | null>)}
              toRef={reverse ? (from as React.RefObject<HTMLElement | null>) : (hubRef as React.RefObject<HTMLElement | null>)}
              color={color}
              delay={delay}
              reverse={reverse}
            />
          ))}

          {/* Left nodes */}
          <div className="flex flex-col gap-8 items-start pl-4 md:pl-8 relative z-10">
            {leftItems.map((item) => (
              <IntegNode key={item.name} {...item} />
            ))}
          </div>

          {/* Hub */}
          <div className="flex items-center justify-center relative z-10">
            <div
              ref={hubRef}
              className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center flex-shrink-0 relative z-10"
              style={{
                background: 'rgba(26,128,248,.12)',
                border: '1px solid rgba(26,128,248,.35)',
                boxShadow: '0 0 60px rgba(26,128,248,.3), inset 0 1px 0 rgba(255,255,255,.08)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#19c7f7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            </div>
          </div>

          {/* Right nodes */}
          <div className="flex flex-col gap-8 items-end pr-4 md:pr-8 relative z-10">
            {rightItems.map((item) => (
              <IntegNode key={item.name} {...item} />
            ))}
          </div>
        </div>

        <p className="text-center mt-10 font-grotesk text-xs tracking-[.06em] text-white/20">
          E muito mais — API aberta para qualquer integração personalizada
        </p>
      </div>
    </section>
  );
}
