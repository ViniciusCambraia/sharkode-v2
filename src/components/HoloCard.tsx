import { useEffect, useRef } from 'react';

/**
 * Holographic badge — the digital twin of the physical lanyard card, built
 * for the phone in the visitor's hand. Tilts with the device gyroscope
 * (DeviceOrientation; iOS asks permission on first touch) and the holo foil +
 * glare sweep across the card as it moves. Pointer-drag fallback everywhere.
 *
 * Pure CSS 3D — renders instantly on event-venue 4G, unlike the three.js
 * lanyard (which stays desktop-only).
 */
export default function HoloCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const target = { rx: 0, ry: 0 };
    const cur = { rx: -2, ry: 0 };
    let baseBeta: number | null = null; // calibrate to how the phone is held
    let raf = 0;

    const apply = () => {
      cur.rx += (target.rx - cur.rx) * 0.1;
      cur.ry += (target.ry - cur.ry) * 0.1;
      card.style.transform = `rotateX(${cur.rx}deg) rotateY(${cur.ry}deg)`;
      card.style.setProperty('--hx', `${50 + cur.ry * 3.2}%`);
      card.style.setProperty('--hy', `${50 - cur.rx * 3.2}%`);
      raf = requestAnimationFrame(apply);
    };
    raf = requestAnimationFrame(apply);

    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (baseBeta == null) baseBeta = e.beta; // first reading = neutral grip
      target.rx = clamp((baseBeta - e.beta) * 0.6, 14);
      target.ry = clamp(e.gamma * 0.7, 14);
    };

    // iOS 13+ needs an explicit permission request from a user gesture;
    // everywhere else the listener just works.
    const DOE = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    let gyroWired = false;
    const wireGyro = () => {
      if (gyroWired) return;
      gyroWired = true;
      window.addEventListener('deviceorientation', onOrient);
    };
    const askPermission = () => {
      DOE?.requestPermission?.()
        .then((s) => { if (s === 'granted') wireGyro(); })
        .catch(() => {});
      card.removeEventListener('pointerdown', askPermission);
    };
    if (DOE && typeof DOE.requestPermission === 'function') {
      card.addEventListener('pointerdown', askPermission);
    } else if (DOE) {
      wireGyro();
    }

    // Pointer/touch drag fallback (also the desktop preview behavior)
    const onPointer = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      target.ry = clamp(((e.clientX - r.left) / r.width - 0.5) * 26, 14);
      target.rx = clamp(-((e.clientY - r.top) / r.height - 0.5) * 26, 14);
    };
    const onEnd = () => { target.rx = 0; target.ry = 0; };
    card.addEventListener('pointermove', onPointer);
    card.addEventListener('pointerleave', onEnd);
    card.addEventListener('pointerup', onEnd);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('deviceorientation', onOrient);
      card.removeEventListener('pointerdown', askPermission);
      card.removeEventListener('pointermove', onPointer);
      card.removeEventListener('pointerleave', onEnd);
      card.removeEventListener('pointerup', onEnd);
    };
  }, []);

  return (
    <div style={{ perspective: '1100px' }}>
      <div ref={cardRef} className="holo-card" style={{ animation: 'fadeSlideIn .9s cubic-bezier(.16,1,.3,1) .15s both' }}>
        {/* lanyard slot — the physical mirror detail */}
        <div className="holo-slot" />

        <div className="flex flex-col items-center gap-3 mt-2">
          <img src="/SALVA_AI_GARAIO.webp" alt="Sharkode" className="h-9 w-auto shark-glow-nav" />
          <p className="font-syncopate font-bold uppercase text-white text-[11px] tracking-[.18em]">
            Websites que mordem
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="font-grotesk text-[13px] text-white/85">sharkode.com.br</p>
          <p className="font-grotesk text-[11px] text-white/40">+55 (19) 98911-5066</p>
        </div>

        {/* holo foil + glare, driven by --hx/--hy from the tilt loop */}
        <div className="holo-foil" aria-hidden="true" />
        <div className="holo-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
