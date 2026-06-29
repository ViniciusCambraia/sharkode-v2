import { useToast, type ToastType } from '../hooks/useToast';

const typeStyles: Record<ToastType, string> = {
  info: 'bg-[#0b1221] border-white/10',
  success: 'bg-[#071913] border-emerald-500/30',
  warning: 'bg-[#1c120c] border-amber-500/30',
};

export default function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={`p-4 rounded-xl border ${typeStyles[t.type]} backdrop-blur-md text-white shadow-xl flex flex-col gap-1 text-left transition-all duration-300 pointer-events-auto`}
        >
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            {t.title}
          </span>
          <span className="text-xs font-geist">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
