import { BenchmarkMetric } from '@/entities/lesson';

interface BenchmarkSectionProps {
  metrics: BenchmarkMetric[];
}

export const BenchmarkSection = ({ metrics }: BenchmarkSectionProps): React.JSX.Element | null => {
  if (metrics.length === 0) return null;

  return (
    <section className="pt-10 border-t border-zinc-800/70 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Бенчмарки и метрики
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-1">
          Ориентиры для оценки результатов и защиты модели перед руководством.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {metrics.map((bm, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-base font-semibold text-white">{bm.metric}</span>
                <span className="text-sm text-zinc-500">{bm.industry}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-mono tabular-nums">
                <span className="text-emerald-400">Цель: {bm.targetBenchmark}</span>
                <span className="text-zinc-600">·</span>
                <span className="text-rose-400">Риск: {bm.dangerZone}</span>
              </div>

              <p className="text-sm font-mono text-zinc-300 leading-relaxed break-words">
                {bm.calculation}
              </p>
            </div>

            <p className="pt-3 border-t border-zinc-800/60 text-[15px] text-zinc-300 leading-relaxed">
              {bm.seniorContext}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

