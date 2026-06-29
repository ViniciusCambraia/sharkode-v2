import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';


const navLinks = [
  { href: '#services', label: 'Serviços' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#process', label: 'Processo' },
  { href: '#testimonials', label: 'Depoimentos' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contato' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-6"
      style={{ animation: 'fadeSlideDown 1s ease-out 0.2s both' }}
    >
      <div
        className={`mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-full border transition-all duration-500 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-black/40 backdrop-blur-md border-white/10'
        } px-4 md:px-6 h-14 md:h-16`}
      >
        {/* Logo (já contém "sharkode" na imagem) */}
        <a href="#hero" className="flex items-center group shrink-0" aria-label="Sharkode - Início">
          <img
            src="/SALVA_AI_GARAIO.webp"
            alt="Sharkode"
            className="h-7 md:h-8 w-auto shark-glow-nav transition-transform duration-500 group-hover:rotate-[-6deg]"
          />
        </a>

        {/* Center nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.slice(0, 4).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="type-cta text-[11px] text-zinc-400 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="#contact"
            className="hidden md:inline-flex shimmer-button items-center gap-1.5 type-cta text-[11px] text-white px-5 py-2.5 rounded-full border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(26,128,248,0.5)] relative group"
          >
            Falar com Especialista
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-px bg-blue-500 transition-all duration-300 group-hover:w-12" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden mx-auto max-w-6xl mt-2 rounded-3xl border border-white/10 bg-black/85 backdrop-blur-xl overflow-hidden"
          style={{ animation: 'fadeSlideDown 0.3s ease-out both' }}
        >
          <div className="px-6 py-5 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="type-cta text-sm text-zinc-300 hover:text-white py-2.5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-3 text-center shimmer-button type-cta text-sm rounded-full py-3 px-5 bg-blue-600 text-white"
            >
              Falar com Especialista
            </a>
          </div>
        </div>
      )}
    </header>
  );
}