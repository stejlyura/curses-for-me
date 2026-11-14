'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/entities/lesson';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
}

export const QuizSection = ({ questions }: QuizSectionProps): React.JSX.Element | null => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  if (questions.length === 0) return null;

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted[questionId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCheck = (questionId: string) => {
    if (selectedAnswers[questionId] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleReset = (questionId: string) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
    setSubmitted((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  return (
    <section className="pt-10 border-t border-zinc-800/70 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Проверка знаний
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-1">
          Короткий тест на понимание ловушек и типичных ошибок.
        </p>
      </div>

      <div className="space-y-5">
        {questions.map((q, idx) => {
          const selectedOption = selectedAnswers[q.id];
          const isSubmitted = submitted[q.id];
          const isCorrect = selectedOption === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 sm:p-6 space-y-4"
            >
              <div className="space-y-1.5">
                <div className="text-sm font-mono text-zinc-500 tabular-nums">
                  Вопрос {idx + 1} из {questions.length}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                  {q.question}
                </h3>
              </div>

              <div className="space-y-2.5">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  let optionStyle =
                    'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-300';

                  if (isSubmitted) {
                    if (optIdx === q.correctOptionIndex) {
                      optionStyle =
                        'border-emerald-500/60 bg-emerald-950/30 text-emerald-200 font-medium';
                    } else if (isThisSelected && !isCorrect) {
                      optionStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-200';
                    } else {
                      optionStyle = 'border-zinc-800/40 bg-zinc-950/40 text-zinc-500';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'border-zinc-400 bg-zinc-800/70 text-white font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left px-4 py-3.5 rounded-lg border text-[15px] sm:text-base leading-snug transition-colors flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && optIdx === q.correctOptionIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isThisSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1">
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedOption === undefined}
                    onClick={() => handleCheck(q.id)}
                    className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Проверить ответ
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReset(q.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Попробовать снова
                  </button>
                )}
              </div>

              {isSubmitted && (
                <div className="pt-4 border-t border-zinc-800/60 space-y-2 text-[15px] sm:text-base">
                  <div
                    className={`font-semibold ${
                      isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCorrect ? 'Верно' : 'Неверно'}
                  </div>
                  <p className="text-zinc-200 leading-relaxed">{q.explanation}</p>
                  {q.commonMistake && (
                    <p className="text-[15px] text-zinc-300 leading-relaxed">
                      <span className="font-medium text-zinc-200">Типичная ошибка: </span>
                      {q.commonMistake}
                    </p>
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
