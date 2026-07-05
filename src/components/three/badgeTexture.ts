import * as THREE from 'three';

const SITE = 'SHARKODE.COM.BR';

/* Texture geometry shared by the drawing code and the tap hit-testing.
 * The GLB front face samples U∈[0,FRONT_U] × V∈[0,FRONT_V] of a 1025px
 * square; we paint an undistorted 716×1000 logical card into that region. */
const SIZE = 1025;
const FRONT_U = 0.4989;
const FRONT_V = 0.7548;
const LOGICAL_W = 716;
const LOGICAL_H = 1000;
const SX = (SIZE * FRONT_U) / LOGICAL_W;
const SY = (SIZE * FRONT_V) / LOGICAL_H;

/* Printed buttons (logical card coords) — the card IS the interface */
const BTN_WA = { x: 58, y: 700, w: 600, h: 96 };
const BTN_SAVE = { x: 58, y: 816, w: 600, h: 88 };

/**
 * Maps a tap's mesh UV to a printed button. Slop-expanded for thumbs on a
 * swinging card. Returns null outside the buttons (including the card back).
 */
export function badgeHitZone(u: number, v: number): 'whatsapp' | 'save' | null {
  if (u < 0 || u > FRONT_U || v < 0 || v > FRONT_V) return null;
  const lx = (u * SIZE) / SX;
  const ly = (v * SIZE) / SY;
  const SLOP = 16;
  const hit = (b: { x: number; y: number; w: number; h: number }) =>
    lx >= b.x - SLOP && lx <= b.x + b.w + SLOP && ly >= b.y - SLOP && ly <= b.y + b.h + SLOP;
  if (hit(BTN_WA)) return 'whatsapp';
  if (hit(BTN_SAVE)) return 'save';
  return null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Builds the badge front face on a <canvas> and returns it as a THREE texture.
 * Mirrors the black "ENTRE EM CONTATO" card design. The logo loads async and
 * flips `needsUpdate` when ready, so the card never blocks first paint.
 */
export function createBadgeTexture(): THREE.CanvasTexture {
  // Geometry constants live at module scope (shared with badgeHitZone).
  const sx = SX;
  const sy = SY;

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;

  let logo: HTMLImageElement | null = null;

  const font = (weight: number, px: number) =>
    `${weight} ${px}px "Space Grotesk", system-ui, sans-serif`;

  const draw = () => {
    // Whole texture black (back + unused regions stay dark)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#050506';
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.save();
    ctx.scale(sx, sy); // fit the logical card into the front quadrant

    const W = LOGICAL_W;
    const H = LOGICAL_H;

    // Glossy black base
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#17181c');
    bg.addColorStop(0.5, '#0c0c0f');
    bg.addColorStop(1, '#050506');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Ghosted wordmark pattern
    ctx.save();
    ctx.font = font(700, 168);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.textBaseline = 'middle';
    for (let row = 0; row < 6; row++) {
      const y = 250 + row * 180;
      const offset = (row % 2) * -250;
      ctx.fillText('sharkode', offset - 70, y);
      ctx.fillText('sharkode', offset + 560, y);
    }
    ctx.restore();

    // Soft top sheen
    const sheen = ctx.createRadialGradient(W * 0.5, -100, 40, W * 0.5, 220, W);
    sheen.addColorStop(0, 'rgba(255,255,255,0.07)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, W, 460);

    const pad = 58;
    const avail = W - pad * 2;
    // Largest px at which `text` fits `maxW`
    const fit = (text: string, weight: number, maxPx: number, maxW: number) => {
      ctx.font = font(weight, maxPx);
      const w = ctx.measureText(text).width;
      return w > maxW ? (maxPx * maxW) / w : maxPx;
    };

    // Top row: logo (left) + year (right)
    if (logo) {
      const lh = 48;
      const lw = (logo.width / logo.height) * lh;
      ctx.drawImage(logo, pad, 66, lw, lh);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = font(600, 30);
    ctx.fillText('2025®', W - pad, 104);

    // Headline — both lines share the size that makes the wider one fit.
    // Sits higher than the v1 design to make room for the printed buttons.
    ctx.textAlign = 'left';
    const headPx = Math.min(
      fit('ENTRE EM', 700, 120, avail),
      fit('CONTATO', 700, 120, avail),
    );
    const lineH = headPx * 0.94;
    const contatoY = 620;
    ctx.font = font(700, headPx);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('ENTRE EM', pad - 2, contatoY - lineH);
    ctx.fillText('CONTATO', pad - 2, contatoY);

    // Printed buttons — the card is the interface (tap zones in badgeHitZone)
    const pill = (
      b: { x: number; y: number; w: number; h: number },
      opts: { fill?: CanvasGradient | string; stroke?: string; label: string; px: number; color: string },
    ) => {
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, b.h, b.h / 2);
      if (opts.fill) {
        ctx.fillStyle = opts.fill;
        ctx.fill();
      }
      if (opts.stroke) {
        ctx.strokeStyle = opts.stroke;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.font = font(700, fit(opts.label, 700, opts.px, b.w - 70));
      ctx.fillStyle = opts.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label, b.x + b.w / 2, b.y + b.h / 2 + 2);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    };

    const waGrad = ctx.createLinearGradient(BTN_WA.x, 0, BTN_WA.x + BTN_WA.w, 0);
    waGrad.addColorStop(0, '#1a80f8');
    waGrad.addColorStop(1, '#3f19f7');
    pill(BTN_WA, { fill: waGrad, label: 'FALAR NO WHATSAPP →', px: 34, color: '#ffffff' });
    pill(BTN_SAVE, {
      fill: 'rgba(255,255,255,0.05)',
      stroke: 'rgba(255,255,255,0.3)',
      label: 'SALVAR CONTATO',
      px: 30,
      color: 'rgba(255,255,255,0.92)',
    });

    // Footer domain (letter-spaced), auto-fit including tracking
    const tracking = 4;
    ctx.font = font(600, 26);
    const rawW = [...SITE].reduce((s, ch) => s + ctx.measureText(ch).width + tracking, 0);
    const domPx = rawW > avail ? (26 * avail) / rawW : 26;
    ctx.font = font(600, domPx);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.save();
    ctx.translate(pad, 962);
    let x = 0;
    for (const ch of SITE) {
      ctx.fillText(ch, x, 0);
      x += ctx.measureText(ch).width + tracking * (domPx / 26);
    }
    ctx.restore();

    ctx.restore();
    texture.needsUpdate = true;
  };

  draw();
  // Redraw once fonts are ready so auto-fit measures the real Space Grotesk metrics
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(draw);
  }
  loadImage('/SALVA_AI_GARAIO.webp')
    .then((img) => {
      logo = img;
      draw();
    })
    .catch(() => {});

  return texture;
}

/**
 * The lanyard strap: black webbing with the "sharkode" wordmark repeated along
 * its length. Tiles along the band via RepeatWrapping.
 */
export function createStrapTexture(): THREE.CanvasTexture {
  // One "sharkode" per tile; repetition count is controlled by the material's
  // `repeat` on the band, so the words stay large and legible.
  const W = 460;
  const H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Black webbing with a subtle vertical sheen
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#161618');
  g.addColorStop(0.5, '#090909');
  g.addColorStop(1, '#161618');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Edge stitching (runs along the strap length)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(0, 15);
  ctx.lineTo(W, 15);
  ctx.moveTo(0, H - 15);
  ctx.lineTo(W, H - 15);
  ctx.stroke();
  ctx.setLineDash([]);

  // Single wordmark filling the tile. (No tiny separator glyph: a ~12px
  // bright detail renders at 2-3 screen px on the strap and shimmers/flickers
  // from aliasing whenever the physics micro-moves the band — pure noise.)
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.font = '700 62px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('sharkode', 22, H / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
