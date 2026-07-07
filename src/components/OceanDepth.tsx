import { useEffect, useRef } from 'react';

/**
 * Deep-water background — o coração visual do Sharkode.
 *
 * Sistemas (todos no mesmo canvas/rAF):
 * 1. CARDUME (boids): peixes-luz com flocking real; fogem do cursor/dedo,
 *    explodem no clique/tap.
 * 2. DESCIDA: o scroll é profundidade — o fundo escurece, o cardume rareia e
 *    desacelera, a bioluminescência sobe. (Aposta 2 do plano de excelência.)
 * 3. CONVERGÊNCIA: uma vez por visita (e no easter egg "shark"), o cardume
 *    para de fugir e converge numa silhueta de tubarão atrás do headline,
 *    dá o bote e explode de volta. O twist: o cardume ERA o predador.
 *    (Aposta 1 — ref. Igloo Inc, SOTY 2024.)
 *
 * Puro canvas 2D. Pausa em aba oculta; gradiente estático em reduced-motion.
 */

interface Fish {
  x: number; y: number;
  vx: number; vy: number;
  z: number;              // camada de profundidade 0.45..1 → tamanho/vel/alpha
  hue: 0 | 1 | 2;         // 0 pálido, 1 ciano, 2 azul-marca
  tx: number; ty: number; // alvo na convergência
}

type Mode = 'school' | 'converge' | 'hold' | 'strike' | 'burst';

/* Silhueta de tubarão (perfil, nadando para a ESQUERDA — em direção ao
   headline). Construída por UNIÃO de primitivas (elipses+triângulos) numa
   caixa 520×260 — um path desenhado à mão se auto-intersecta e o fill vira
   ruído (aprendido na prática). A boca é recortada com destination-out. */
function drawShark(c: CanvasRenderingContext2D) {
  c.fillStyle = '#fff';
  const ell = (cx: number, cy: number, rx: number, ry: number) => {
    c.beginPath();
    c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    c.fill();
  };
  const tri = (a: [number, number], b: [number, number], d: [number, number]) => {
    c.beginPath();
    c.moveTo(a[0], a[1]);
    c.lineTo(b[0], b[1]);
    c.lineTo(d[0], d[1]);
    c.closePath();
    c.fill();
  };
  ell(250, 130, 195, 52);                       // corpo
  ell(85, 132, 75, 38);                         // focinho
  tri([215, 92], [252, 14], [292, 92]);         // dorsal
  tri([428, 118], [516, 26], [462, 140]);       // cauda — lobo superior
  tri([428, 142], [504, 208], [456, 126]);      // cauda — lobo inferior
  tri([155, 158], [208, 248], [224, 160]);      // peitoral
  // boca aberta: recorta uma cunha no focinho
  c.globalCompositeOperation = 'destination-out';
  tri([2, 150], [98, 122], [98, 182]);
  c.globalCompositeOperation = 'source-over';
}

interface SharkShape {
  pts: Array<{ x: number; y: number }>;
  bw: number; // caixa da forma
  bh: number;
}


/* ~240 pontos não LEEM uma forma preenchida — mas leem perfeitamente um
   CONTORNO (liga-pontos). Amostra a BORDA + ~15% de miolo. */
function samplePoints(data: Uint8ClampedArray, W: number, H: number, count: number,
  x0 = 0, y0 = 0, x1 = W, y1 = H, alphaMin = 128): SharkShape {
  const on = (x: number, y: number) =>
    x >= x0 && x < x1 && y >= y0 && y < y1 && data[(y * W + x) * 4 + 3] > alphaMin;
  const edge: Array<{ x: number; y: number }> = [];
  const fill: Array<{ x: number; y: number }> = [];
  const step = Math.max(1, Math.round((x1 - x0) / 260));
  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      if (!on(x, y)) continue;
      if (!on(x - step, y) || !on(x + step, y) || !on(x, y - step) || !on(x, y + step)) {
        edge.push({ x: x - x0, y: y - y0 });
      } else {
        fill.push({ x: x - x0, y: y - y0 });
      }
    }
  }
  const pts: Array<{ x: number; y: number }> = [];
  const nEdge = Math.min(edge.length, Math.round(count * 0.85));
  const stride = 7919; // primo → espalha sem padrão de varredura
  for (let i = 0; i < nEdge && edge.length; i++) pts.push(edge[(i * stride) % edge.length]);
  for (let i = pts.length; i < count && (fill.length || edge.length); i++) {
    pts.push(fill.length ? fill[(i * stride) % fill.length] : edge[i % edge.length]);
  }
  return { pts, bw: x1 - x0, bh: y1 - y0 };
}

