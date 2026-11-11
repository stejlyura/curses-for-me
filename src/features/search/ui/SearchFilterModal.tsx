'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAllLessons } from '@/shared/lib/content-loader';
import { Search, X, Target, HelpCircle, FileCheck, ArrowRight, Layers } from 'lucide-react';

const COURSE_NAMES: Record<string, string> = {
  'senior-marketing': 'Senior Growth',
  'media-buying': 'Media Buying / PPC',
  'affiliate-manager': 'Affiliate Manager',
  'lead-generation': 'SDR / Lead Gen',
};

export const SearchFilterModal = (): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'All' | 'Middle' | 'Senior' | 'Lead'>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const allLessons = useMemo(() => getAllLessons(), []);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredLessons = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();

    return allLessons.filter((lesson) => {
      if (selectedGrade !== 'All' && lesson.level !== selectedGrade) {
        return false;
      }
      if (selectedCourse !== 'All' && (lesson.courseSlug ?? 'senior-marketing') !== selectedCourse) {
        return false;
      }
      if (!cleanQuery) return true;

      const titleMatch = lesson.title.toLowerCase().includes(cleanQuery);
      const summaryMatch = lesson.summary.toLowerCase().includes(cleanQuery);
      const metricMatch = lesson.benchmarkMetrics.some(
        (m) =>
          m.metric.toLowerCase().includes(cleanQuery) ||
          m.calculation.toLowerCase().includes(cleanQuery)
      );
      const questionMatch = lesson.interviewCases.some((c) =>
        c.question.toLowerCase().includes(cleanQuery)
      );

      return titleMatch || summaryMatch || metricMatch || questionMatch;
    });
  }, [allLessons, query, selectedGrade, selectedCourse]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl hover:text-white hover:border-zinc-700 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Поиск по метрикам и кейсам...</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-zinc-800">
              <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Поиск по метрике (LTV, ROAS, CAC, MEDDPIC, MMM), кейсу собеседования..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-4 text-sm bg-transparent text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter pills */}
            <div className="px-4 py-2.5 bg-zinc-950/60 border-b border-zinc-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-400 mr-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-brand-400" /> Курс:
                </span>
                <button
                  onClick={() => setSelectedCourse('All')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                    selectedCourse === 'All'
                      ? 'bg-brand-600 text-white font-medium'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                  type="button"
                >
                  Все курсы
                </button>
                {Object.entries(COURSE_NAMES).map(([slug, name]) => (
                  <button
                    key={slug}
                    onClick={() => setSelectedCourse(slug)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                      selectedCourse === slug
                        ? 'bg-brand-600 text-white font-medium'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                    type="button"
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-400 mr-1">Грейд:</span>
                {(['All', 'Middle', 'Senior', 'Lead'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] transition-colors ${
                      selectedGrade === grade
                        ? 'bg-zinc-700 text-white font-medium'
                        : 'bg-zinc-850 text-zinc-400 hover:text-white'
                    }`}
                    type="button"
                  >
                    {grade === 'All' ? 'Все' : grade}
                  </button>
                ))}
                <span className="ml-auto text-zinc-400 font-mono text-[11px]">
                  {filteredLessons.length} найдено
                </span>
              </div>
            </div>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredLessons.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  По запросу &ldquo;{query}&rdquo; ничего не найдено. Попробуйте другой термин (например, LTV, ROAS, CAC, Retention, PMax, MEDDPIC).
                </div>
              ) : (
                filteredLessons.map((lesson) => {
                  const courseSlug = lesson.courseSlug ?? 'senior-marketing';
                  const courseBadge = COURSE_NAMES[courseSlug] ?? 'Course';

                  return (
                    <Link
                      key={lesson.slug}
                      href={`/courses/${courseSlug}/lessons/${lesson.slug}/`}
                      onClick={() => setIsOpen(false)}
                      className="group block p-3.5 rounded-xl border border-zinc-800/70 bg-zinc-950/40 hover:bg-zinc-800/50 hover:border-brand-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-brand-300 border border-zinc-700">
                            {courseBadge}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            {lesson.lessonNumber}
                          </span>
                          <span className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors">
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {lesson.level}
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs text-zinc-400 line-clamp-1">
                        {lesson.summary}
                      </p>

                      <div className="mt-2.5 flex items-center gap-4 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-amber-400" />
                          {lesson.benchmarkMetrics.length} метрик
                        </span>
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-brand-400" />
                          {lesson.interviewCases.length} кейса
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-emerald-400" />
                          {lesson.resumeBullets.length} формул
                        </span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
