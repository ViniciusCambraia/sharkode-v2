import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

gsap.registerPlugin(ScrollTrigger);

const cases = [
  {
    accent: '#10b981',
    tag: 'MARCA + IDENTIDADE',
    title: 'RR Farma',
    badge: { icon: '↑', text: '+120% reconhecimento' },
    bg: 'linear-gradient(160deg,#080e0b 0%,#071210 100%)',
    image: '/assets/rrfarma.webp',
  },
  {
    accent: '#f59e0b',
    tag: 'LANDING PAGE + EVENTO',
    title: 'Feira Vocacional',
    badge: { icon: '◎', text: '3x mais inscrições' },
    bg: 'linear-gradient(160deg,#0d0b04 0%,#120e00 100%)',
    image: '/assets/ZJ03ONjdwfVJ5yY3WcpQq079dpY.webp',
  },
  {
    accent: '#19c7f7',
    tag: 'SITE INSTITUCIONAL',
    title: 'Luz de Cristo',
    badge: { icon: '✦', text: 'Abre em 1 segundo' },
    bg: 'linear-gradient(160deg,#050810 0%,#070b18 100%)',
    image: '/assets/ui1Dx6RLaNfihwrW7ucriC0rFKk.webp',
  },
];

/* ── Real project photo inside each card ── */
function ProjectPhoto({ src, accent }: { src: string; accent: string }) {
  return (
    <div
      className="absolute inset-x-6 top-6 bottom-20 rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${accent}22` }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
      {/* Dark overlay so bottom text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.1) 60%, transparent 100%)`,
        }}
      />
      {/* Subtle accent tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${accent}18 0%, transparent 60%)` }}
      />
    </div>
  );
}

/* ── Fan card container ── */
const CARD_W = 440;
const CARD_H = 540;
const FAN_STEP = 240; // px between card left edges

function WorkFan() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('.work-fan-card');

    // Initial: all cards stacked (centered), invisible
    gsap.set(cards, {
      x: FAN_STEP, // start at middle card position
      autoAlpha: 0,
      scale: 0.9,
    });

    const tween = gsap.to(cards, {
      x: (_i: number) => _i * FAN_STEP,
      autoAlpha: 1,
      scale: 1,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(cards, { clearProps: 'opacity,visibility,transform,x,y,scale' });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{
        width: CARD_W + FAN_STEP * (cases.length - 1),
        height: CARD_H,
        maxWidth: '100%',
      }}
    >
      {cases.map(({ accent, tag, title, badge, bg, image }, i) => (
        <div
          key={title}
          className="work-fan-card absolute rounded-[24px] overflow-hidden cursor-pointer group"
          style={{
            width: CARD_W,
            height: CARD_H,
            left: 0,
            top: 0,
            zIndex: i + 1,
            background: bg,
            border: `1px solid ${accent}22`,
            boxShadow: `0 24px 60px rgba(0,0,0,.5), 0 0 0 0.5px ${accent}15`,
            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = `translateX(${i * FAN_STEP}px) translateY(-10px)`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 36px 80px rgba(0,0,0,.6), 0 0 0 1px ${accent}40`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = `translateX(${i * FAN_STEP}px)`;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 60px rgba(0,0,0,.5), 0 0 0 0.5px ${accent}15`;
          }}
        >
          {/* Project photo */}
          <ProjectPhoto src={image} accent={accent} />

          {/* Bottom info overlay */}
          <div
            className="absolute inset-x-0 bottom-0 px-6 py-5"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,.85) 60%, transparent)' }}
          >
            <p
              className="font-grotesk text-[10px] font-semibold tracking-[.14em] mb-2"
              style={{ color: accent }}
            >
              {tag}
            </p>
            <p className="font-grotesk font-bold text-white text-[20px] mb-3 leading-tight">
              {title}
            </p>
            {/* Metric badge */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{
                background: 'rgba(255,255,255,.1)',
                color: 'rgba(255,255,255,.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,.12)',
              }}
            >
              <span style={{ color: accent }}>{badge.icon}</span>
              {badge.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Section ── */
export default function Work() {
  const headerRef = useGsapFadeUp();

  return (
    <section className="py-24 md:py-36 overflow-hidden" style={{ borderTop: '1px solid var(--bd)' }}>
      <div className="max-w-[var(--w)] mx-auto px-5">

        {/* Header — left-aligned, referência style */}
        <div ref={headerRef} className="mb-16 max-w-xl">
          <p
            className="font-grotesk text-[11px] font-semibold tracking-[.16em] uppercase mb-5"
            style={{ color: 'var(--blue)' }}
          >
            Trabalhos Selecionados
          </p>
          <h2
            className="font-grotesk font-bold text-white mb-4"
            style={{ fontSize: 'clamp(32px,4.5vw,58px)', lineHeight: 1.05, letterSpacing: '-.025em' }}
          >
            Resultados que nos orgulham
          </h2>
          <p className="font-grotesk text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,.45)' }}>
            Um recorte das marcas que ajudamos a crescer e decolar.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-grotesk text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-blue-500/10"
            style={{
              border: '1px solid rgba(26,128,248,.35)',
              color: 'rgba(255,255,255,.7)',
            }}
          >
            Ver todos os projetos
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Fan deck */}
        <WorkFan />

      </div>
    </section>
  );
}
