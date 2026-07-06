import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import '../lib/eases';

/**
 * Transição de rota "mordida": duas mandíbulas serrilhadas fecham sobre a
 * tela (ease bite), a rota troca escondida atrás dos dentes, e elas reabrem
 * (drift). A marca morde a cada navegação — e o wipe mascara o custo do
 * code-split da rota de destino.
 *
 * Disparo: bite('/rota') de qualquer lugar (evento global). Sem View
 * Transitions API — overlay próprio funciona em todo navegador, sem race.
 */
export const bite = (to: string) =>
  window.dispatchEvent(new CustomEvent<string>('sharkode:bite', { detail: to }));

const TEETH = 11;
function jawClip(top: boolean): string {
  const step = 100 / TEETH;
  const gum = 74; // % da caixa onde começa a gengiva
  const pts: string[] = top
    ? ['0% 0%', '100% 0%', `100% ${gum}%`]
    : ['0% 100%', '100% 100%', `100% ${100 - gum}%`];
  for (let i = TEETH; i > 0; i--) {
    const tipX = (i - 0.5) * step;
    const baseX = (i - 1) * step;
    if (top) {
      pts.push(`${tipX}% 100%`, `${baseX}% ${gum}%`);
    } else {
      pts.push(`${tipX}% 0%`, `${baseX}% ${100 - gum}%`);
    }
  }
  return `polygon(${pts.join(', ')})`;
}

export default function BiteTransition() {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    const onBite = (e: Event) => {
      const to = (e as CustomEvent<string>).detail;
      const wrap = wrapRef.current, top = topRef.current, bot = botRef.current;
      if (!wrap || !top || !bot || busy.current) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigate(to);
        return;
      }
      busy.current = true;
      wrap.style.pointerEvents = 'auto';
      navigator.vibrate?.(20);

      const tl = gsap.timeline({
        onComplete: () => {
          wrap.style.pointerEvents = 'none';
          busy.current = false;
        },
      });
      // mandíbulas fecham (o bote)
      tl.fromTo(top, { yPercent: -101 }, { yPercent: 0, duration: 0.42, ease: 'bite' }, 0);
      tl.fromTo(bot, { yPercent: 101 }, { yPercent: 0, duration: 0.42, ease: 'bite' }, 0);
      // troca de rota escondida atrás dos dentes
      tl.call(() => { navigate(to); window.scrollTo(0, 0); });
      // reabrem revelando a página nova
      tl.to(top, { yPercent: -101, duration: 0.65, ease: 'drift' }, '+=0.3');
      tl.to(bot, { yPercent: 101, duration: 0.65, ease: 'drift' }, '<');
    };
    window.addEventListener('sharkode:bite', onBite);
    return () => window.removeEventListener('sharkode:bite', onBite);
  }, [navigate]);

  return (
    <div ref={wrapRef} className="pointer-events-none fixed inset-0 z-[10060]" aria-hidden="true">
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 h-[52%]"
        style={{
          background: 'linear-gradient(180deg, #04060c 0%, #070b16 100%)',
          clipPath: jawClip(true),
          transform: 'translateY(-101%)',
        }}
      />
      <div
        ref={botRef}
        className="absolute inset-x-0 bottom-0 h-[52%]"
        style={{
          background: 'linear-gradient(0deg, #04060c 0%, #070b16 100%)',
          clipPath: jawClip(false),
          transform: 'translateY(101%)',
        }}
      />
    </div>
  );
}
