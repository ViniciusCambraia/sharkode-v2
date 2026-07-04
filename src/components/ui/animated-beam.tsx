import { useEffect, useId, useRef, useState } from 'react';

// prefers-reduced-motion, no framer-motion dependency
function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduce;
}

export interface Beam {
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  color: string;
  delay: number;
  reverse?: boolean;
}

interface BeamFieldProps {
  containerRef: React.RefObject<HTMLElement | null>;
  beams: Beam[];
  duration?: number;
  hubRef?: React.RefObject<HTMLElement | null>;
}

/**
 * All connector beams in a SINGLE <svg> sharing ONE glow filter (was 10 SVGs +
 * 10 filters). Animations only mount while the diagram is on-screen (Intersection
 * Observer) and fall back to static lines under prefers-reduced-motion.
 */
export function BeamField({ containerRef, beams, duration = 2.5, hubRef }: BeamFieldProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const [paths, setPaths] = useState<string[]>([]);
  const [lengths, setLengths] = useState<number[]>([]);
  const [active, setActive] = useState(false);
  const [hub, setHub] = useState<{ x: number; y: number; r: number } | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Compute every path in one pass (mount + resize).
  useEffect(() => {
    function update() {
      const container = containerRef.current;
      if (!container) return;
      const cr = container.getBoundingClientRect();
      const h = hubRef?.current;
      if (h) {
        const hr = h.getBoundingClientRect();
        setHub({
          x: hr.left + hr.width / 2 - cr.left,
          y: hr.top + hr.height / 2 - cr.top,
          r: cr.width * 0.55,
        });
      }
      setPaths(
        beams.map(({ fromRef, toRef }) => {
          const from = fromRef.current;
          const to = toRef.current;
          if (!from || !to) return '';
          const fr = from.getBoundingClientRect();
          const tr = to.getBoundingClientRect();
          const fCx = fr.left + fr.width / 2;
          const tCx = tr.left + tr.width / 2;
          const fromIsLeft = fCx < tCx;
          const fx = (fromIsLeft ? fr.right : fr.left) - cr.left;
          const tx = (fromIsLeft ? tr.left : tr.right) - cr.left;
          const fy = fr.top + fr.height / 2 - cr.top;
          const ty = tr.top + tr.height / 2 - cr.top;
          const dist = Math.abs(tx - fx);
          const curvature = Math.max(60, dist * 0.35);
          return `M${fx},${fy} C${fx + curvature},${fy} ${tx - curvature},${ty} ${tx},${ty}`;
        }),
      );
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [containerRef, beams, hubRef]);

  // Measure lengths once the paths are in the DOM.
  useEffect(() => {
    if (!paths.length) return;
    setLengths(paths.map((_, i) => pathRefs.current[i]?.getTotalLength() ?? 0));
  }, [paths]);

  // Pause all animation work when the diagram is scrolled out of view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      rootMargin: '120px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, [containerRef]);

  const railId = `beam-rail-${id}`;
  const beamLen = 80;

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: '100%', height: '100%', zIndex: 0 }}
    >
      <defs>
        {/* Rails glow brighter near the hub and fade toward the nodes */}
        {hub && (
          <radialGradient id={railId} gradientUnits="userSpaceOnUse" cx={hub.x} cy={hub.y} r={hub.r}>
            <stop offset="0" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="0.6" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
          </radialGradient>
        )}
      </defs>

      {/* Always-on base rails + invisible measuring paths */}
      {paths.map((d, i) =>
        d ? (
          <path
            key={`base-${i}`}
            d={d}
            fill="none"
            stroke={hub ? `url(#${railId})` : 'rgba(255,255,255,0.08)'}
            strokeWidth="1.4"
          />
        ) : null,
      )}
      {paths.map((d, i) =>
        d ? (
          <path
            key={`measure-${i}`}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke="none"
          />
        ) : null,
      )}

      {/* Moving beams — only while visible and motion is allowed.
          Glow is a wide translucent "halo" stroke under a sharp core (2 cheap
          strokes) instead of an feGaussianBlur that re-rasterizes every frame.
          The travel + fade run as CSS animations, so there's no per-frame JS. */}
      {active &&
        !reduce &&
        beams.map((b, i) => {
          const d = paths[i];
          const len = lengths[i];
          if (!d || !len) return null;
          const start = b.reverse ? -beamLen : len + beamLen;
          const end = b.reverse ? len + beamLen : -beamLen;
          const groupStyle = {
            '--beam-start': `${start}`,
            '--beam-end': `${end}`,
            '--beam-dur': `${duration}s`,
            '--beam-delay': `${b.delay}s`,
            strokeDasharray: `${beamLen} ${len + beamLen * 2}`,
          } as React.CSSProperties;
          return (
            <g key={`beam-${i}`} className="beam-fade" style={groupStyle}>
              <path className="beam-move" d={d} fill="none" stroke={b.color} strokeWidth="7" strokeLinecap="round" opacity={0.35} />
              <path className="beam-move" d={d} fill="none" stroke={b.color} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          );
        })}

      {/* Reduced motion: keep the diagram legible with static colored rails */}
      {reduce &&
        paths.map((d, i) =>
          d ? (
            <path key={`static-${i}`} d={d} fill="none" stroke={beams[i].color} strokeWidth="1.6" opacity="0.5" />
          ) : null,
        )}
    </svg>
  );
}
