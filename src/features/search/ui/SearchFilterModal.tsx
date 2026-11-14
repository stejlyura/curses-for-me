'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getAllLessons } from '@/shared/lib/content-loader';
import { Search, X, ArrowRight } from 'lucide-react';

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
        aria-label="Поиск"
        className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-zinc-400 bg-zinc-900/80 border border-zinc-800 rounded-lg hover:text-white hover:border-zinc-700 transition-colors whitespace-nowrap shrink-0"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Поиск</span>
        <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800/80 text-zinc-400 rounded">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Поиск по урокам и метрикам"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-zinc-800">
              <Search className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                autoFocus
                type="text"
                aria-label="Поисковый запрос"
                placeholder="Поиск по метрике (LTV, ROAS, CAC, MEDDPIC), теме или вопросу..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-4 text-sm bg-transparent text-white placeholder-zinc-500 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                aria-label="Закрыть поиск"
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-4 py-3 bg-zinc-950/60 border-b border-zinc-800 text-xs space-y-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-500 mr-1">Курс:</span>
                <button
                  onClick={() => setSelectedCourse('All')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    selectedCourse === 'All'
                      ? 'bg-zinc-100 text-zinc-950 font-medium'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                  type="button"
                >
                  Все
                </button>
                {Object.entries(COURSE_NAMES).map(([slug, name]) => (
                  <button
                    key={slug}
                    onClick={() => setSelectedCourse(slug)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedCourse === slug
                        ? 'bg-zinc-100 text-zinc-950 font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                    type="button"
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-zinc-500 mr-1">Уровень:</span>
                {(['All', 'Middle', 'Senior', 'Lead'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedGrade === grade
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                    type="button"
                  >
                    {grade === 'All' ? 'Все' : grade}
                  </button>
                ))}
                <span className="ml-auto text-zinc-500 font-mono text-xs tabular-nums">
                  {filteredLessons.length}
                </span>
              </div>
            </div>

            {/* Results list */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
              {filteredLessons.length === 0 ? (
                <div className="py-12 px-4 text-center text-xs text-zinc-400">
                  По запросу &ldquo;{query}&rdquo; ничего не найдено.
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
                      className="group block px-5 py-4 hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-zinc-500 font-mono tabular-nums">
                          {courseBadge} · Урок {lesson.lessonNumber} · {lesson.level}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
                      </div>

                      <div className="mt-1 text-sm font-medium text-white group-hover:text-brand-300 transition-colors">
                        {lesson.title}
                      </div>

                      <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
                        {lesson.summary}
                      </p>
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
