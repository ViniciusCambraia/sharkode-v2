import { useRef } from 'react';
import {
  siWhatsapp, siN8n, siGoogle, siStripe,
  siNotion, siVercel, siSupabase, siMake,
} from 'simple-icons';
import { BeamField, type Beam } from './ui/animated-beam';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

// OpenAI isn't in simple-icons (trademark) — a clean 4-point "spark" glyph
// stands in without faking their protected mark.
const OPENAI_SPARK =
  'M12 1.5c.6 6 3.9 9.3 9.9 9.9-6 .6-9.3 3.9-9.9 9.9-.6-6-3.9-9.3-9.9-9.9 6-.6 9.3-3.9 9.9-9.9Z';

/** Renders an official brand glyph (single filled path) in the given color. */
function BrandIcon({ d, color }: { d: string; color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

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
    { name: 'WhatsApp', color: '#25d366', refProp: r1, align: 'left', icon: <BrandIcon d={siWhatsapp.path} color="#25d366" /> },
    { name: 'n8n',      color: '#ea4b71', refProp: r2, align: 'left', icon: <BrandIcon d={siN8n.path} color="#ea4b71" /> },
    { name: 'OpenAI',   color: '#10a37f', refProp: r3, align: 'left', icon: <BrandIcon d={OPENAI_SPARK} color="#10a37f" /> },
    { name: 'Google',   color: '#4285f4', refProp: r4, align: 'left', icon: <BrandIcon d={siGoogle.path} color="#4285f4" /> },
    { name: 'Stripe',   color: '#635bff', refProp: r5, align: 'left', icon: <BrandIcon d={siStripe.path} color="#635bff" /> },
  ];

  const rightItems: IntegNodeProps[] = [
    { name: 'Notion',    color: '#e6e6e6', refProp: r6, align: 'right', icon: <BrandIcon d={siNotion.path} color="#e6e6e6" /> },
    { name: 'Vercel',    color: '#ffffff', refProp: r7, align: 'right', icon: <BrandIcon d={siVercel.path} color="#ffffff" /> },
    { name: 'Supabase',  color: '#3ecf8e', refProp: r8, align: 'right', icon: <BrandIcon d={siSupabase.path} color="#3ecf8e" /> },
    { name: 'Make',      color: '#a855f7', refProp: r9, align: 'right', icon: <BrandIcon d={siMake.path} color="#a855f7" /> },
    { name: '+ 20 mais', color: '#3f19f7', refProp: r10, align: 'right', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3f19f7" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    )},
  ];

  // Left nodes flow into the hub; right nodes flow out from the hub (reverse).
  const beams: Beam[] = [
    { fromRef: r1,  toRef: hubRef, color: '#25d366', delay: 0.2  },
    { fromRef: r2,  toRef: hubRef, color: '#ea4b71', delay: 1.5  },
    { fromRef: r3,  toRef: hubRef, color: '#10a37f', delay: 0.7  },
    { fromRef: r4,  toRef: hubRef, color: '#4285f4', delay: 2.1  },
    { fromRef: r5,  toRef: hubRef, color: '#635bff', delay: 1.1  },
    { fromRef: hubRef, toRef: r6,  color: '#c0c0c0', delay: 0.9,  reverse: true },
    { fromRef: hubRef, toRef: r7,  color: '#ffffff', delay: 0.4,  reverse: true },
    { fromRef: hubRef, toRef: r8,  color: '#3ecf8e', delay: 1.8,  reverse: true },
    { fromRef: hubRef, toRef: r9,  color: '#a855f7', delay: 0.15, reverse: true },
    { fromRef: hubRef, toRef: r10, color: '#3f19f7', delay: 1.35, reverse: true },
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
          {/* Animated beams — single consolidated SVG, pauses off-screen */}
          <BeamField
            containerRef={containerRef as React.RefObject<HTMLElement | null>}
            hubRef={hubRef as React.RefObject<HTMLElement | null>}
            beams={beams}
          />

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
              className="hub-breathe w-[72px] h-[72px] rounded-[20px] flex items-center justify-center flex-shrink-0 relative z-10"
              style={{
                background: 'rgba(26,128,248,.12)',
                border: '1px solid rgba(26,128,248,.35)',
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
          E muito mais — conectamos seu site a qualquer ferramenta que você usa
        </p>
      </div>
    </section>
  );
}
