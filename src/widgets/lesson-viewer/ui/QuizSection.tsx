'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/entities/lesson';
import { HelpCircle, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
}

export const QuizSection = ({ questions }: QuizSectionProps): React.JSX.Element => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  if (questions.length === 0) return <></>;

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
    <section className="my-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Интерактивный тест на усвоение материала</h3>
          <p className="text-xs text-zinc-400">
            Проверьте себя перед собеседованием: разбор ловушек и типичных ошибок.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selectedOption = selectedAnswers[q.id];
          const isSubmitted = submitted[q.id];
          const isCorrect = selectedOption === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 space-y-4"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  Вопрос {idx + 1}
                </span>
                <h4 className="text-sm font-semibold text-white leading-snug">{q.question}</h4>
              </div>

              <div className="space-y-2">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  let optionStyle = 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-300';

                  if (isSubmitted) {
                    if (optIdx === q.correctOptionIndex) {
                      optionStyle = 'border-emerald-600 bg-emerald-950/40 text-emerald-200 font-medium';
                    } else if (isThisSelected && !isCorrect) {
                      optionStyle = 'border-rose-600 bg-rose-950/40 text-rose-200';
                    } else {
                      optionStyle = 'border-zinc-800/40 bg-zinc-950 text-zinc-500 opacity-60';
                    }
                  } else if (isThisSelected) {
                    optionStyle = 'border-brand-500 bg-brand-950/40 text-brand-200 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && optIdx === q.correctOptionIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isSubmitted && isThisSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                {!isSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedOption === undefined}
                    onClick={() => handleCheck(q.id)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Проверить ответ
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReset(q.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Попробовать снова
                  </button>
                )}
              </div>

              {isSubmitted && (
                <div
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-1.5 animate-fadeIn ${
                    isCorrect
                      ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-200'
                      : 'border-rose-800/60 bg-rose-950/20 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Верно!
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        Неверно.
                      </>
                    )}
                  </div>
                  <p className="text-zinc-300">{q.explanation}</p>
                  {q.commonMistake && (
                    <p className="text-zinc-400 text-[11px] pt-1 border-t border-zinc-800/60">
                      <span className="font-semibold text-zinc-300">Типичная ошибка кандидатов: </span>
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

