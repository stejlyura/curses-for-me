import { CompanyCaseStudy } from '@/entities/lesson';

interface CaseStudySectionProps {
  caseStudies: CompanyCaseStudy[];
}

export const CaseStudySection = ({ caseStudies }: CaseStudySectionProps): React.JSX.Element | null => {
  if (caseStudies.length === 0) return null;

  return (
    <section className="pt-10 border-t border-zinc-800/70 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Реальные кейсы компаний
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-1">
          Как решения отражаются на P&amp;L и операционных метриках бизнеса.
        </p>
      </div>

      <div className="space-y-5">
        {caseStudies.map((cs, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 sm:p-6 space-y-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-zinc-800/60">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-lg font-semibold text-white">{cs.companyName}</h3>
                <span className="text-sm text-zinc-500">· {cs.industry}</span>
              </div>
              <span className="text-sm font-mono text-zinc-400 tabular-nums">
                {cs.scale}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[15px] sm:text-base">
              <div className="space-y-1.5">
                <div className="text-sm font-medium text-rose-400">Вызов и проблема</div>
                <p className="text-zinc-300 leading-relaxed">{cs.problem}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm font-medium text-emerald-400">Решение</div>
                <p className="text-zinc-300 leading-relaxed">{cs.strategicMove}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 space-y-2.5 text-[15px] sm:text-base">
              <p className="text-zinc-200 leading-relaxed">
                <span className="font-medium text-emerald-400">Результат в P&amp;L: </span>
                {cs.quantitativeResult}
              </p>
              <p className="text-zinc-300 leading-relaxed">
                <span className="font-medium text-zinc-200">Вывод: </span>
                {cs.keyLesson}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
