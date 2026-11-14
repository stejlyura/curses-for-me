'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllLessons } from '@/shared/lib/content-loader';
import {
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';

const COURSE_LABELS: Record<string, string> = {
  'senior-marketing': 'Senior Growth',
  'media-buying': 'Media Buying',
  'affiliate-manager': 'Affiliate',
  'lead-generation': 'SDR / Lead Gen',
};

export const InterviewSimulatorModal = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Middle' | 'Senior' | 'Director'>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  const allLessons = useMemo(() => getAllLessons(), []);

  // Collect all cases with source lesson title and courseSlug
  const allCases = useMemo(() => {
    return allLessons.flatMap((l) =>
      l.interviewCases.map((c) => ({
        ...c,
        lessonTitle: l.title,
        lessonSlug: l.slug,
        courseSlug: l.courseSlug ?? 'senior-marketing',
      }))
    );
  }, [allLessons]);

  const filteredCases = useMemo(() => {
    return allCases.filter((c) => {
      if (selectedDifficulty !== 'All' && c.difficulty !== selectedDifficulty) return false;
      if (selectedCourse !== 'All' && c.courseSlug !== selectedCourse) return false;
      return true;
    });
  }, [allCases, selectedDifficulty, selectedCourse]);

  const currentCase = filteredCases[currentIndex] || filteredCases[0];

  const handleNext = () => {
    setIsAnswerRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % (filteredCases.length || 1));
  };

  const handlePrev = () => {
    setIsAnswerRevealed(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCases.length) % (filteredCases.length || 1));
  };

  const toggleMastered = (idx: number) => {
    setMasteredIds((prev) =>
      prev.includes(idx) ? prev.filter((id) => id !== idx) : [...prev, idx]
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white transition-colors whitespace-nowrap shrink-0"
      >
        <span className="sm:hidden">Интервью</span>
        <span className="hidden sm:inline">Тренажер интервью</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Тренажер интервью"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Тренажер интервью
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Стресс-вопросы и разбор ответов по 4 курсам
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400 tabular-nums">
                  {filteredCases.length > 0 ? currentIndex + 1 : 0} / {filteredCases.length}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  aria-label="Закрыть тренажер"
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 bg-zinc-950/60 border-b border-zinc-800 text-xs space-y-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-500 mr-1">Курс:</span>
                <button
                  onClick={() => {
                    setSelectedCourse('All');
                    setCurrentIndex(0);
                    setIsAnswerRevealed(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    selectedCourse === 'All'
                      ? 'bg-zinc-100 text-zinc-950 font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                  type="button"
                >
                  Все
                </button>
                {Object.entries(COURSE_LABELS).map(([slug, label]) => (
                  <button
                    key={slug}
                    onClick={() => {
                      setSelectedCourse(slug);
                      setCurrentIndex(0);
                      setIsAnswerRevealed(false);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedCourse === slug
                        ? 'bg-zinc-100 text-zinc-950 font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-500 mr-1">Уровень:</span>
                {(['All', 'Middle', 'Senior', 'Director'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setCurrentIndex(0);
                      setIsAnswerRevealed(false);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                    type="button"
                  >
                    {diff === 'All' ? 'Все' : diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!currentCase ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  Нет кейсов, соответствующих выбранным фильтрам.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-zinc-400">
                      <span className="font-mono">
                        {COURSE_LABELS[currentCase.courseSlug] ?? 'Course'} · {currentCase.difficulty}
                      </span>
                      <Link
                        href={`/courses/${currentCase.courseSlug}/lessons/${currentCase.lessonSlug}/`}
                        onClick={() => setIsOpen(false)}
                        className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                      >
                        <span>{currentCase.lessonTitle}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <h4 className="text-lg font-semibold text-white leading-snug">
                      {currentCase.question}
                    </h4>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/70 space-y-1 text-xs sm:text-sm">
                    <div className="text-xs font-medium text-zinc-400">
                      Что проверяет интервьюер
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      {currentCase.whatInterviewerLooksFor}
                    </p>
                  </div>

                  {!isAnswerRevealed ? (
                    <div className="py-8 border-t border-zinc-800/70 text-center space-y-4">
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        Сформулируйте ответ вслух, прежде чем открыть разбор.
                      </p>
                      <button
                        onClick={() => setIsAnswerRevealed(true)}
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Показать разбор ответа
                      </button>
                    </div>
                  ) : (
                    <div className="pt-5 border-t border-zinc-800/70 space-y-5 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-rose-400">
                            Слабый ответ (Red Flag)
                          </div>
                          <p className="text-zinc-400 leading-relaxed">
                            {currentCase.antiPatternAnswer}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-emerald-400">
                            Эталонный ответ (Senior)
                          </div>
                          <p className="text-zinc-200 leading-relaxed whitespace-pre-line">
                            {currentCase.seniorBattleTestedAnswer}
                          </p>
                        </div>
                      </div>

                      {currentCase.probingQuestions && currentCase.probingQuestions.length > 0 && (
                        <div className="pt-4 border-t border-zinc-800/60 space-y-1.5">
                          <div className="text-xs font-medium text-zinc-400">
                            Дополнительные вопросы интервьюера
                          </div>
                          <ul className="list-disc list-inside text-zinc-400 space-y-1 text-xs">
                            {currentCase.probingQuestions.map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={() => setIsAnswerRevealed(false)}
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          Скрыть ответ
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/60">
              <button
                onClick={handlePrev}
                disabled={filteredCases.length <= 1}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>

              <button
                onClick={() => toggleMastered(currentIndex)}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  masteredIds.includes(currentIndex)
                    ? 'bg-emerald-950/50 border-emerald-700 text-emerald-300'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {masteredIds.includes(currentIndex) ? 'Освоено' : 'Отметить освоенным'}
              </button>

              <button
                onClick={handleNext}
                disabled={filteredCases.length <= 1}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40"
              >
                Дальше
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
