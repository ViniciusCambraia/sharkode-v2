import { useEffect, useRef, type RefObject } from 'react';

/**
 * Drives a video element's opacity based on its currentTime:
 * fades in over the first 0.6s, holds at 0.8, fades out over the last 0.6s.
 * Pauses playback when the element scrolls out of view.
 */
export function useBackgroundFade<T extends HTMLVideoElement = HTMLVideoElement>(
  externalRef?: RefObject<T | null>
) {
  const internalRef = useRef<T | null>(null);
  const ref = (externalRef ?? internalRef) as RefObject<T | null>;

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let rafId = 0;
    const updateOpacity = () => {
      if (video.duration && !video.paused) {
        const duration = video.duration;
        const currentTime = video.currentTime;
        const fadeTime = 0.6;
        if (currentTime < fadeTime) {
          const progress = currentTime / fadeTime;
          video.style.opacity = (progress * 0.8).toString();
        } else if (currentTime > duration - fadeTime) {
          const progress = (duration - currentTime) / fadeTime;
          video.style.opacity = (Math.max(0, progress) * 0.8).toString();
        } else {
          video.style.opacity = '0.8';
        }
      }
      rafId = requestAnimationFrame(updateOpacity);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              /* autoplay can be blocked until user interaction */
            });
            if (!rafId) rafId = requestAnimationFrame(updateOpacity);
          } else {
            video.pause();
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = 0;
            }
          }
        }
      },
      { threshold: 0 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