/* Fallback (offline/decode falhou): silhueta por primitivas. */
function sampleShark(count: number): SharkShape {
  const W = 520, H = 260;
  const off = document.createElement('canvas');
  off.width = W; off.height = H;
  const c = off.getContext('2d')!;
  drawShark(c);
  const shape = samplePoints(c.getImageData(0, 0, W, H).data, W, H, count);
  return shape;
}

/* A FORMA REAL: o tubarão da logo. O arquivo é o wordmark completo
   (tubarão + "sharkode") — recorta só o tubarão achando o vão de colunas
   transparentes entre ele e o texto. */
async function sampleLogoShark(count: number): Promise<SharkShape | null> {
  try {
    const img = new Image();
    img.src = '/SALVA_AI_GARAIO.webp';
    await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    if (!W || !H) return null;
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const c = off.getContext('2d')!;
    c.drawImage(img, 0, 0);
    const data = c.getImageData(0, 0, W, H).data;

    // A logo tem GLOW embutido (alpha ~128) preenchendo o vão tubarão↔texto —
    // limiar alto (200) + tolerância de 1px/coluna pra achar o vão real.
    const ALPHA = 200;
    const colInk: boolean[] = Array(W).fill(false);
    for (let x = 0; x < W; x++) {
      let n = 0;
      for (let y = 0; y < H; y++) {
        if (data[(y * W + x) * 4 + 3] > ALPHA && ++n > 1) { colInk[x] = true; break; }
      }
    }
    const first = colInk.indexOf(true);
    if (first < 0) return null;
    // fim do tubarão = primeiro vão de colunas vazias depois dele
    const GAP = Math.max(3, Math.round(W * 0.012));
    let x1 = W;
    for (let x = first + 5, blank = 0; x < W; x++) {
      blank = colInk[x] ? 0 : blank + 1;
      if (blank >= GAP) { x1 = x - GAP + 1; break; }
    }
    // bbox vertical dentro do recorte
    let y0 = H, y1 = 0;
    for (let y = 0; y < H; y++) {
      for (let x = first; x < x1; x += 2) {
        if (data[(y * W + x) * 4 + 3] > ALPHA) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); break; }
      }
    }
    if (y1 <= y0) return null;
    const shape = samplePoints(data, W, H, count, first, y0, x1, y1 + 1, ALPHA);
    return shape;
  } catch {
    return null;
  }
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
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);

    let w = 0, h = 0;
    let maxScroll = 1;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ---------- backdrop (escurece com a descida) ---------- */
    const REST_X = 0.72, REST_Y = 0.5;
    const mouse = { x: -9999, y: -9999, nx: 0.5, ny: 0.5 };
    let depth = 0;   // 0 = superfície (hero), 1 = fossa (footer)
    let heroVis = 1; // 1 = hero em vista (cardume vivo), 0 = passou do hero

    const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
    const drawBackdrop = () => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgb(${mix(7, 2, depth)},${mix(7, 3, depth)},${mix(15, 8, depth)})`);
      g.addColorStop(0.6, `rgb(${mix(6, 2, depth)},${mix(8, 3, depth)},${mix(15, 7, depth)})`);
      g.addColorStop(1, `rgb(${mix(5, 1, depth)},${mix(9, 2, depth)},${mix(18, 6, depth)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // luz da superfície morre com a profundidade
      const surface = 1 - depth * 0.75;
      const gx = w * (REST_X + (mouse.nx - 0.5) * 0.1);
      const gy = h * (REST_Y + (mouse.ny - 0.5) * 0.08);
      const bloom = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.62);
      bloom.addColorStop(0, `rgba(26,128,248,${0.24 * surface})`);
      bloom.addColorStop(0.35, `rgba(22,100,220,${0.09 * surface})`);
      bloom.addColorStop(1, 'rgba(26,128,248,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      const counter = ctx.createRadialGradient(w * 0.12, h * 1.05, 0, w * 0.12, h * 1.05, Math.max(w, h) * 0.45);
      counter.addColorStop(0, `rgba(25,199,247,${0.06 * surface})`);
      counter.addColorStop(1, 'rgba(25,199,247,0)');
      ctx.fillStyle = counter;
      ctx.fillRect(0, 0, w, h);
    };

    if (reduce) {
      drawBackdrop();
      return () => window.removeEventListener('resize', resize);
    }

    /* ---------- o cardume ---------- */
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
        tx: 0, ty: 0,
      };
    });

    const PERCEIVE = 52;
    const SEP = 22;
    const FLEE_R = 150;
    const MAX_V = 2.6, MIN_V = 1.1;
    const COLORS = [
      (a: number) => `rgba(150,195,255,${a})`,
      (a: number) => `rgba(25,199,247,${a})`,
      (a: number) => `rgba(26,128,248,${a})`,
    ];

    /* ---------- convergência (cardume → tubarão) ---------- */
    let mode: Mode = 'school';
    let modeMs = 0;         // TEMPO no modo atual (ms) — beats narrativos são
                            // em tempo real, não frames (120Hz ≠ 2× mais rápido)
    let converged = false;  // já rodou nesta visita?
    // A forma-alvo é o TUBARÃO DA LOGO (recortado do wordmark); primitivas
    // ficam como fallback até a imagem decodificar / se ela falhar.
    let shark: SharkShape = sampleShark(COUNT);
    sampleLogoShark(COUNT).then((s) => { if (s && s.pts.length) shark = s; });
    // âncora e escala (atrás/à direita do headline, boca apontando p/ ele)
    const layoutShark = () => {
      const scale = Math.min((coarse ? w * 0.7 : w * 0.29) / shark.bw, (h * 0.42) / shark.bh);
      const ox = coarse ? w * 0.5 - (shark.bw / 2) * scale : w * 0.63;
      const oy = coarse ? h * 0.30 : h * 0.35;
      fish.forEach((f, i) => {
        const p = shark.pts[i % shark.pts.length];
        f.tx = ox + p.x * scale;
        f.ty = oy + p.y * scale;
      });
    };
    const setMode = (m: Mode) => { mode = m; modeMs = 0; };
    let trigs = 0;
    const triggerConverge = () => {
      trigs++;
      if (mode !== 'school' || heroVis < 0.5) return; // momento do hero
      layoutShark();
      setMode('converge');
    };
    // dispara uma vez, ~2.8s depois do site "emergir" (classe dive-ready).
    // Fallback de 9s para páginas sem preloader (404).
    const tryAutoConverge = () => {
      if (converged) return;
      if (document.documentElement.classList.contains('dive-ready')) {
        converged = true;
        window.setTimeout(triggerConverge, 2800);
      }
    };
    const autoTimer = window.setInterval(() => {
      tryAutoConverge();
      if (converged) window.clearInterval(autoTimer);
    }, 300);
    const fallbackTimer = window.setTimeout(() => {
      if (!converged) {
        converged = true;
        triggerConverge();
      }
    }, 9000);
    // easter egg: digitar "shark" reprisa o ataque
    let typed = '';
    const onKey = (e: KeyboardEvent) => {
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === 'shark') triggerConverge();
    };
    window.addEventListener('keydown', onKey);
    // hooks de dev/teste (também usados pela verificação visual automatizada)
    (window as unknown as Record<string, unknown>).__sharkConverge = triggerConverge;
    (window as unknown as Record<string, unknown>).__sharkState = () => ({ mode, modeMs, depth, frame, trigs });
    (window as unknown as Record<string, unknown>).__sharkTargets = () => fish.map((f) => [Math.round(f.tx), Math.round(f.ty)]);

    /* ---------- interação ---------- */
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      mouse.nx = e.clientX / w; mouse.ny = e.clientY / h;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX; mouse.y = t.clientY;
      mouse.nx = t.clientX / w; mouse.ny = t.clientY / h;
    };
    const onTouchEnd = () => { mouse.x = -9999; mouse.y = -9999; };
    const onDown = (e: MouseEvent) => {
      if (mode !== 'school') return; // durante o ataque, nada interrompe
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
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    /* ---------- simulação ---------- */
    let frame = 0;
    let lastNow = 0;
    const step = (now: number) => {
      frame++;
      const dt = lastNow ? Math.min(50, Math.max(8, now - lastNow)) : 16.7;
      lastNow = now;
      const k = dt / 16.7; // fator de compensação p/ 30–120Hz
      modeMs += dt;
      if (frame % 60 === 0) maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
      depth = Math.min(1, window.scrollY / maxScroll);
      // O cardume é assinatura do HERO: some conforme a primeira dobra sai
      // (o fundo de profundidade continua o site inteiro).
      heroVis = Math.max(0, Math.min(1, 1 - window.scrollY / (h * 0.85)));
      // máquina de estados da convergência (beats em TEMPO real)
      if (mode === 'converge' && modeMs > 1800) setMode('hold');
      else if (mode === 'hold' && modeMs > 1250) setMode('strike'); // a marca precisa registrar
      else if (mode === 'strike') {
        // o tubarão inteiro dá o bote: alvos avançam na direção do headline
        for (const f of fish) { f.tx -= 15 * k; f.ty += 3 * k; }
        if (modeMs > 220) {
          setMode('burst');
          // explosão a partir do centroide
          let cx = 0, cy = 0;
          for (const f of fish) { cx += f.x; cy += f.y; }
          cx /= fish.length; cy /= fish.length;
          for (const f of fish) {
            const dx = f.x - cx, dy = f.y - cy;
            const d = Math.hypot(dx, dy) || 1;
            const k = 6 + Math.random() * 5;
            f.vx += (dx / d) * k;
            f.vy += (dy / d) * k;
          }
        }
      } else if (mode === 'burst' && modeMs > 500) setMode('school');

      const inShape = mode === 'converge' || mode === 'hold' || mode === 'strike';
      // na descida o cardume rareia e desacelera (águas profundas = menos vida)
      const active = inShape ? fish.length : Math.round(fish.length * (1 - depth * 0.45));
      const slow = 1 - depth * 0.3;

      // fora do hero, a simulação PAUSA (bateria) — retoma ao voltar
      if (heroVis <= 0.001 && !inShape) return;

      for (let i = 0; i < fish.length; i++) {
        const f = fish[i];

        if (inShape) {
          // seek com chegada + stagger em onda (peixes distantes chegam depois)
          const wave = mode === 'converge' && modeMs < (i % 40) * 25;
          if (!wave) {
            const dx = f.tx - f.x, dy = f.ty - f.y;
            f.vx += dx * 0.014 * k;
            f.vy += dy * 0.014 * k;
            const damp = Math.pow(0.86, k);
            f.vx *= damp;
            f.vy *= damp;
          }
          f.x += f.vx * k;
          f.y += f.vy * k;
          continue;
        }

        if (i >= active) continue; // dormentes na profundidade

        let ax = 0, ay = 0;
        let cx = 0, cy = 0, vxs = 0, vys = 0, n = 0;
        for (let j = 0; j < active; j++) {
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
          ax += ((cx / n) - f.x) * 0.0028;
          ay += ((cy / n) - f.y) * 0.0028;
          ax += ((vxs / n) - f.vx) * 0.055;
          ay += ((vys / n) - f.vy) * 0.055;
        }

        const pdx = f.x - mouse.x, pdy = f.y - mouse.y;
        const pd = Math.hypot(pdx, pdy);
        if (pd < FLEE_R && pd > 0.001) {
          const kf = (1 - pd / FLEE_R) * 1.35;
          ax += (pdx / pd) * kf;
          ay += (pdy / pd) * kf;
        }

        const M = 70, W2 = 0.06;
        if (f.x < M) ax += W2;
        if (f.x > w - M) ax -= W2;
        if (f.y < M) ay += W2;
        if (f.y > h - M) ay -= W2;

        ax += (Math.random() - 0.5) * 0.04;
        ay += (Math.random() - 0.5) * 0.04;

        f.vx += ax; f.vy += ay;
        const sp = Math.hypot(f.vx, f.vy);
        const cap = (MAX_V * f.z + 0.6) * slow;
        if (sp > cap) { f.vx = (f.vx / sp) * cap; f.vy = (f.vy / sp) * cap; }
        else if (sp < MIN_V * slow) { f.vx = (f.vx / sp) * MIN_V * slow; f.vy = (f.vy / sp) * MIN_V * slow; }

        f.x += f.vx * f.z;
        f.y += f.vy * f.z;

        if (f.x < -20) f.x = w + 20; else if (f.x > w + 20) f.x = -20;
        if (f.y < -20) f.y = h + 20; else if (f.y > h + 20) f.y = -20;
      }
    };

    const draw = () => {
      drawBackdrop();

      const inShape = mode === 'converge' || mode === 'hold' || mode === 'strike';
      if (heroVis <= 0.001 && !inShape) return; // só o fundo fora do hero
      ctx.globalCompositeOperation = 'screen';
      ctx.lineCap = 'round';
      // bioluminescência: quanto mais fundo, mais os peixes brilham
      const glow = 1 + depth * 0.5 + (mode === 'hold' || mode === 'strike' ? 0.6 : 0);
      const active = inShape ? fish.length : Math.round(fish.length * (1 - depth * 0.45));
      for (let i = 0; i < active; i++) {
        const f = fish[i];
        const alpha = Math.min(0.9, (0.16 + 0.4 * f.z) * glow) * heroVis;

        if (inShape) {
          // parados na silhueta, o traço-por-velocidade colapsa em nada —
          // cada peixe vira um ponto de plâncton. Tamanho/alpha UNIFORMES:
          // a variância por camada z vira ruído e desfaz a leitura da forma.
          ctx.fillStyle = COLORS[f.hue](0.32 * Math.max(heroVis, 0.15));
          ctx.beginPath();
          ctx.arc(f.x, f.y, 3.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = COLORS[f.hue](0.92 * Math.max(heroVis, 0.15));
          ctx.beginPath();
          ctx.arc(f.x, f.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const sp = Math.hypot(f.vx, f.vy) || 1;
        const len = (5 + 6 * f.z) * Math.min(1.4, sp / 1.8);
        const ux = f.vx / sp, uy = f.vy / sp;
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

    let raf = 0;
    let running = true;
    const loop = (now: number) => {
      if (!running) return;
      step(now);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearInterval(autoTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('visibilitychange', onVis);
      delete (window as unknown as Record<string, unknown>).__sharkConverge;
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none" />;
}
