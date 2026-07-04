import { Component, lazy, Suspense, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

const Lanyard = lazy(() => import('../components/three/Lanyard'));

const WHATSAPP = 'https://wa.me/5519989115066?text=' +
  encodeURIComponent('Olá! Vim pelo cartão da Sharkode e quero falar com um especialista.');
const EMAIL = 'mailto:adm@sharkode.com.br';

/** Falls back to a static card if WebGL/3D fails on the device. */
class BadgeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="w-[190px] rounded-2xl border border-white/10 bg-gradient-to-b from-[#33343b] to-[#26272d] p-6 text-center shadow-2xl">
            <img src="/favicon.svg" alt="" className="mx-auto mb-4 h-10 w-10" />
            <p className="font-grotesk text-sm text-white/90">sharkode.com.br</p>
            <p className="mt-1 font-grotesk text-xs text-white/50">+55 (19) 98911-5066</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// framer's [0.22,1,0.36,1] as a CSS easing, reused by every entrance below
const EASE = 'cubic-bezier(0.22,1,0.36,1)';

export default function Contato() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#07070f] text-white">
      <Helmet>
        <title>Fale com um especialista — Sharkode</title>
        <meta name="description" content="Você escaneou o crachá certo. Vamos transformar sua ideia em um site que domina." />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Animated brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          animation: `fadeIn 1.4s ${EASE} both`,
          background:
            'radial-gradient(60% 50% at 20% 15%, rgba(26,128,248,.18), transparent 70%),' +
            'radial-gradient(50% 45% at 85% 80%, rgba(192,132,252,.16), transparent 70%)',
        }}
      />

      {/* 3D badge canvas — full-bleed (full width/height) so the card is never
          clipped by the canvas edge and sits behind the copy. */}
      <div className="absolute inset-0 z-0 h-[100dvh] w-full">
        <BadgeBoundary>
          <Suspense fallback={null}>
            <Lanyard />
          </Suspense>
        </BadgeBoundary>
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-[100dvh] flex-col justify-end px-6 pb-14 lg:justify-center lg:px-16 lg:pb-0">
        {/* Copy + CTAs */}
        <div className="pointer-events-auto w-full max-w-[560px] text-center lg:text-left">
          <p
            className="font-grotesk text-[12px] font-semibold uppercase tracking-[.16em] text-[var(--blue)]"
            style={{ animation: `fadeSlideIn 0.7s ${EASE} 0.15s both` }}
          >
            Você escaneou o crachá certo
          </p>

          <h1
            className="mt-4 font-grotesk text-[clamp(34px,7vw,64px)] font-bold leading-[1.05] tracking-[-.03em]"
            style={{ animation: `fadeSlideIn 0.8s ${EASE} 0.28s both` }}
          >
            Vamos construir algo que{' '}
            <span
              style={{
                background: 'linear-gradient(100deg, var(--blue), var(--purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              domina.
            </span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-[480px] text-[15px] leading-relaxed text-white/60 lg:mx-0"
            style={{ animation: `fadeSlideIn 0.8s ${EASE} 0.42s both` }}
          >
            Estratégia, design e um site rápido de verdade para transformar sua ideia em
            resultado. Fale com a gente — respondemos rápido.
          </p>

          <div
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
            style={{ animation: `fadeSlideIn 0.8s ${EASE} 0.56s both` }}
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 font-grotesk text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03] sm:w-auto"
              style={{ background: 'linear-gradient(100deg, var(--blue), var(--indigo))' }}
            >
              Falar no WhatsApp →
            </a>
            <a
              href={EMAIL}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[.03] px-7 py-3.5 font-grotesk text-sm font-semibold text-white/90 transition-colors duration-300 hover:bg-white/[.07] sm:w-auto"
            >
              Enviar e-mail
            </a>
          </div>

          <p
            className="mt-8 font-grotesk text-xs text-white/35"
            style={{ animation: `fadeIn 1s ${EASE} 1.1s both` }}
          >
            Dica: arraste o crachá 👆
          </p>
        </div>
      </div>
    </div>
  );
}
