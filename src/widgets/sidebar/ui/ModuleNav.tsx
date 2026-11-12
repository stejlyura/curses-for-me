'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  getModulesByCourseSlug, 
  getLessonsByCourseSlug, 
  getAllCourses, 
  getCourseBySlug 
} from '@/shared/lib/content-loader';
import { useProgress, CourseProgressWidget } from '@/features/progress-tracker';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  ArrowLeft,
  GraduationCap
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

  const courses = getAllCourses();
  const currentCourse = getCourseBySlug(activeCourseSlug) ?? courses[0];
  const modules = getModulesByCourseSlug(activeCourseSlug);
  const allLessons = getLessonsByCourseSlug(activeCourseSlug);
  const { isCompleted } = useProgress();

  // Find module containing the currently open lesson
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

  // Restore active module from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`marketolog_active_module_${activeCourseSlug}`);
      if (stored !== null) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed) && modules.some((m) => m.id === parsed)) {
          setExpandedModuleId(parsed);
          return;
        }
      }
    } catch {
      // ignore localStorage errors
    }

    if (currentModuleId !== undefined) {
      setExpandedModuleId(currentModuleId);
    }
  }, [activeCourseSlug, currentModuleId, modules]);

  const handleToggleModule = (moduleId: number) => {
    setExpandedModuleId((prev) => {
      const nextId = prev === moduleId ? null : moduleId;
      try {
        if (nextId !== null) {
          localStorage.setItem(`marketolog_active_module_${activeCourseSlug}`, String(nextId));
        } else {
          localStorage.removeItem(`marketolog_active_module_${activeCourseSlug}`);
        }
      } catch {
        // ignore localStorage errors
      }
      return nextId;
    });
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 border-r border-zinc-800 bg-zinc-950/70 p-4 lg:p-6 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:overflow-y-auto space-y-6">
      {/* Course Switcher & Catalog Link */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Каталог курсов
          </Link>
          <span className="text-[11px] font-mono text-zinc-400">4 курса</span>
        </div>

        {/* Current Course Dropdown Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSwitcherOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800/90 transition-all text-left group"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${currentCourse.colorTheme.accent}15`,
                  borderColor: `${currentCourse.colorTheme.accent}30`,
                  color: currentCourse.colorTheme.accent,
                }}
              >
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="min-w-0 block">
                <span className="text-xs font-bold text-white truncate block">{currentCourse.title}</span>
                <span className="text-[10px] text-zinc-400 truncate block">{currentCourse.roleBadge}</span>
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-transform ${
                isSwitcherOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isSwitcherOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Переключить курс
              </div>
              {courses.map((course) => {
                const isSelected = course.slug === activeCourseSlug;
                return (
                  <Link
                    key={course.slug}
                    href={`/courses/${course.slug}/`}
                    onClick={() => setIsSwitcherOpen(false)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div>{course.title}</div>
                      <div className="text-[10px] text-zinc-400">{course.level}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress for this course */}
        <CourseProgressWidget
          totalLessons={allLessons.length}
          courseLessonSlugs={allLessons.map((l) => l.slug)}
        />
      </div>

      {/* Modules & Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span>Модули программы</span>
        </div>

        <div className="space-y-3">
          {modules.map((module) => {
            const isExpanded = expandedModuleId === module.id;
            const completedInModule = module.lessonSlugs.filter((slug) => isCompleted(slug)).length;
            const isModuleCompleted =
              module.lessonSlugs.length > 0 && completedInModule === module.lessonSlugs.length;

            return (
              <div
                key={module.id}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden"
              >
                {/* Module Header / Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleModule(module.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-900/60 transition-colors"
                >
                  <span className="min-w-0 pr-2 block">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-200 truncate">
                        {module.title}
                      </span>
                      {isModuleCompleted && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 block">
                      {completedInModule} из {module.lessonSlugs.length} уроков
                    </span>
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform ${
                      isExpanded ? 'rotate-90 text-brand-400' : ''
                    }`}
                  />
                </button>

                {/* Lessons in Module */}
                {isExpanded && (
                  <div className="p-1.5 pt-0 space-y-1 border-t border-zinc-800/50">
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
                          className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                            isCurrent
                              ? 'bg-brand-600 text-white font-semibold shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                completed
                                  ? isCurrent
                                    ? 'text-white'
                                    : 'text-emerald-400'
                                  : isCurrent
                                  ? 'text-brand-200'
                                  : 'text-zinc-400'
                              }`}
                            />
                            <span className="truncate">
                              {lesson ? `${lesson.lessonNumber} ${lesson.title}` : slug}
                            </span>
                          </div>
                          {isCurrent && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
