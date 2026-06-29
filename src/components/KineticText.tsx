import { useRef } from 'react';
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

export default function KineticText() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress: p } = useStickyScroll(sectionRef as React.RefObject<HTMLElement | null>);

  return (
    <section
      ref={sectionRef}
      style={{ height: '240vh', position: 'relative' }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div
          className="max-w-[1100px] px-10 text-center"
          style={{ fontSize: 'clamp(44px,9vw,120px)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.04em' }}
        >
          {words.map((word, i) => {
            // how lit is this word? 0→1 over a 0.15-wide window ending at threshold
            const litProgress = cl((p - (word.threshold - 0.15)) / 0.15);
            const lit = ease(litProgress);
            const isLit = litProgress > 0.01;

            const colorStyle: React.CSSProperties = isLit && word.accent
              ? word.accent === 'blue'
                ? { background: 'linear-gradient(135deg,#1a80f8,#19c7f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
                : { background: 'linear-gradient(135deg,#3f19f7,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
              : {};

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  // apagada → sempre dim; acesa s/ accent → branco interpolado; acesa c/ accent → gradiente (colorStyle)
                  color: !isLit
                    ? 'rgba(255,255,255,.06)'
                    : !word.accent
                      ? `rgba(255,255,255,${lerp(0.06, 0.95, lit)})`
                      : undefined,
                  transform: `translateY(${lerp(20, 0, lit)}px)`,
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
