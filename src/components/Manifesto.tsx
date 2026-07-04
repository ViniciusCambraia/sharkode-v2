import { useRef } from 'react';
import { useStickyScroll } from '../hooks/useStickyScroll';

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress: p } = useStickyScroll(sectionRef as React.RefObject<HTMLElement | null>);
  const e = easeInOutQuad(p);

  const width  = `${62 + 38 * e}vw`;
  const height = `${56 + 44 * e}vh`;
  const radius = `${(28 * (1 - e)).toFixed(2)}px`;
  const veilOp = Math.max(0, Math.min(1, (p - 0.7) / 0.3));

  return (
    <section
      ref={sectionRef}
      style={{ height: '340vh', position: 'relative' }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(26,128,248,.06) 0%, transparent 70%)',
          }}
        />

        {/* Expanding frame (decorative — sits behind the text) */}
        <div
          style={{
            position: 'absolute',
            width,
            height,
            background: 'rgba(255,255,255,.022)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: radius,
            overflow: 'hidden',
            boxShadow: '0 0 80px rgba(26,128,248,.06) inset',
            transition: 'none',
            zIndex: 1,
          }}
        />

        {/* Text block — constant width, never reflows as the frame grows */}
        <div
          className="relative text-center"
          style={{ width: 'min(860px, 86vw)', zIndex: 2 }}
        >
          {/* Label */}
          <div
            className="font-grotesk text-[11px] font-semibold tracking-[.14em] uppercase mb-6"
            style={{ color: 'rgba(255,255,255,.35)' }}
          >
            Nosso Manifesto
          </div>

          {/* Text */}
          <p
            className="font-grotesk font-bold leading-[1.15]"
            style={{
              fontSize: 'clamp(24px,min(3.5vw,5vh),52px)',
              color: 'rgba(255,255,255,.9)',
              letterSpacing: '-.02em',
            }}
          >
            Acreditamos que sites incríveis não são apenas{' '}
            <strong style={{ color: 'var(--blue)' }}>construídos</strong> — eles são{' '}
            <em className="not-italic" style={{ color: 'var(--purple)' }}>dominados.</em>{' '}
            Estratégia define a direção, o capricho dá a alma, e{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(90deg, var(--blue), var(--purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              velocidade implacável
            </em>{' '}
            transforma ideias ousadas em{' '}
            <strong style={{ color: 'var(--blue)' }}>resultados reais.</strong>
          </p>
        </div>

        {/* Veil overlay — fades the whole stack out near the end */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,.82)',
            opacity: veilOp,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      </div>
    </section>
  );
}
