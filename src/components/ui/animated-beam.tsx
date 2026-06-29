import { motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';

interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  color?: string;
  duration?: number;
  delay?: number;
  reverse?: boolean;
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  color = '#1a80f8',
  duration = 2.5,
  delay = 0,
  reverse = false,
}: AnimatedBeamProps) {
  const id = useId();
  const [path, setPath] = useState('');
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    function update() {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const cr = container.getBoundingClientRect();
      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();

      // Connect at the edges facing each other (never cross the icon body)
      const fCx = fr.left + fr.width / 2;
      const tCx = tr.left + tr.width / 2;
      const fromIsLeft = fCx < tCx;

      const fx = (fromIsLeft ? fr.right : fr.left) - cr.left;
      const tx = (fromIsLeft ? tr.left : tr.right) - cr.left;
      const fy = fr.top + fr.height / 2 - cr.top;
      const ty = tr.top + tr.height / 2 - cr.top;

      // Cubic bezier: exit horizontally from source, arrive horizontally at target
      const dist = Math.abs(tx - fx);
      const curvature = Math.max(60, dist * 0.35);
      setPath(`M${fx},${fy} C${fx + curvature},${fy} ${tx - curvature},${ty} ${tx},${ty}`);
    }

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [containerRef, fromRef, toRef]);

  useEffect(() => {
    if (pathRef.current && path) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [path]);

  if (!path) return null;

  const glowId = `glow-${id}`;
  const beamLen = 80;
  const start = reverse ? -beamLen : pathLength + beamLen;
  const end   = reverse ? pathLength + beamLen : -beamLen;

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: '100%', height: '100%', zIndex: 0 }}
    >
      <defs>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Dim base line */}
      <path d={path} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.2" />

      {/* Invisible path used for length calculation */}
      <path ref={pathRef} d={path} fill="none" stroke="none" />

      {/* Animated beam */}
      {pathLength > 0 && (
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${beamLen} ${pathLength + beamLen * 2}`}
          filter={`url(#${glowId})`}
          initial={{ strokeDashoffset: start, opacity: 0 }}
          animate={{ strokeDashoffset: [start, end], opacity: [0, 1, 1, 0] }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.07, 0.93, 1],
          }}
        />
      )}
    </svg>
  );
}
