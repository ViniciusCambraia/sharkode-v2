import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import HoloCard from '../components/HoloCard';
import type { BadgeAction } from '../components/three/Lanyard';

// three.js lanyard is desktop-only: 1.1MB gzip has no place on event-venue 4G
const Lanyard = lazy(() => import('../components/three/Lanyard'));

import { wa, EMAIL as CONTACT_EMAIL } from '../lib/contact';

const WHATSAPP = wa('Olá! Vim pelo cartão da Sharkode e quero falar com um especialista.');
const EMAIL = `mailto:${CONTACT_EMAIL}`;
const SITE_URL = 'https://sharkode.com.br';

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
          <HoloCard />
        </div>
      );
    }
    return this.props.children;
  }
}

// framer's [0.22,1,0.36,1] as a CSS easing, reused by every entrance below
const EASE = 'cubic-bezier(0.22,1,0.36,1)';

/** Desktop = big screen with a real pointer; everyone else gets the holo card. */
function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    setDesktop(mq.matches);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
}

const haptic = () => navigator.vibrate?.(12);

/**
 * iOS-only "enable motion" pill. Apple requires DeviceMotion permission to be
 * requested from an explicit user gesture — a silent listener never triggers
 * the prompt reliably, so we surface a real button and hide it for the rest
 * of the session once granted.
 */
function GyroButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const DME = window.DeviceMotionEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    if (DME && typeof DME.requestPermission === 'function' && sessionStorage.getItem('gyro-ok') !== '1') {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const ask = () => {
    const DME = window.DeviceMotionEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    DME?.requestPermission?.()
      .then((s) => {
        if (s === 'granted') {
          sessionStorage.setItem('gyro-ok', '1');
          haptic();
          setShow(false);
        }
      })
      .catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={ask}
      className="absolute left-1/2 top-16 z-30 -translate-x-1/2 rounded-full border px-4 py-2 font-grotesk text-[11px] font-semibold uppercase tracking-[.12em] text-white/85"
      style={{
        borderColor: 'rgba(26,128,248,.4)',
        background: 'rgba(26,128,248,.14)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeSlideDown .6s cubic-bezier(.16,1,.3,1) .8s both',
      }}
    >
      ✨ Ativar movimento do crachá
    </button>
  );
}

