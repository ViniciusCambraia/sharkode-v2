import { ChevronRight, Mail, MessageCircle } from 'lucide-react';

const columns = [
  {
    title: 'Soluções',
    links: [
      { label: 'Landing Pages', href: '#services' },
      { label: 'Sites Institucionais', href: '#services' },
      { label: 'Sistemas & Portais', href: '#services' },
      { label: 'Automações com IA', href: '#calculator' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Portfólio', href: '#portfolio' },
      { label: 'Processo', href: '#process' },
      { label: 'Cases', href: '#testimonials' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Calculadora de Retorno', href: '#calculator' },
      { label: 'Diagnóstico', href: '#contact' },
      { label: 'Contato', href: '#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Termos de Uso', href: '#' },
      { label: 'Política de Privacidade', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full relative border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      {/* Giant watermark — like "APEX" in the reference */}
      <div className="w-full flex items-center justify-center pt-10 pb-2 pointer-events-none select-none">
        <span
          className="font-syncopate font-bold uppercase whitespace-nowrap"
          style={{
            fontSize: 'clamp(72px, 14vw, 220px)',
            letterSpacing: '-0.025em',
            color: 'rgba(255,255,255,.04)',
            lineHeight: 1,
          }}
        >
          SHARKODE
        </span>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 pb-16 pt-6">

      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
        <div className="col-span-2 md:col-span-1">
          <a href="#hero" className="flex items-center gap-2.5 mb-4">
            <img
              src="/SALVA_AI_GARAIO.webp"
              alt="Sharkode"
              className="h-7 w-auto shark-glow-nav"
            />
          </a>
          <p className="type-body text-xs text-zinc-500">
            Websites premium, automações com IA e produtos digitais de alta
            performance.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="type-label text-zinc-400 mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="type-body text-xs text-zinc-500 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter (visual only) */}
      <div className="border-t border-white/5 pt-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="type-h3 text-lg text-white mb-1">
              Receba insights sobre web, IA e automação
            </h4>
            <p className="type-body text-xs text-zinc-500">
              Conteúdo quinzenal, sem spam.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-72">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full bg-black/40 border border-white/[0.08] focus:border-blue-500/50 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-sans placeholder-zinc-600 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="type-cta text-[11px] rounded-xl py-2.5 px-4 bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Assinar
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
        <p className="type-body">© 2026 SHARKODE. Todos os direitos reservados.</p>
        <div className="flex items-center gap-2.5">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm animate-pulse" />
            <span className="type-body">Online — respondemos rápido</span>
          </div>
        </div>
      </div>

      </div>
    </footer>
  );
}