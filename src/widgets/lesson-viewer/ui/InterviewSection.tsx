'use client';

import { useState } from 'react';
import { InterviewCase } from '@/entities/lesson';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InterviewSectionProps {
  cases: InterviewCase[];
}

export const InterviewSection = ({ cases }: InterviewSectionProps): React.JSX.Element | null => {
  const [openCases, setOpenCases] = useState<Record<number, boolean>>({ 0: true });

  const toggleCase = (idx: number) => {
    setOpenCases((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (cases.length === 0) return null;

  return (
    <section className="pt-10 border-t border-zinc-800/70 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Вопросы на собеседовании
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-1">
          Разбор реальных вопросов, слабых ответов и сильной аргументации.
        </p>
      </div>

      <div className="space-y-3">
        {cases.map((c, idx) => {
          const isOpen = !!openCases[idx];

          return (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleCase(idx)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-900/50 transition-colors gap-4"
              >
                <span className="space-y-1 block">
                  <span className="text-sm font-mono text-zinc-500 block">
                    Уровень: {c.difficulty}
                  </span>
                  <span className="text-base font-semibold text-white leading-snug block">
                    {c.question}
                  </span>
                </span>
                <span className="shrink-0 text-zinc-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-4 border-t border-zinc-800/60 space-y-5 text-[15px] sm:text-base">
                  <div className="space-y-1.5">
                    <div className="text-sm font-medium text-zinc-400">
                      Что проверяет интервьюер
                    </div>
                    <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
                      {c.whatInterviewerLooksFor}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <div className="text-sm font-medium text-rose-400">
                        Слабый ответ (Red Flag)
                      </div>
                      <p className="text-[15px] sm:text-base text-zinc-400 leading-relaxed">
                        {c.antiPatternAnswer}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-sm font-medium text-emerald-400">
                        Эталонный ответ (Senior)
                      </div>
                      <p className="text-[15px] sm:text-base text-zinc-200 leading-relaxed">
                        {c.seniorBattleTestedAnswer}
                      </p>
                    </div>
                  </div>

                  {c.probingQuestions.length > 0 && (
                    <div className="pt-3 border-t border-zinc-800/60 space-y-2">
                      <div className="text-sm font-medium text-zinc-400">
                        Дополнительные вопросы
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 text-[15px] text-zinc-300 leading-relaxed">
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

