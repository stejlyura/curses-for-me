'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllLessons } from '@/shared/lib/content-loader';
import { 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RotateCcw, 
  X,
  ArrowRight,
  Layers
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 hover:bg-brand-500/20 transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
        Тренажер собеседований ({allCases.length} кейсов)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Senior / Lead Interview Simulator
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Стресс-вопросы и поведенческие кейсы по 4 курсам
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">
                  {filteredCases.length > 0 ? currentIndex + 1 : 0} из {filteredCases.length}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div className="px-6 py-2.5 bg-zinc-950/70 border-b border-zinc-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-400 mr-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-brand-400" /> Курс:
                </span>
                <button
                  onClick={() => {
                    setSelectedCourse('All');
                    setCurrentIndex(0);
                    setIsAnswerRevealed(false);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                    selectedCourse === 'All'
                      ? 'bg-brand-600 text-white font-medium'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
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
                    className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                      selectedCourse === slug
                        ? 'bg-brand-600 text-white font-medium'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-400 mr-1">Грейд:</span>
                {(['All', 'Middle', 'Senior', 'Director'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setCurrentIndex(0);
                      setIsAnswerRevealed(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-zinc-700 text-white font-medium'
                        : 'bg-zinc-850 text-zinc-400 hover:text-white'
                    }`}
                    type="button"
                  >
                    {diff === 'All' ? 'Все уровни' : diff}
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
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border bg-zinc-800 text-brand-300 border-zinc-700">
                        {COURSE_LABELS[currentCase.courseSlug] ?? 'Course'}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                          currentCase.difficulty === 'Director'
                            ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                            : currentCase.difficulty === 'Senior'
                            ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                            : 'bg-blue-950/60 border-blue-800 text-blue-300'
                        }`}
                      >
                        Грейд: {currentCase.difficulty}
                      </span>
                      <Link
                        href={`/courses/${currentCase.courseSlug}/lessons/${currentCase.lessonSlug}/`}
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] text-zinc-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1 ml-auto"
                      >
                        <span>Урок: {currentCase.lessonTitle}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <h4 className="text-lg font-bold text-white leading-snug">
                      {currentCase.question}
                    </h4>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300">
                    <span className="font-semibold text-white block mb-1">
                      Что на самом деле оценивает интервьюер:
                    </span>
                    {currentCase.whatInterviewerLooksFor}
                  </div>

                  {!isAnswerRevealed ? (
                    <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center space-y-3">
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        Сначала сформулируйте свой ответ вслух, прежде чем смотреть разбор и антипаттерны.
                      </p>
                      <button
                        onClick={() => setIsAnswerRevealed(true)}
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-750 text-white transition-all shadow-sm"
                      >
                        <Eye className="w-4 h-4 text-brand-400" />
                        Показать эталонный сеньорный ответ
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Anti-pattern */}
                      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs space-y-1">
                        <div className="font-bold text-rose-400 uppercase tracking-wider text-[10px]">
                          Типичный джуниор/мидл антипаттерн (отказ на скрининге):
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                          {currentCase.antiPatternAnswer}
                        </p>
                      </div>

                      {/* Senior Answer */}
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-1.5">
                        <div className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                          Эталонный Battle-Tested ответ (Senior / Lead level):
                        </div>
                        <p className="text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
                          {currentCase.seniorBattleTestedAnswer}
                        </p>
                      </div>

                      {/* Probing questions */}
                      {currentCase.probingQuestions && currentCase.probingQuestions.length > 0 && (
                        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs space-y-1">
                          <div className="font-bold text-brand-300 uppercase tracking-wider text-[10px]">
                            Углубленные follow-up вопросы интервьюера:
                          </div>
                          <ul className="list-disc list-inside text-zinc-400 space-y-1 pt-1">
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
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>

              <button
                onClick={() => toggleMastered(currentIndex)}
                type="button"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  masteredIds.includes(currentIndex)
                    ? 'bg-emerald-900/50 border border-emerald-700 text-emerald-300'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {masteredIds.includes(currentIndex) ? 'Освоено' : 'Отметить как освоенное'}
              </button>

              <button
                onClick={handleNext}
                disabled={filteredCases.length <= 1}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50"
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