export default function Contato() {
  const desktop = useDesktop();
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const share = () => {
    haptic();
    navigator.share?.({
      title: 'Sharkode — Websites & IA',
      text: 'Websites que mordem. Conhece a Sharkode:',
      url: SITE_URL,
    }).catch(() => {});
  };

  // Printed card buttons — the badge itself is the interface
  const onBadgeAction = (action: BadgeAction) => {
    haptic();
    if (action === 'whatsapp') window.open(WHATSAPP, '_blank', 'noopener');
    else window.location.href = '/sharkode.vcf';
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#07070f] text-white">
      <Helmet>
        <title>Fale com um especialista — Sharkode</title>
        <meta name="description" content="Você escaneou o crachá certo. Vamos transformar sua ideia em um site que domina." />
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Brand glow */}
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

      {/* Top bar — the escape hatch back to the site */}
      <header
        className="relative z-20 flex items-center justify-between px-5 pt-5 lg:px-10"
        style={{ animation: `fadeSlideDown .7s ${EASE} .1s both` }}
      >
        <Link to="/" className="inline-flex items-center gap-2" aria-label="Ir para o site da Sharkode">
          <img src="/SALVA_AI_GARAIO.webp" alt="Sharkode" className="h-6 w-auto shark-glow-nav" />
        </Link>
        <Link
          to="/"
          className="font-grotesk text-[11px] font-semibold uppercase tracking-[.14em] text-white/45 transition-colors hover:text-white"
        >
          Conheça o site →
        </Link>
      </header>

      {/* iOS motion permission — explicit gesture, as Apple requires */}
      <GyroButton />

      {/* Physics lanyard on EVERY device — on mobile the gyroscope drives
          gravity, so the badge swings with the phone in the visitor's hand.
          While the 3D chunk downloads (4G), the holo card holds the stage. */}
      <div className="absolute inset-0 z-0 h-[100dvh] w-full">
        <BadgeBoundary>
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center pb-[34vh] lg:pb-0">
                <HoloCard />
              </div>
            }
          >
            <Lanyard
              offsetX={desktop ? 0.9 : 0}
              offsetY={desktop ? 4.4 : 5.2}
              camZ={desktop ? 9 : 14}
              onAction={onBadgeAction}
            />
          </Suspense>
        </BadgeBoundary>
      </div>

      {/* Copy + actions — bottom (thumb zone) on mobile, left column on desktop */}
      <div className={`pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-8 lg:px-16 lg:pb-0 ${
        desktop ? 'justify-center' : 'justify-end'
      }`}>
        <div className="pointer-events-auto w-full max-w-[560px] text-center lg:text-left mx-auto lg:mx-0">
          <p
            className="font-grotesk text-[12px] font-semibold uppercase tracking-[.16em] text-[var(--blue)]"
            style={{ animation: `fadeSlideIn 0.7s ${EASE} 0.15s both` }}
          >
            Você escaneou o crachá certo
          </p>

          <h1
            className="mt-3 font-grotesk text-[clamp(22px,5.5vw,64px)] font-bold leading-[1.05] tracking-[-.03em]"
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

          {/* Proof line — the person just met us; give them a reason */}
          <p
            className="mt-3 font-grotesk text-[13px] text-white/50"
            style={{ animation: `fadeSlideIn 0.8s ${EASE} 0.4s both` }}
          >
            200+ projetos entregues · resposta em minutos
          </p>

          {/* Desktop actions — on mobile the printed card buttons take over */}
          <div
            className="mt-6 hidden gap-3 lg:flex lg:flex-row lg:items-start"
            style={{ animation: `fadeSlideIn 0.8s ${EASE} 0.52s both` }}
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={haptic}
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-grotesk text-[15px] font-semibold text-white transition-transform duration-300 hover:scale-[1.03] lg:py-3.5 lg:text-sm"
              style={{ background: 'linear-gradient(100deg, var(--blue), var(--indigo))' }}
            >
              Falar no WhatsApp →
            </a>
            <a
              href="/sharkode.vcf"
              download
              onClick={haptic}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[.03] px-7 py-4 font-grotesk text-[15px] font-semibold text-white/90 transition-colors duration-300 hover:bg-white/[.07] lg:py-3.5 lg:text-sm"
            >
              Salvar contato
            </a>
            {canShare && (
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-grotesk text-[13px] font-semibold text-white/45 transition-colors duration-300 hover:text-white lg:py-3.5"
              >
                Compartilhar cartão
              </button>
            )}
          </div>

          <p
            className="mt-5 hidden font-grotesk text-xs text-white/35 lg:block"
            style={{ animation: `fadeIn 1s ${EASE} 1.1s both` }}
          >
            Dica: arraste o crachá 👆
          </p>
          {/* Mobile: the card carries the CTAs — this is the accessible fallback
              (canvas buttons are invisible to screen readers) + the hint */}
          <div
            className="mt-4 flex items-center justify-center gap-3 font-grotesk text-[12px] text-white/45 lg:hidden"
            style={{ animation: `fadeSlideIn .8s ${EASE} 1.3s both` }}
          >
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" onClick={haptic} className="underline underline-offset-4">WhatsApp</a>
            <span className="text-white/20">·</span>
            <a href="/sharkode.vcf" download onClick={haptic} className="underline underline-offset-4">Salvar</a>
            <span className="text-white/20">·</span>
            <a href={EMAIL} className="underline underline-offset-4">E-mail</a>
            {canShare && (
              <>
                <span className="text-white/20">·</span>
                <button type="button" onClick={share} className="underline underline-offset-4">Compartilhar</button>
              </>
            )}
          </div>
          <p
            className="mt-3 font-grotesk text-[11px] text-white/30 lg:hidden"
            style={{ animation: `fadeIn 1s ${EASE} 1.6s both` }}
          >
            Toque nos botões do cartão — e chacoalhe o celular, ele dança 🦈
          </p>
        </div>
      </div>

      {/* Film grain — same material as the home */}
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
