import { motion, useScroll, useSpring } from 'framer-motion';

/** Barra de progresso de scroll fixa no topo — gradiente azul→roxo. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[999] origin-left pointer-events-none"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--blue), var(--purple))',
      }}
    />
  );
}
