import { useRef } from 'react';
import { useBackgroundFade } from '../hooks/useBackgroundFade';

export default function HologramBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useBackgroundFade<HTMLVideoElement>(videoRef);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Poster instantâneo (15KB) — aparece antes do vídeo */}
      <img
        src="/assets/bg-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'blur(30px)',
          transform: 'scale(1.05)',
        }}
      />
      {/* Vídeo otimizado (77KB webm + 176KB mp4 fallback) — só inicia com scroll */}
      <video
        ref={videoRef}
        poster="/assets/bg-poster.jpg"
        preload="none"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          pointerEvents: 'none',
          opacity: 0,
          filter: 'blur(30px)',
          transform: 'scale(1.05)',
        }}
      >
        <source src="/assets/bg-gradient-optimized.webm" type="video/webm" />
        <source src="/assets/bg-gradient-optimized.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
