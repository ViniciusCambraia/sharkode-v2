import { ArrowUpRight, Zap, Shield, Monitor, Database, Workflow, Globe } from 'lucide-react';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';
import { useSpotlight } from '../hooks/useSpotlight';
import { useTilt } from '../hooks/useTilt';

const services = [
  {
    icon: Globe,
    title: 'Sites Institucionais',
    description:
      'Presença digital premium que traduz a autoridade da sua marca em confiança.',
  },
  {
    icon: Monitor,
    title: 'Landing Pages',
    description:
      'Páginas de alta conversão focadas em captura de leads e performance publicitária.',
  },
  {
    icon: Workflow,
    title: 'Sistemas e Portais',
    description:
      'Plataformas web robustas com login, dashboards e integrações sob medida.',
  },
  {
    icon: Zap,
    title: 'Performance & SEO',
    description:
      'Carregamento instantâneo, Core Web Vitals no verde e ranqueamento orgânico.',
  },
  {
    icon: Shield,
    title: 'Design Responsivo',
    description:
      'Experiências pixel-perfect em qualquer dispositivo, do mobile ao ultrawide.',
  },
  {
    icon: Database,
    title: 'Automações com IA',
    description:
      'Agentes inteligentes, fluxos n8n e integrações que reduzem tarefas manuais em 80%.',
  },
];

function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Globe;
  title: string;
  description: string;
}) {
  const ref = useTilt<HTMLDivElement>();
  useSpotlight<HTMLDivElement>(ref);
  return (
    <div
      ref={ref}
      className="tilt-card spotlight-card group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md p-8 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_0_60px_-15px_rgba(26,128,248,0.4)]"
    >
      <div className="relative z-10 flex flex-col h-full gap-5">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="type-h3 text-xl text-white mb-2">{title}</h3>
          <p className="type-body text-sm text-gray-400">{description}</p>
        </div>
        <div className="type-label text-zinc-500 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
          Saiba mais
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const headerRef = useGsapReveal();
  const gridRef = useGsapFadeUp();

  return (
    <section
      id="services"
      className="w-full max-w-[90rem] mx-auto px-6 lg:px-12 py-24 md:py-32"
    >
      <div ref={headerRef} className="max-w-3xl mb-16 md:mb-20">
        {/* Chip — Geist Medium uppercase tracking-widest */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
          <span className="type-eyebrow text-blue-400">Serviços</span>
        </div>
        <h2 className="type-h2 md:text-5xl text-3xl text-white mb-8">
          Soluções que{' '}
          <span className="text-blue-500">transformam</span> a sua presença
          digital
        </h2>
        <p className="type-body text-gray-400 max-w-3xl">
          Da landing page ao sistema corporativo, entregamos produtos digitais
          completos, com performance de mercado e design cinematográfico.
        </p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
}
