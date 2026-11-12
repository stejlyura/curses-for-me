import { CompanyCaseStudy } from '@/entities/lesson';
import { Building2, ArrowUpRight, CheckCircle } from 'lucide-react';

interface CaseStudySectionProps {
  caseStudies: CompanyCaseStudy[];
}

export const CaseStudySection = ({ caseStudies }: CaseStudySectionProps): React.JSX.Element | null => {
  if (caseStudies.length === 0) return null;

  return (
    <section className="my-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Реальные кейсы компаний (Production Case Studies)</h3>
          <p className="text-xs text-zinc-400">
            Как теория разворачивается в реальных P&L отчетах бизнеса.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {caseStudies.map((cs, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{cs.companyName}</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {cs.industry}
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-0.5 rounded">
                Масштаб: {cs.scale}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 space-y-1">
                <span className="font-semibold text-rose-300 block">Критический вызов / Проблема:</span>
                <p className="text-zinc-300 leading-relaxed">{cs.problem}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 space-y-1">
                <span className="font-semibold text-emerald-300 block">Стратегическое решение:</span>
                <p className="text-zinc-300 leading-relaxed">{cs.strategicMove}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs flex items-start gap-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300">Результат в P&L: </span>
                <span className="text-emerald-100">{cs.quantitativeResult}</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 flex items-start gap-1.5 pt-1">
              <CheckCircle className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-300">Главный вывод для сеньора: </strong>
                {cs.keyLesson}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

