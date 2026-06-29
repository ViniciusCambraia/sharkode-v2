import { useState } from 'react';
import { Calculator as CalcIcon, ArrowRight } from 'lucide-react';
import { useGsapFadeUp } from '../hooks/useGsapFadeUp';

export default function Calculator() {
  const [hours, setHours] = useState(15);
  const [team, setTeam] = useState(5);
  const [cost, setCost] = useState(30);

  const currentMonthlyCost = hours * team * cost * 4.33;
  const monthlySavings = currentMonthlyCost * 0.8;
  const annualSavings = monthlySavings * 12;
  const hoursSaved = hours * team * 4.33 * 0.8;

  const fmtBRL = (n: number) =>
    'R$ ' + Math.round(n).toLocaleString('pt-BR');

  const headerRef = useGsapFadeUp();
  const gridRef = useGsapFadeUp();

  return (
    <section
      id="calculator"
      className="w-full max-w-[90rem] mx-auto px-6 lg:px-12 py-24 md:py-32 relative"
    >
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div
        ref={headerRef}
        className="relative z-10 max-w-5xl mx-auto text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-6">
          <CalcIcon className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[9px] font-geist font-medium tracking-widest text-blue-400 uppercase">
            Simulador de Economia
          </span>
        </div>
        <h2 className="leading-[1.1] uppercase md:text-5xl text-3xl font-normal text-white tracking-tight font-manrope mb-8">
          Calcule quanto você economiza com{' '}
          <span className="text-blue-500">IA & Automações</span>
        </h2>
        <p className="text-gray-400 text-base leading-relaxed max-w-2xl mx-auto">
          Descubra o potencial de otimização financeira e de tempo que nossos
          agentes inteligentes trazem para a sua equipe.
        </p>
      </div>

      <div
        ref={gridRef}
        className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* Sliders */}
        <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md p-8 md:p-10 flex flex-col gap-8 shadow-[0_0_50px_rgba(26,128,248,0.05)] relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/[0.02] blur-2xl rounded-full scale-150 transform pointer-events-none" />

          <Slider
            label="Horas perdidas em tarefas manuais/semana"
            helper="Por funcionário (ex: suporte, CRM, digitação, relatórios)"
            value={hours}
            display={`${hours}h`}
            min={2}
            max={40}
            onChange={setHours}
          />
          <Slider
            label="Número de funcionários na equipe"
            helper="Tamanho do time executando processos repetitivos"
            value={team}
            display={`${team}`}
            min={1}
            max={50}
            onChange={setTeam}
          />
          <Slider
            label="Custo médio por hora de trabalho"
            helper="Valor médio da hora trabalhada (considerando encargos)"
            value={cost}
            display={`R$ ${cost},00`}
            min={10}
            max={150}
            step={5}
            onChange={setCost}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.05] to-zinc-950/40 backdrop-blur-md p-8 md:p-10 flex flex-col justify-between shadow-[0_0_80px_rgba(26,128,248,0.08)] relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-120 transform pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <span className="type-eyebrow text-blue-400">
              Retorno com Sharkode
            </span>
            <div>
              <div className="type-label text-zinc-400 mb-1">
                Economia Mensal Gerada
              </div>
              <div className="type-display text-4xl md:text-5xl text-white">
                {fmtBRL(monthlySavings)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="type-label text-zinc-500 mb-1">Economia Anual</div>
                <div className="type-h3 text-lg text-emerald-400">
                  {fmtBRL(annualSavings)}
                </div>
              </div>
              <div>
                <div className="type-label text-zinc-500 mb-1">Horas Poupadas/mês</div>
                <div className="type-h3 text-lg text-blue-400">
                  {Math.round(hoursSaved)} hrs
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
            <p className="type-body text-zinc-500 text-xs">
              *Estimativa baseada na redução média de 80% do tempo gasto em
              tarefas operacionais após a implantação de IA.
            </p>
            <a
              href="#contact"
              className="shimmer-button group type-cta flex overflow-hidden uppercase focus:outline-none rounded-xl py-3.5 px-6 relative items-center justify-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(26,128,248,0.3)] bg-blue-600 text-white hover:bg-blue-500 text-center"
            >
              Implementar IA na Minha Empresa
              <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SliderProps {
  label: string;
  helper: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

function Slider({ label, helper, value, display, min, max, step = 1, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-3 relative z-10">
      <div className="flex justify-between items-center text-sm">
        <span className="type-body text-gray-300 font-medium">{label}</span>
        <span className="type-body text-white font-semibold">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
      />
      <span className="type-body text-[10px] text-zinc-500">{helper}</span>
    </div>
  );
}
