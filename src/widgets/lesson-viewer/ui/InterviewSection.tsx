'use client';

import { useState } from 'react';
import { InterviewCase } from '@/entities/lesson';
import { HelpCircle, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle as QuestionIcon } from 'lucide-react';

interface InterviewSectionProps {
  cases: InterviewCase[];
}

export const InterviewSection = ({ cases }: InterviewSectionProps): React.JSX.Element => {
  const [openCases, setOpenCases] = useState<Record<number, boolean>>({ 0: true });

  const toggleCase = (idx: number) => {
    setOpenCases((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (cases.length === 0) return <></>;

  return (
    <section className="my-10 rounded-2xl border border-brand-900/40 bg-brand-950/20 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Тренажер собеседования (Senior Defense)
          </h3>
          <p className="text-xs text-zinc-400">
            Вопросы с подвохом, антипаттерны ответов и высокоранговые ответы с точки зрения бизнеса.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {cases.map((c, idx) => {
          const isOpen = !!openCases[idx];

          return (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleCase(idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 pr-4">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                      c.difficulty === 'Director'
                        ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                        : c.difficulty === 'Senior'
                        ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                        : 'bg-blue-950/60 border-blue-800 text-blue-300'
                    }`}
                  >
                    {c.difficulty}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {c.question}
                  </span>
                </div>
                <div className="shrink-0 text-zinc-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 pt-0 border-t border-zinc-800/60 space-y-4 text-xs mt-3">
                  <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/40 text-zinc-300">
                    <span className="font-semibold text-zinc-100 block mb-1">
                      🎯 Что на самом деле проверяет нанимающий менеджер:
                    </span>
                    {c.whatInterviewerLooksFor}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400 mb-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Антипаттерн (Red Flag / Слабый ответ)
                      </div>
                      <p className="text-zinc-300 leading-relaxed">
                        {c.antiPatternAnswer}
                      </p>
                    </div>

                    <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        Senior Battle-Tested Answer (High Signal)
                      </div>
                      <p className="text-zinc-200 leading-relaxed font-medium">
                        {c.seniorBattleTestedAnswer}
                      </p>
                    </div>
                  </div>

                  {c.probingQuestions.length > 0 && (
                    <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800">
                      <span className="font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
                        <QuestionIcon className="w-3.5 h-3.5 text-brand-400" />
                        Как интервьюер будет копать вглубь:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-zinc-400">
                        {c.probingQuestions.map((q, qIdx) => (
                          <li key={qIdx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

