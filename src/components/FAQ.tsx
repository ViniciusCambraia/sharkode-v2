import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';
import { cn } from '../lib/cn';

const faqs = [
  {
    q: 'Quanto custa um projeto?',
    a: 'Cada projeto tem orçamento sob medida. Landing pages a partir de R$ 4.900, sites institucionais a partir de R$ 9.900, sistemas e automações a partir de R$ 19.900. Entramos em detalhe depois da reunião de diagnóstico.',
  },
  {
    q: 'Quanto tempo leva para ficar pronto?',
    a: 'Landing pages em 7-14 dias úteis, sites institucionais em 21-35 dias, sistemas e automações variam conforme escopo. Cronograma detalhado é aprovado antes do início.',
  },
  {
    q: 'Vocês também produzem conteúdo e textos?',
    a: 'Sim. Contamos com redatores e designers parceiros e cuidamos de ponta a ponta — pesquisa, textos, identidade visual. Ou trabalhamos com material que você já tem.',
  },
  {
    q: 'O site já vem pronto para aparecer no Google?',
    a: 'Sim. Todo projeto já sai preparado para o Google encontrar e exibir seu site corretamente — inclusive com uma prévia bonita quando alguém compartilha o link, e carregando rápido de verdade. Trabalho de conteúdo (blog e palavras-chave) pode ser contratado à parte.',
  },
  {
    q: 'De quem fica o código depois da entrega?',
    a: 'Seu. 100% do código, do domínio e dos acessos é transferido para você na entrega. Sem amarras, sem mensalidade obrigatória. Oferecemos manutenção opcional depois, se quiser.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headerRef = useGsapReveal();
  const listRef = useGsapFadeUp();

  return (
    <section
      id="faq"
      className="w-full max-w-[90rem] mx-auto px-6 lg:px-12 py-24 md:py-32"
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <span className="type-eyebrow text-blue-400">Perguntas Frequentes</span>
        <h2 className="type-h2 md:text-5xl text-3xl text-white mt-4">
          Dúvidas? <span className="text-blue-500">A gente responde.</span>
        </h2>
      </div>

      <div ref={listRef} className="max-w-2xl mx-auto space-y-3">
        {faqs.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <div
              key={item.q}
              className={cn(
                'faq-item rounded-2xl border overflow-hidden backdrop-blur-md transition-colors',
                open
                  ? 'border-blue-500/30 active bg-zinc-950/40'
                  : 'border-white/5 bg-zinc-950/40'
              )}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : idx)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left group"
                aria-expanded={open}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="type-h3 text-lg md:text-xl text-white">
                  {item.q}
                </span>
                <span
                  className={cn(
                    'shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300',
                    open
                      ? 'bg-blue-500/20 border-blue-500/40 rotate-45'
                      : 'border-white/10 group-hover:border-white/20'
                  )}
                >
                  <Plus className="w-4 h-4 text-blue-400" />
                </span>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className="faq-content"
                role="region"
              >
                <p className="type-body px-5 md:px-6 pb-5 md:pb-6 text-sm text-gray-400">
                  {item.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}