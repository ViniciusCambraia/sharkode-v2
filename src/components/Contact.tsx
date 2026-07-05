import { useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';
import { useFormValidation } from '../hooks/useFormValidation';
import { useToast } from '../hooks/useToast';
import { wa } from '../lib/contact';

/**
 * Destino real do formulário: webhook de PRODUÇÃO do n8n (nó Webhook, método
 * POST, CORS liberado pro domínio do site). Enquanto estiver vazio — ou se o
 * n8n estiver fora — o formulário abre o WhatsApp com a mensagem preenchida:
 * o lead NUNCA se perde.
 */
const N8N_WEBHOOK_URL = '';

interface ContactValues extends Record<string, string> {
  name: string;
  contact: string;
  message: string;
  website: string; // honeypot
}

const initial: ContactValues = {
  name: '',
  contact: '',
  message: '',
  website: '',
};

export default function Contact() {
  const { toast } = useToast();
  const { values, errors, handleChange, handleSubmit, reset } =
    useFormValidation<ContactValues>(initial);

  const headerRef = useGsapReveal();
  const formRef = useRef<HTMLFormElement | null>(null);
  useGsapFadeUp<HTMLFormElement>(formRef);

  const onSubmit = async (vals: ContactValues) => {
    // Honeypot — silently drop bot submissions
    if (vals.website) return;

    // Fallback à prova de falha: o lead vira mensagem de WhatsApp preenchida
    const waFallback = () => {
      window.open(
        wa(`Olá! Vim pelo site.\nNome: ${vals.name}\nContato: ${vals.contact}\n\n${vals.message}`),
        '_blank',
        'noopener',
      );
      reset();
    };

    if (!N8N_WEBHOOK_URL) {
      waFallback();
      return;
    }

    toast('SYS_SENDING', 'Enviando sua mensagem...', 'info');
    try {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vals.name,
          contact: vals.contact,
          message: vals.message,
          source: 'sharkode.com.br — formulário do site',
          sentAt: new Date().toISOString(),
        }),
        signal: ctrl.signal,
      });
      window.clearTimeout(timer);
      if (!res.ok) throw new Error(String(res.status));
      toast(
        'SUCCESS',
        `Olá ${vals.name}, recebemos seu contato! Responderemos em breve.`,
        'success'
      );
      reset();
    } catch {
      toast('SEM CONEXÃO', 'Não conseguimos enviar agora — te levamos pro WhatsApp.', 'warning');
      waFallback();
    }
  };

  return (
    <section
      id="contact"
      className="w-full max-w-[90rem] mx-auto px-6 lg:px-12 py-24 md:py-32 border-t border-white/5 relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div ref={headerRef} className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
            <span className="type-eyebrow text-blue-400">Contato</span>
          </div>
          <h2 className="type-h2 md:text-5xl text-3xl text-white mb-8">
            Vamos tirar sua ideia{' '}
            <span className="text-blue-500">do papel?</span>
          </h2>
          <p className="type-body text-gray-400 max-w-2xl mb-8">
            Preencha o formulário ao lado ou fale direto pelo WhatsApp.
            Respondemos em até 1 dia útil com um diagnóstico inicial gratuito.
          </p>
          <a
            href={wa('Olá! Vim pelo site da Sharkode e quero um diagnóstico.')}
            target="_blank"
            rel="noreferrer"
            className="type-cta inline-flex items-center gap-2 rounded-full py-3.5 px-6 bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-7 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md p-8 md:p-10 space-y-5"
          noValidate
        >
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website"
            value={values.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <Field
            label="Nome"
            name="name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Como podemos te chamar?"
          />
          <Field
            label="E-mail ou WhatsApp"
            name="contact"
            value={values.contact}
            onChange={handleChange}
            error={errors.contact}
            placeholder="exemplo@email.com ou (11) 99999-9999"
          />
          <Field
            label="Mensagem"
            name="message"
            value={values.message}
            onChange={handleChange}
            error={errors.message}
            placeholder="Conte um pouco sobre o seu projeto..."
            textarea
          />

          <button
            type="submit"
            className="shimmer-button type-cta w-full inline-flex items-center justify-center gap-2 rounded-full py-4 px-6 bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(26,128,248,0.3)]"
          >
            <Send className="w-4 h-4" />
            Enviar Mensagem
          </button>
        </form>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  name: keyof ContactValues;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  textarea?: boolean;
}

function Field({ label, name, value, onChange, error, placeholder, textarea }: FieldProps) {
  const id = `field-${name}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="type-label text-zinc-500 block">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name as string}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="type-body w-full bg-black/40 border border-white/[0.08] focus:border-blue-500/50 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors resize-none"
        />
      ) : (
        <input
          id={id}
          name={name as string}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="type-body w-full bg-black/40 border border-white/[0.08] focus:border-blue-500/50 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors"
        />
      )}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
