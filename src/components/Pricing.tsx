import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

const partners = [
  { src: '/assets/exiG9qhtf9QdtnV7cIbg2ywMUHI.webp', alt: 'Cliente 01' },
  { src: '/assets/vC5lp4HvRONXuKBbrvquFHfETvk.webp', alt: 'Cliente 02' },
  { src: '/assets/4ZY54wo5xaWkaEmDlNnnNXGXP8.webp', alt: 'Cliente 03' },
  { src: '/assets/FVUAhuM0WzF5Sj8VhwNxmWk7Gfs.webp', alt: 'Cliente 04' },
  { src: '/assets/PdvyW0K7Oj0IQICE1kJL0oj64.webp', alt: 'Cliente 05' },
];

export default function Pricing() {
  const ref = useGsapFadeUp();

  return (
    <section
      id="pricing"
      className="w-full max-w-[90rem] mx-auto px-6 lg:px-12 py-24 md:py-32 border-t border-white/5 relative"
    >
      <div ref={ref} className="text-center max-w-2xl mx-auto mb-14">
        <span className="type-eyebrow text-blue-400">Parceiros de Confiança</span>
        <h2 className="type-h3 md:text-4xl text-3xl text-white mt-4">
          Empresas que confiam na <span className="text-blue-500">Sharkode</span>
        </h2>
        <p className="type-body text-gray-400 mt-4 max-w-xl mx-auto">
          Marcas que escolheram a Sharkode para construir produtos digitais
          premium, performáticos e prontos para escalar.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center max-w-5xl mx-auto">
        {partners.map((p) => (
          <div
            key={p.alt}
            className="group flex items-center justify-center p-6 rounded-2xl border border-white/5 bg-zinc-950/30 backdrop-blur-sm hover:border-white/15 transition-all duration-300 aspect-[2/1]"
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              className="max-h-10 w-auto opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}