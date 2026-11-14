'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getModulesByCourseSlug,
  getLessonsByCourseSlug,
  getAllCourses,
  getCourseBySlug,
} from '@/shared/lib/content-loader';
import { useProgress, CourseProgressWidget } from '@/features/progress-tracker';
import { useOptionalAuthSync } from '@/features/auth';
import {
  LEARNING_STATE_EVENT,
  readActiveModuleForCourse,
  writeActiveModuleForCourse,
} from '@/features/progress-tracker/model/learning-store';
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';

interface ModuleNavProps {
  courseSlug?: string;
  currentCourseSlug?: string;
}

export const ModuleNav = ({
  courseSlug,
  currentCourseSlug,
}: ModuleNavProps): React.JSX.Element => {
  const pathname = usePathname();
  const activeCourseSlug = currentCourseSlug ?? courseSlug ?? 'senior-marketing';
  const auth = useOptionalAuthSync();
  const isAuthenticated = auth?.isAuthenticated ?? false;

  const courses = getAllCourses();
  const currentCourse = getCourseBySlug(activeCourseSlug) ?? courses[0];
  const modules = getModulesByCourseSlug(activeCourseSlug);
  const allLessons = getLessonsByCourseSlug(activeCourseSlug);
  const { isCompleted } = useProgress();

  const currentModuleId = modules.find((m) =>
    m.lessonSlugs.some(
      (slug) =>
        pathname === `/courses/${activeCourseSlug}/lessons/${slug}/` ||
        pathname === `/courses/${activeCourseSlug}/lessons/${slug}` ||
        pathname === `/lessons/${slug}/` ||
        pathname === `/lessons/${slug}`
    )
  )?.id;

  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(
    currentModuleId ?? (modules.length > 0 ? modules[0].id : null)
  );
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  useEffect(() => {
    const syncModule = () => {
      if (isAuthenticated) {
        const stored = readActiveModuleForCourse(activeCourseSlug);
        if (stored !== null && modules.some((m) => m.id === stored)) {
          setExpandedModuleId(stored);
          return;
        }
      }

      if (currentModuleId !== undefined) {
        setExpandedModuleId(currentModuleId);
      }
    };

    syncModule();
    window.addEventListener(LEARNING_STATE_EVENT, syncModule);
    return () => window.removeEventListener(LEARNING_STATE_EVENT, syncModule);
  }, [activeCourseSlug, currentModuleId, isAuthenticated, modules]);

  const handleToggleModule = (moduleId: number) => {
    setExpandedModuleId((prev) => {
      const nextId = prev === moduleId ? null : moduleId;
      if (isAuthenticated) {
        writeActiveModuleForCourse(activeCourseSlug, nextId);
      }
      return nextId;
    });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800/70 bg-zinc-950 p-5 lg:p-6 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:overflow-y-auto space-y-6">
      {/* Course Switcher */}
      <div className="space-y-4">
        <Link
          href={`/courses/${activeCourseSlug}/`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          К обзору курса
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSwitcherOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 transition-colors text-left"
          >
            <span className="min-w-0 pr-2 block">
              <span className="text-sm font-semibold text-white truncate block">
                {currentCourse.title}
              </span>
              <span className="text-xs text-zinc-400 truncate block">
                {currentCourse.roleBadge}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                isSwitcherOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isSwitcherOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-xl space-y-0.5">
              {courses.map((course) => {
                const isSelected = course.slug === activeCourseSlug;
                return (
                  <Link
                    key={course.slug}
                    href={`/courses/${course.slug}/`}
                    onClick={() => setIsSwitcherOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-zinc-800 text-white font-medium'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{course.title}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <CourseProgressWidget
          totalLessons={allLessons.length}
          courseLessonSlugs={allLessons.map((l) => l.slug)}
        />
      </div>

      {/* Modules & Lessons List */}
      <nav className="space-y-1">
        <div className="px-1 pb-2 text-xs font-medium text-zinc-500">
          Содержание
        </div>

        <div className="divide-y divide-zinc-800/50">
          {modules.map((module) => {
            const isExpanded = expandedModuleId === module.id;
            const completedInModule = module.lessonSlugs.filter((slug) => isCompleted(slug)).length;

            return (
              <div key={module.id} className="py-2">
                <button
                  type="button"
                  onClick={() => handleToggleModule(module.id)}
                  className="w-full flex items-center justify-between py-2 px-1 text-left group"
                >
                  <span className="min-w-0 pr-2 block">
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors block leading-snug">
                      {module.title}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono tabular-nums mt-0.5 block">
                      {completedInModule}/{module.lessonSlugs.length}
                    </span>
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${
                      isExpanded ? 'rotate-90 text-zinc-300' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-1.5 space-y-0.5 pl-1">
                    {module.lessonSlugs.map((slug) => {
                      const lesson = allLessons.find((l) => l.slug === slug);
                      const isCurrent =
                        pathname === `/courses/${activeCourseSlug}/lessons/${slug}/` ||
                        pathname === `/courses/${activeCourseSlug}/lessons/${slug}` ||
                        pathname === `/lessons/${slug}/` ||
                        pathname === `/lessons/${slug}`;
                      const completed = isCompleted(slug);

                      return (
                        <Link
                          key={slug}
                          href={`/courses/${activeCourseSlug}/lessons/${slug}/`}
                          className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm leading-snug transition-colors ${
                            isCurrent
                              ? 'bg-zinc-900 text-white font-medium'
                              : 'text-zinc-300 hover:text-white hover:bg-zinc-900/40'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              completed
                                ? 'text-emerald-400'
                                : isCurrent
                                ? 'text-brand-400'
                                : 'text-zinc-600'
                            }`}
                          />
                          <span className="line-clamp-2 lg:truncate">
                            {lesson ? `${lesson.lessonNumber} ${lesson.title}` : slug}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
