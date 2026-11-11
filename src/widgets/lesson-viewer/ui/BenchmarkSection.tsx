import { BenchmarkMetric } from '@/entities/lesson';
import { Target, AlertTriangle, Calculator, Sparkles } from 'lucide-react';

interface BenchmarkSectionProps {
  metrics: BenchmarkMetric[];
}

export const BenchmarkSection = ({ metrics }: BenchmarkSectionProps): React.JSX.Element => {
  if (metrics.length === 0) return <></>;

  return (
    <section className="my-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Индустриальные бенчмарки и критические метрики
          </h3>
          <p className="text-xs text-zinc-400">
            Нормативные ориентиры для интервью и защиты финмодели перед фаундерами.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((bm, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-white">{bm.metric}</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {bm.industry}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Цель: {bm.targetBenchmark}
                </span>
                <span className="text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Опасно: {bm.dangerZone}
                </span>
              </div>

              <div className="mt-3 p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-start gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>{bm.calculation}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{bm.seniorContext}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

