import type { SVGProps } from 'react';

/**
 * SHARK ICONS — iconografia proprietária da Sharkode (Fase 3 do plano).
 * Substitui os lucide genéricos por um vocabulário da marca: barbatana,
 * dente, sonar, cardume. Regras do set:
 *  - 24×24, stroke 1.8, cantos vivos em diagonais (a linguagem da logo)
 *  - stroke: currentColor (herda o accent de cada seção)
 *  - micro-animação por ícone via classes .i-* (disparadas pelo .group:hover
 *    do card — CSS em index.css)
 */

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

/** Território — barbatana rompendo a linha d'água sob pings de sonar.
 *  (Sites Institucionais: presença que domina o território) */
export function IconTerritorio(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 16.5h18" />
      <path d="M8.5 16.5C9.5 12.5 11 10 14.5 8.5c-1 2.5-1 5.5-.5 8" />
      <path className="i-ping" d="M8 5.5a7.5 7.5 0 0 1 8 0" opacity=".45" />
      <path className="i-ping2" d="M9.8 3a11 11 0 0 1 4.4 0" opacity=".25" />
    </svg>
  );
}

/** Funil-de-caça — chevrons afunilando até o alvo.
 *  (Landing Pages: visitantes viram um único ponto: a conversão) */
export function IconFunil(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 4.5 12 9l8-4.5" />
      <path d="M6.5 10.5 12 13.5l5.5-3" opacity=".7" />
      <path d="M9 16l3 1.7 3-1.7" opacity=".5" />
      <circle className="i-alvo" cx="12" cy="21" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Cardume-rede — nós em barbatana conectados.
 *  (Sistemas e Portais: peças nadando em formação) */
export function IconCardume(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M8 7.5 12 16m4-8.5L12 16" opacity=".45" />
      <path className="i-peixe" d="M4.5 6 8 7.5 5.5 9.5Z" fill="currentColor" stroke="none" />
      <path className="i-peixe" d="M19.5 6 16 7.5l2.5 2Z" fill="currentColor" stroke="none" />
      <path className="i-peixe" d="M9.5 18.5 12 16l1.5 3.5-2 .5Z" fill="currentColor" stroke="none" />
      <path d="M8 7.5h8" opacity=".45" />
    </svg>
  );
}

/** Dorsal-veloz — a barbatana cortando com linhas de arrasto.
 *  (Rápido e Achado no Google: velocidade é a assinatura) */
export function IconVeloz(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M13.5 18c.2-5 2-9.5 7-12-1.8 3.5-2.5 8-2.2 12Z" />
      <path className="i-rastro" d="M3.5 9.5H10" opacity=".6" />
      <path className="i-rastro" d="M2.5 13.5h6" opacity=".45" />
      <path className="i-rastro" d="M4.5 17.5h6" opacity=".3" />
    </svg>
  );
}

/** Telas-na-corrente — desktop e mobile atravessados pela mesma onda.
 *  (Perfeito em Qualquer Tela) */
export function IconTelas(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4.5" width="13.5" height="9.5" rx="1.5" />
      <rect x="14.5" y="9.5" width="6.5" height="10" rx="1.5" />
      <path className="i-onda" d="M5.5 9.5c1.2-1.4 2.4-1.4 3.6 0s2.4 1.4 3.6 0" opacity=".7" />
      <path d="M7 20h4" opacity=".5" />
    </svg>
  );
}

/** Água-viva — o organismo que trabalha sozinho, tentáculos-conexão.
 *  (Automações com IA) */
export function IconAguaViva(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M5.5 10.5a6.5 5.8 0 0 1 13 0c-2 .9-4.2 1.3-6.5 1.3s-4.5-.4-6.5-1.3Z" />
      <path className="i-tent" d="M8.5 13.5c-.6 2-.3 3.4.3 5" opacity=".6" />
      <path className="i-tent2" d="M12 14.2v5.3" opacity=".7" />
      <path className="i-tent" d="M15.5 13.5c.6 2 .3 3.4-.3 5" opacity=".6" />
      <circle cx="12" cy="21.2" r=".9" fill="currentColor" stroke="none" opacity=".8" />
    </svg>
  );
}

/** Dentículo — a escama de tubarão (dermal denticle), a "pele" da marca.
 *  (Marca & Identidade: a menor unidade que ainda é o todo) */
export function IconDenticulo(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 19 10l-7 7-7-6.5Z" />
      <path className="i-eco" d="M12 8 15.2 10.6 12 13.4 8.8 10.8Z" opacity=".5" />
      <path d="M12 17v3.5" opacity=".4" />
    </svg>
  );
}

/** Correnteza — fluxos que o usuário navega sem esforço.
 *  (Design de Experiência) */
export function IconCorrenteza(props: P) {
  return (
    <svg {...base(props)}>
      <path className="i-flui" d="M3 7.5c3-2.2 6-2.2 9 0s6 2.2 9 0" />
      <path className="i-flui2" d="M3 12.5c3-2.2 6-2.2 9 0s6 2.2 9 0" opacity=".6" />
      <path className="i-flui3" d="M3 17.5c3-2.2 6-2.2 9 0s6 2.2 9 0" opacity=".35" />
      <circle className="i-nada" cx="16.5" cy="11.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Dente-bracket — código com mordida: os brackets são dentes.
 *  (Desenvolvimento) */
export function IconDente(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M8.5 5 4 9.5c2.2.8 3.4 2 4.5 4.5" />
      <path d="M15.5 5 20 9.5c-2.2.8-3.4 2-4.5 4.5" />
      <path className="i-corte" d="M13.6 4.5 10.4 19.5" opacity=".6" />
    </svg>
  );
}

/** Ascensão — o cardume subindo da profundidade, quebrando a superfície.
 *  (Crescimento) */
export function IconAscensao(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 5.5h17" opacity=".4" />
      <path className="i-sobe" d="M5 19.5 8.5 16" opacity=".45" />
      <path className="i-sobe2" d="M9.5 15.5 13 12" opacity=".65" />
      <path className="i-sobe3" d="M14 11.5 17.5 8" />
      <path d="M17.5 8 20 5.5l-3.5.4" fill="none" />
      <path d="M20 5.5l-.4 3.5" />
    </svg>
  );
}
