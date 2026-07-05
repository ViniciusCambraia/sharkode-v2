import { useRef, useState } from 'react';
import { useStickyScroll } from '../hooks/useStickyScroll';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** The manifesto copy — shared by the desktop scroll theater and the mobile card. */
function ManifestoContent({ fontSize }: { fontSize: string }) {
  return (
    <>
      {/* Label */}
      <div
        className="font-grotesk text-[11px] font-semibold tracking-[.14em] uppercase mb-6 relative"
        style={{ zIndex: 1, color: 'rgba(255,255,255,.35)' }}
      >
        Nosso Manifesto
      </div>

      {/* Text */}
      <p
        className="font-grotesk font-bold leading-[1.25] relative"
        style={{
          fontSize,
          color: 'rgba(255,255,255,.9)',
          maxWidth: '860px',
          letterSpacing: '-.02em',
          zIndex: 1,
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
    </>
  );
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress: p } = useStickyScroll(sectionRef as React.RefObject<HTMLElement | null>);
  const fadeRef = useGsapFadeUp<HTMLDivElement>();
  // Scroll-jack is a desktop mouse experience. On touch, native scroll fires
  // irregular events → the resizing frame reflows/jitters and 340vh of pin
  // feels stuck. Mobile gets the same manifesto as a calm static card.
  const [mobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse), (max-width: 767px)').matches,
  );
  const e = easeInOutQuad(p);

  if (mobile) {
    return (
      <section className="px-5 py-24">
        <div
          ref={fadeRef}
          className="mx-auto flex max-w-[560px] flex-col items-center text-center"
          style={{
            background: 'rgba(255,255,255,.022)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: '24px',
            padding: '48px 26px',
            boxShadow: '0 0 60px rgba(26,128,248,.06) inset',
          }}
        >
          <ManifestoContent fontSize="clamp(21px,5.8vw,26px)" />
        </div>
      </section>
    );
  }

  const width = `${62 + 38 * e}vw`;
  const height = `${56 + 44 * e}svh`;
  const radius = `${(28 * (1 - e)).toFixed(2)}px`;
  const veilOp = Math.max(0, Math.min(1, (p - 0.7) / 0.3));

  return (
    <section
      ref={sectionRef}
      style={{ height: '340vh', position: 'relative' }}
    >
      {/* 100svh, não 100vh: no mobile a barra do navegador recolhe e 100vh
          muda de tamanho no meio do scroll — o sticky "pula". svh é estável. */}
      <div className="sticky top-0 h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(26,128,248,.06) 0%, transparent 70%)',
          }}
        />

        {/* Expanding frame */}
        <div
          style={{
            width,
            height,
            background: 'rgba(255,255,255,.022)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: radius,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(40px,6vw,80px) clamp(32px,5vw,80px)',
            boxShadow: '0 0 80px rgba(26,128,248,.06) inset',
            transition: 'none',
          }}
        >
          {/* Veil overlay — fades the whole stack out near the end */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,.82)',
              opacity: veilOp,
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />

          <ManifestoContent fontSize="clamp(24px,min(3.5vw,5vh),52px)" />
        </div>
      </div>
    </section>
  );
}
