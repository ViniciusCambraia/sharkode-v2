import { useEffect, useRef } from 'react';

/**
 * Deep-water background with a LIVING SCHOOL OF FISH.
 * Real boid flocking (alignment / cohesion / separation) rendered as streaks
 * of light. The school flees from the cursor — the visitor IS the shark —
 * and scatters in a burst on click. Depth gradient + right-anchored brand
 * bloom underneath keep the composition balanced.
 *
 * Pure canvas 2D, no deps. Pauses on hidden tab; static gradient under
 * prefers-reduced-motion.
 */

interface Fish {
  x: number; y: number;
  vx: number; vy: number;
  z: number;              // depth layer 0.45..1 → size/speed/alpha
  hue: 0 | 1 | 2;         // 0 pale, 1 cyan, 2 brand blue
}

export default function OceanDepth() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    // Phones: lower render resolution — the fish are streaks of light behind
    // blur-free dark water; nobody sees the difference, batteries do.
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);

    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ---------- backdrop ---------- */
    const REST_X = 0.72, REST_Y = 0.5;
    const mouse = { x: -9999, y: -9999, nx: 0.5, ny: 0.5 };

    const drawBackdrop = () => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#07070f');
      g.addColorStop(0.6, '#06080f');
      g.addColorStop(1, '#050912');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const gx = w * (REST_X + (mouse.nx - 0.5) * 0.1);
      const gy = h * (REST_Y + (mouse.ny - 0.5) * 0.08);
      const bloom = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.62);
      bloom.addColorStop(0, 'rgba(26,128,248,0.24)');
      bloom.addColorStop(0.35, 'rgba(22,100,220,0.09)');
      bloom.addColorStop(1, 'rgba(26,128,248,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      const counter = ctx.createRadialGradient(w * 0.12, h * 1.05, 0, w * 0.12, h * 1.05, Math.max(w, h) * 0.45);
      counter.addColorStop(0, 'rgba(25,199,247,0.06)');
      counter.addColorStop(1, 'rgba(25,199,247,0)');
      ctx.fillStyle = counter;
      ctx.fillRect(0, 0, w, h);
    };

    if (reduce) {
      drawBackdrop();
      return () => window.removeEventListener('resize', resize);
    }

    /* ---------- the school ---------- */
    // Coarse pointer = phone: half the school (no cursor to flee from anyway)
    const COUNT = Math.round(Math.min(240, (w * h) / (coarse ? 11000 : 6200)));
    const fish: Fish[] = Array.from({ length: COUNT }, () => {
      const a = Math.random() * Math.PI * 2;
      const s = 1.2 + Math.random() * 1.2;
      return {
        x: Math.random() * 10000 % w,
        y: Math.random() * 10000 % h,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        z: 0.45 + Math.random() * 0.55,
        hue: (Math.random() < 0.78 ? 0 : Math.random() < 0.7 ? 1 : 2) as 0 | 1 | 2,
      };
    });

    const PERCEIVE = 52;       // neighbor radius
    const SEP = 22;            // personal space
    const FLEE_R = 150;        // predator radius around cursor
    const MAX_V = 2.6, MIN_V = 1.1;
    const COLORS = [
      (a: number) => `rgba(150,195,255,${a})`,
      (a: number) => `rgba(25,199,247,${a})`,
      (a: number) => `rgba(26,128,248,${a})`,
    ];

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.nx = e.clientX / w;
      mouse.ny = e.clientY / h;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    // Click = bite: shockwave impulse through the school
    const onDown = (e: MouseEvent) => {
      for (const f of fish) {
        const dx = f.x - e.clientX, dy = f.y - e.clientY;
        const d = Math.hypot(dx, dy);
        if (d < 260 && d > 0.001) {
          const k = (1 - d / 260) * 7;
          f.vx += (dx / d) * k;
          f.vy += (dy / d) * k;
        }
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    document.documentElement.addEventListener('mouseleave', onLeave);

    let raf = 0;
    let running = true;

    const step = () => {
      for (let i = 0; i < fish.length; i++) {
        const f = fish[i];
        let ax = 0, ay = 0;
        let cx = 0, cy = 0, vxs = 0, vys = 0, n = 0;

        for (let j = 0; j < fish.length; j++) {
          if (j === i) continue;
          const o = fish[j];
          const dx = o.x - f.x, dy = o.y - f.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > PERCEIVE * PERCEIVE) continue;
          n++;
          cx += o.x; cy += o.y;
          vxs += o.vx; vys += o.vy;
          if (d2 < SEP * SEP && d2 > 0.001) {
            const d = Math.sqrt(d2);
            ax -= (dx / d) * (1 - d / SEP) * 0.9;
            ay -= (dy / d) * (1 - d / SEP) * 0.9;
          }
        }
        if (n > 0) {
          // cohesion
          ax += ((cx / n) - f.x) * 0.0028;
          ay += ((cy / n) - f.y) * 0.0028;
          // alignment
          ax += ((vxs / n) - f.vx) * 0.055;
          ay += ((vys / n) - f.vy) * 0.055;
        }

        // flee the predator (cursor)
        const pdx = f.x - mouse.x, pdy = f.y - mouse.y;
        const pd = Math.hypot(pdx, pdy);
        if (pd < FLEE_R && pd > 0.001) {
          const k = (1 - pd / FLEE_R) * 1.35;
          ax += (pdx / pd) * k;
          ay += (pdy / pd) * k;
        }

        // soft walls
        const M = 70, W = 0.06;
        if (f.x < M) ax += W;
        if (f.x > w - M) ax -= W;
        if (f.y < M) ay += W;
        if (f.y > h - M) ay -= W;

        // gentle wander so the school never fully stalls
        ax += (Math.random() - 0.5) * 0.04;
        ay += (Math.random() - 0.5) * 0.04;

        f.vx += ax; f.vy += ay;
        const sp = Math.hypot(f.vx, f.vy);
        const cap = MAX_V * f.z + 0.6;
        if (sp > cap) { f.vx = (f.vx / sp) * cap; f.vy = (f.vy / sp) * cap; }
        else if (sp < MIN_V) { f.vx = (f.vx / sp) * MIN_V; f.vy = (f.vy / sp) * MIN_V; }

        f.x += f.vx * f.z;
        f.y += f.vy * f.z;

        // hard wrap as safety net (soft walls should prevent this)
        if (f.x < -20) f.x = w + 20; else if (f.x > w + 20) f.x = -20;
        if (f.y < -20) f.y = h + 20; else if (f.y > h + 20) f.y = -20;
      }
    };

    const draw = () => {
      drawBackdrop();
      ctx.globalCompositeOperation = 'screen';
      ctx.lineCap = 'round';
      for (const f of fish) {
        const sp = Math.hypot(f.vx, f.vy) || 1;
        const len = (5 + 6 * f.z) * Math.min(1.4, sp / 1.8);
        const ux = f.vx / sp, uy = f.vy / sp;
        const alpha = 0.16 + 0.4 * f.z;
        // faint halo under a bright core = cheap glow
        ctx.strokeStyle = COLORS[f.hue](alpha * 0.35);
        ctx.lineWidth = 2.6 * f.z;
        ctx.beginPath();
        ctx.moveTo(f.x - ux * len, f.y - uy * len);
        ctx.lineTo(f.x, f.y);
        ctx.stroke();
        ctx.strokeStyle = COLORS[f.hue](alpha);
        ctx.lineWidth = 1.1 * f.z;
        ctx.beginPath();
        ctx.moveTo(f.x - ux * len * 0.7, f.y - uy * len * 0.7);
        ctx.lineTo(f.x, f.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const frame = () => {
      if (!running) return;
      step();
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />;
}
