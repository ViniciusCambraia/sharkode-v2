import { useEffect, useRef, useState } from 'react';
import { useStickyScroll } from '../hooks/useStickyScroll';

function cl(v: number) { return Math.max(0, Math.min(1, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(t: number) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

interface WordDef {
  text: string;
  accent?: 'blue' | 'purple';
  threshold: number; // p at which this word is fully lit
}

const words: WordDef[] = [
  { text: 'Transformamos', threshold: 0.15 },
  { text: 'ideias',        threshold: 0.35, accent: 'blue' },
  { text: 'em',            threshold: 0.50 },
  { text: 'sites',         threshold: 0.65 },
  { text: 'que',           threshold: 0.78 },
  { text: 'dominam.',      threshold: 0.95, accent: 'purple' },
];

const accentStyle = (accent: 'blue' | 'purple'): React.CSSProperties =>
  accent === 'blue'
    ? { background: 'linear-gradient(135deg,#1a80f8,#19c7f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
    : { background: 'linear-gradient(135deg,#3f19f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' };

const typo: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-.04em',
};

export default function KineticText() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress: p } = useStickyScroll(sectionRef as React.RefObject<HTMLElement | null>);
  // Scroll-scrubbed word lighting is a desktop experience — on touch the
  // 240vh runway reads as an empty page with 6%-opacity text. Mobile gets a
  // single screen where the words light themselves once the section is seen.
  const [mobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse), (max-width: 767px)').matches,
  );
  const [reduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const boxRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (!mobile) return;
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mobile]);

  if (mobile) {
    return (
      <section className="flex min-h-[72svh] items-center justify-center px-6 py-20">
        <div ref={boxRef} className="max-w-[1100px] text-center" style={{ ...typo, fontSize: 'clamp(38px,10vw,64px)' }}>
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: i < words.length - 1 ? '0.25em' : 0,
                color: word.accent ? undefined : 'rgba(255,255,255,.95)',
                ...(word.accent ? accentStyle(word.accent) : {}),
                ...(reduce || lit
                  ? reduce
                    ? { opacity: 1 }
                    : { animation: `wordLight .7s cubic-bezier(.16,1,.3,1) ${(i * 0.28).toFixed(2)}s both` }
                  : { opacity: 0.06, transform: 'translateY(20px)' }),
              }}
            >
              {word.text}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      style={{ height: '240vh', position: 'relative' }}
    >
      <div className="sticky top-0 h-[100svh] flex items-center justify-center overflow-hidden">
        <div
          className="max-w-[1100px] px-10 text-center"
          style={{ ...typo, fontSize: 'clamp(44px,min(9vw,12vh),120px)' }}
        >
          {words.map((word, i) => {
            // how lit is this word? 0→1 over a 0.15-wide window ending at threshold
            const litProgress = cl((p - (word.threshold - 0.15)) / 0.15);
            const litAmt = ease(litProgress);
            const isLit = litProgress > 0.01;

            const colorStyle: React.CSSProperties = isLit && word.accent ? accentStyle(word.accent) : {};

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  // apagada → sempre dim; acesa s/ accent → branco interpolado; acesa c/ accent → gradiente (colorStyle)
                  color: !isLit
                    ? 'rgba(255,255,255,.06)'
                    : !word.accent
                      ? `rgba(255,255,255,${lerp(0.06, 0.95, litAmt)})`
                      : undefined,
                  transform: `translateY(${lerp(20, 0, litAmt)}px)`,
                  transition: 'none',
                  marginRight: i < words.length - 1 ? '0.25em' : 0,
                  ...colorStyle,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
