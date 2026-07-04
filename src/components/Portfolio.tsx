import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ExternalLink } from 'lucide-react';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';
import { useSpotlight } from '../hooks/useSpotlight';
import { useTilt } from '../hooks/useTilt';
import { cn } from '../lib/cn';

type Category = 'all' | 'websites' | 'systems' | 'automation';

const tabs: { id: Category; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'websites', label: 'Sites' },
  { id: 'systems', label: 'Sistemas' },
  { id: 'automation', label: 'Automações' },
];

interface Project {
  title: string;
  client: string;
  category: Category;
  description: string;
  tags: string[];
  accent: string;
  logo: string;
}

const projects: Project[] = [
  {
    title: 'Site Institucional Premium',
    client: 'Cliente 01',
    category: 'websites',
    description:
      'Site institucional com foco em autoridade, que abre num piscar de olhos e já nasce pronto para o Google.',
    tags: ['Next.js', 'GSAP', 'Tailwind'],
    accent: '#1a80f8',
    logo: '/assets/exiG9qhtf9QdtnV7cIbg2ywMUHI.webp',
  },
  {
    title: 'Landing Page de Alta Conversão',
    client: 'Cliente 02',
    category: 'websites',
    description:
      'Landing page otimizada para campanhas pagas, com medição completa dos resultados e textos que convencem.',
    tags: ['React', 'Vite', 'Meta Ads'],
    accent: '#f59e0b',
    logo: '/assets/vC5lp4HvRONXuKBbrvquFHfETvk.webp',
  },
  {
    title: 'Sistema Web sob Medida',
    client: 'Cliente 03',
    category: 'systems',
    description:
      'Sistema de gestão interno com área de login, painéis de controle e integração com outras ferramentas.',
    tags: ['React', 'Node.js', 'Postgres'],
    accent: '#3f19f7',
    logo: '/assets/4ZY54wo5xaWkaEmDlNnnNXGXP8.webp',
  },
  {
    title: 'Portal de Automações com IA',
    client: 'Cliente 04',
    category: 'automation',
    description:
      'IA que automatiza o atendimento, organiza os contatos e integra o WhatsApp ao seu sistema de vendas.',
    tags: ['n8n', 'OpenAI', 'WhatsApp API'],
    accent: '#10b981',
    logo: '/assets/FVUAhuM0WzF5Sj8VhwNxmWk7Gfs.webp',
  },
  {
    title: 'E-commerce de Alta Performance',
    client: 'Cliente 05',
    category: 'websites',
    description:
      'Loja virtual com checkout em 1 clique, integração com gateways e painel administrativo completo.',
    tags: ['Astro', 'Stripe', 'Tailwind'],
    accent: '#ef4444',
    logo: '/assets/PdvyW0K7Oj0IQICE1kJL0oj64.webp',
  },
];

function PortfolioCard({ project }: { project: Project }) {
  const ref = useTilt<HTMLDivElement>();
  useSpotlight<HTMLDivElement>(ref);
  return (
    <div
      ref={ref}
      className="tilt-card spotlight-card group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_0_60px_-15px_rgba(26,128,248,0.4)] flex flex-col"
    >
      {/* Logo header */}
      <div className="relative px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/5">
        <img
          src={project.logo}
          alt={project.client}
          loading="lazy"
          decoding="async"
          className="h-8 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <span className="type-label text-zinc-500">{project.category}</span>
      </div>

      {/* Accent preview area */}
      <div
        className="relative aspect-[16/9] w-full"
        style={{
          background: `linear-gradient(135deg, ${project.accent}20 0%, #0b1221 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="absolute inset-6 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center px-4">
            <div
              className="type-display text-xl md:text-2xl mb-1"
              style={{ color: project.accent }}
            >
              {project.title}
            </div>
            <div className="type-label text-zinc-500">{project.client}</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="type-h3 text-xl text-white">{project.title}</h3>
          <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
        </div>
        <p className="type-body text-sm text-gray-400">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="type-label text-zinc-400 px-2 py-1 rounded-md bg-white/5 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<Category>('all');
  const headerRef = useGsapReveal();
  const tabsRef = useGsapFadeUp();
  const gridRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const indicator = indicatorRef.current;
    const tabsContainer = tabsRef.current;
    if (!indicator || !tabsContainer) return;
    const activeBtn = tabsContainer.querySelector<HTMLButtonElement>(
      `[data-tab="${active}"]`
    );
    if (activeBtn) {
      indicator.style.left = `${activeBtn.offsetLeft}px`;
      indicator.style.width = `${activeBtn.offsetWidth}px`;
    }
  }, [active]);

  const handleFilter = (next: Category) => {
    const grid = gridRef.current;
    if (!grid || next === active) return;

    const oldHeight = grid.offsetHeight;
    grid.style.minHeight = `${oldHeight}px`;

    gsap.to(grid, {
      opacity: 0,
      x: -20,
      duration: 0.15,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        setActive(next);
        grid.style.minHeight = 'none';
        const newHeight = grid.offsetHeight;
        grid.style.minHeight = `${oldHeight}px`;

        gsap.fromTo(
          grid,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            minHeight: newHeight,
            duration: 0.35,
            ease: 'power2.out',
            clearProps: 'transform,minHeight',
            overwrite: 'auto',
          }
        );
      },
    });
  };

  const visible = projects.filter(
    (p) => active === 'all' || p.category === active
  );

  return (
    <section
      id="portfolio"
      className="w-full max-w-[90rem] mx-auto px-6 lg:px-12 py-24 md:py-32 border-t border-white/5 relative"
    >
      <div ref={headerRef} className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
          <span className="type-eyebrow text-blue-400">Portfólio</span>
        </div>
        <h2 className="type-h2 md:text-5xl text-3xl text-white mb-8">
          Cases que <span className="text-blue-500">geraram resultado</span>
        </h2>
        <p className="type-body text-gray-400 max-w-3xl">
          Uma seleção de projetos recentes — sites, sistemas e automações que
          escalaram a operação dos nossos clientes.
        </p>
      </div>

      <div ref={tabsRef} className="relative inline-flex items-center gap-1 mb-10 p-1 rounded-xl bg-white/5 border border-white/5">
        <span
          ref={indicatorRef}
          className="absolute top-1 bottom-1 bg-blue-600 rounded-lg transition-all duration-300 ease-out"
          style={{ left: 0, width: 0 }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-tab={tab.id}
            onClick={() => handleFilter(tab.id)}
            className={cn(
              'relative z-10 px-4 py-2 type-cta text-[12px] transition-colors',
              active === tab.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        className={cn(
          'grid gap-5',
          // Layout: 1 coluna em mobile, mixto no desktop
          visible.length === 1
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {visible.map((project) => (
          <PortfolioCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}