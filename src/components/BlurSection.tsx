import { useRef } from 'react';
import { useStickyScroll } from '../hooks/useStickyScroll';

function cl(v: number) { return Math.max(0, Math.min(1, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

const floatCards = [
  {
    id: 1, label: 'Estratégia', sub: 'Pesquisa & Posicionamento',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    dir: [-1, -1] as [number, number],
    pos: { top: '9%', left: '6%' },
  },
  {
    id: 2, label: 'Crescimento', sub: 'Resultado que se acumula',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    dir: [-1, 1] as [number, number],
    pos: { bottom: '9%', left: '6%' },
  },
  {
    id: 3, label: 'Capricho', sub: 'Design com propósito',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" />
      </svg>
    ),
    dir: [1, -1] as [number, number],
    pos: { top: '9%', right: '6%' },
  },
  {
    id: 4, label: 'Desenvolvimento', sub: 'Código rápido e sólido',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    dir: [1, 1] as [number, number],
    pos: { bottom: '9%', right: '6%' },
  },
];

export default function BlurSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress: p } = useStickyScroll(sectionRef as React.RefObject<HTMLElement | null>);

  // ── DOMINAR — entra com rotação -8°→0°, sai escalando para frente ──
  const dEnter = cl(p / 0.40);
  const dExitP = cl((p - 0.58) / 0.22);
  const dOp    = p < 0.58 ? ease(dEnter) : lerp(1, 0, dExitP);
  const dBlur  = p < 0.58 ? lerp(24, 0, ease(dEnter)) : lerp(0, 16, dExitP);
  const dScale = p < 0.58 ? lerp(0.7, 1, ease(dEnter)) : lerp(1, 1.8, dExitP);
  const dRot   = lerp(-8, 0, ease(dEnter)); // endireita enquanto entra

  // ── Cards — entram simultaneamente com o texto ──
  const cEnter = cl(p / 0.40);
  const cDisp  = cl((p - 0.58) / 0.22);
  const cOp    = p < 0.58 ? ease(cEnter) : lerp(1, 0, cDisp);
  // offset de entrada (diagonal inward) e dispersão (diagonal outward)
  const cDxIn  = p < 0.58 ? lerp(1, 0, ease(cEnter)) : lerp(0, 1, cDisp); // 0=settled, 1=offset/dispersed
  const dispVw = 9; // vw da dispersão
  const dispVh = 7; // vh da dispersão

  // ── Anéis — crescem com scroll ──
  const ringScale = 1 + p * 0.40;

  // ── ESCALAR ──
  const eEnter = cl((p - 0.72) / 0.28);
  const eOp    = ease(eEnter);
  const eBlur  = lerp(20, 0, ease(eEnter));
  const eScale = lerp(0.82, 1, ease(eEnter));

  return (
    <section
      ref={sectionRef}
      style={{ height: '480vh', position: 'relative' }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* Anéis de fundo — crescem com scroll */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[260, 420, 600].map((r) => (
            <div
              key={r}
              className="absolute rounded-full border"
              style={{
                width: r,
                height: r,
                borderColor: 'rgba(26,128,248,0.12)',
                top: '50%',
                left: '50%',
                transform: `translate(-50%,-50%) scale(${ringScale})`,
              }}
            />
          ))}
        </div>

        {/* ── DOMINAR ── */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: 'Syncopate, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(52px,13vw,190px)',
            textTransform: 'uppercase',
            letterSpacing: '.04em',
            whiteSpace: 'nowrap',
            color: '#fff',
            opacity: dOp,
            filter: `blur(${dBlur}px)`,
            transform: `scale(${dScale}) rotate(${dRot}deg)`,
            zIndex: 2,
            willChange: 'transform, opacity, filter',
          }}
        >
          DOMINAR
        </div>

        {/* ── ESCALAR ── */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontFamily: 'Syncopate, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(52px,13vw,190px)',
            textTransform: 'uppercase',
            letterSpacing: '.04em',
            whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg,#1a80f8 0%,#3f19f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: eOp,
            filter: `blur(${eBlur}px)`,
            transform: `scale(${eScale})`,
            zIndex: 2,
            willChange: 'transform, opacity, filter',
          }}
        >
          ESCALAR
        </div>

        {/* ── Cards nos 4 cantos — entram e dispersam com o texto ── */}
        {floatCards.map(({ id, label, sub, icon, dir, pos }) => {
          const tx = dir[0] * cDxIn * dispVw;
          const ty = dir[1] * cDxIn * dispVh;

          return (
            <div
              key={id}
              className="absolute rounded-[18px] p-5"
              style={{
                ...pos,
                background: 'rgba(12,14,22,.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,.11)',
                boxShadow: '0 4px 32px rgba(0,0,0,.35)',
                opacity: cOp,
                transform: `translate(${tx}vw, ${ty}vh)`,
                zIndex: 3,
                minWidth: 200,
                maxWidth: 256,
                willChange: 'transform, opacity',
              }}
            >
              {/* Icon badge */}
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center text-blue-400"
                style={{ background: 'rgba(26,128,248,.22)', border: '1px solid rgba(26,128,248,.18)' }}
              >
                {icon}
              </div>
              {/* Status dot */}
              <div className="mt-2 mb-3 w-1.5 h-1.5 rounded-full bg-blue-500" />
              <p className="font-grotesk text-[15px] font-bold text-white mb-1.5 leading-tight">{label}</p>
              <p className="font-grotesk text-[12px] leading-[1.6] text-white/45">{sub}</p>
            </div>
          );
        })}

      </div>
    </section>
  );
}
