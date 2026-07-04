import * as THREE from 'three';

const SITE = 'SHARKODE.COM.BR';

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
  // The GLB card samples a SQUARE 1025px texture. The FRONT face only uses the
  // top-left quadrant — U∈[0, 0.5] × V∈[0, 0.755] (the right half is the card
  // back). We draw an undistorted portrait card (aspect 0.716) in logical space
  // and scale it into that quadrant so the art lands on the front, undistorted.
  const SIZE = 1025;
  const FRONT_U = 0.4989;
  const FRONT_V = 0.7548;
  const regionW = SIZE * FRONT_U; // ~511
  const regionH = SIZE * FRONT_V; // ~774
  const logicalH = 1000;
  const logicalW = Math.round(logicalH * 0.716); // 716 (card aspect)
  const sx = regionW / logicalW; // ~0.714
  const sy = regionH / logicalH; // ~0.774

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

    const W = logicalW;
    const H = logicalH;

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

    // Headline — both lines share the size that makes the wider one fit
    ctx.textAlign = 'left';
    const headPx = Math.min(
      fit('ENTRE EM', 700, 120, avail),
      fit('CONTATO', 700, 120, avail),
    );
    const lineH = headPx * 0.94;
    const contatoY = 855;
    ctx.font = font(700, headPx);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('ENTRE EM', pad - 2, contatoY - lineH);
    ctx.fillText('CONTATO', pad - 2, contatoY);

    // Blue subtitle
    const subPx = fit('Conheça o nosso trabalho', 600, 33, avail);
    ctx.font = font(600, subPx);
    ctx.fillStyle = '#1a80f8';
    ctx.fillText('Conheça o nosso trabalho', pad, contatoY + 56);

    // Footer domain (letter-spaced), auto-fit including tracking
    const tracking = 4;
    ctx.font = font(600, 28);
    const rawW = [...SITE].reduce((s, ch) => s + ctx.measureText(ch).width + tracking, 0);
    const domPx = rawW > avail ? (28 * avail) / rawW : 28;
    ctx.font = font(600, domPx);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.save();
    ctx.translate(pad, contatoY + 122);
    let x = 0;
    for (const ch of SITE) {
      ctx.fillText(ch, x, 0);
      x += ctx.measureText(ch).width + tracking * (domPx / 28);
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

  // Single wordmark + separator, filling the tile
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.font = '700 62px "Space Grotesk", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('sharkode', 22, H / 2 + 2);

  ctx.save();
  ctx.translate(W - 40, H / 2);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = 'rgba(26,128,248,0.95)';
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
