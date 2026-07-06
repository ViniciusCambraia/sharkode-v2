import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';

/**
 * 404 — "profundidade desconhecida". Usa o Layout completo (oceano + cardume
 * + cursor + grão): até a página de erro mergulha.
 */
export default function NotFound() {
  return (
    <Layout>
      <Helmet>
        <title>404 — Profundidade desconhecida · Sharkode</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p
          className="font-grotesk text-[12px] font-semibold uppercase tracking-[.18em] text-[var(--cyan)]"
          style={{ animation: 'fadeSlideIn .7s cubic-bezier(.16,1,.3,1) .1s both' }}
        >
          -11.034m · Fossa das Marianas
        </p>
        <h1
          className="mt-4 font-syncopate font-bold uppercase text-white"
          style={{
            fontSize: 'clamp(64px,16vw,180px)',
            lineHeight: 1,
            letterSpacing: '-.02em',
            animation: 'fadeSlideIn .9s cubic-bezier(.16,1,.3,1) .25s both',
          }}
        >
          404
        </h1>
        <p
          className="mt-4 max-w-[420px] font-grotesk text-[15px] leading-relaxed text-white/45"
          style={{ animation: 'fadeSlideIn .8s cubic-bezier(.16,1,.3,1) .45s both' }}
        >
          Você mergulhou fundo demais — esta página não existe.
          <br />
          Ou foi devorada. 🦈
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-grotesk text-[14px] font-semibold text-white transition-[box-shadow] duration-300 hover:shadow-[0_0_28px_rgba(26,128,248,.5)]"
          style={{
            background: 'var(--blue)',
            animation: 'fadeSlideIn .8s cubic-bezier(.16,1,.3,1) .6s both',
          }}
        >
          ← Voltar à superfície
        </Link>
      </main>
    </Layout>
  );
}
