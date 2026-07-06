import { useEffect } from 'react';

/**
 * Tap-ping sonar (touch): cada toque emite um anel ciano que expande do ponto
 * exato do dedo — em sincronia com a explosão do cardume (mousedown sintetizado
 * do tap já dispara o burst dos boids). Usa 'click' e não touchstart: tap que
 * virou scroll não pinga. Desktop tem o "bote" do cursor; aqui é o equivalente.
 */
export default function TapPing() {
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!coarse || reduce) return;

    const onClick = (e: MouseEvent) => {
      const ring = document.createElement('div');
      ring.className = 'tap-ping';
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      document.body.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove(), { once: true });
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  return null;
}
