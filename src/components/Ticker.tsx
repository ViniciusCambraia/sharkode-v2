const items = [
  'Design Web', 'Dados', 'Estratégia de Produto', 'Animações',
  'Desenvolvimento', 'Marca', 'Velocidade', 'Automação com IA',
];

function TickerContent() {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-8 font-grotesk text-[13px] font-bold tracking-[.16em] uppercase text-white/35">
            {item}
          </span>
          <span className="text-[var(--blue)] text-sm opacity-55 flex-shrink-0">
            {i % 2 === 0 ? '✦' : '•'}
          </span>
        </span>
      ))}
    </>
  );
}

export default function Ticker() {
  return (
    <div
      className="overflow-hidden border-t border-b"
      style={{
        borderColor: 'var(--bd)',
        background: 'rgba(255,255,255,.015)',
        WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
        maskImage: 'linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)',
      }}
    >
      <div className="h-20 flex overflow-hidden items-center">
        <div
          className="flex items-center w-max whitespace-nowrap"
          style={{ animation: 'tickerLeft 30s linear infinite' }}
        >
          <TickerContent />
          <TickerContent />
        </div>
      </div>
    </div>
  );
}
