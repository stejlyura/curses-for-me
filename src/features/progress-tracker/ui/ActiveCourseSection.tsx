'use client';

import Link from 'next/link';
import { coursesData } from '@/shared/data/courses';
import { allLessonsData } from '@/shared/data/lessons';
import { ProgressBar } from '@/shared/ui';
import { useActiveCourse } from '../model/useActiveCourse';
import { useProgress } from '../model/useProgress';
import { ArrowRight } from 'lucide-react';

interface ActiveCourseSectionProps {
  totalModulesCount: number;
  totalLessonsCount: number;
  totalHoursCount: number;
  totalCasesCount: number;
}

export const ActiveCourseSection = ({
  totalModulesCount,
  totalLessonsCount,
  totalHoursCount,
  totalCasesCount,
}: ActiveCourseSectionProps): React.JSX.Element => {
  const { activeCourse, isLoaded, resumeHref, clearActiveCourse } = useActiveCourse();
  const { completedSlugs, isLoaded: isProgressLoaded } = useProgress();

  const currentCourse =
    isLoaded && activeCourse
      ? coursesData.find((c) => c.slug === activeCourse.courseSlug)
      : undefined;

  if (currentCourse && activeCourse) {
    const courseLessons = allLessonsData.filter(
      (l) => (l.courseSlug ?? 'senior-marketing') === currentCourse.slug
    );
    const lessonSlugs = courseLessons.map((l) => l.slug);

    const completedCount = isProgressLoaded
      ? lessonSlugs.filter((slug) => completedSlugs.includes(slug)).length
      : 0;
    const totalCourseLessons = currentCourse.stats.totalLessons;
    const progressPercent =
      totalCourseLessons > 0 ? Math.round((completedCount / totalCourseLessons) * 100) : 0;

    const currentLesson = activeCourse.lessonSlug
      ? courseLessons.find((l) => l.slug === activeCourse.lessonSlug)
      : courseLessons[0];

    const targetHref = resumeHref ?? `/courses/${currentCourse.slug}/`;

    return (
      <section className="max-w-3xl space-y-6" data-testid="active-course-section">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
          <p className="text-sm sm:text-base font-medium text-brand-400">
            Текущий курс · {currentCourse.roleBadge}
          </p>
          <button
            type="button"
            onClick={clearActiveCourse}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Сбросить текущий курс
          </button>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
            {currentCourse.title}
          </h1>

          {currentLesson ? (
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              <span className="text-zinc-500">
                {activeCourse.lessonSlug ? 'Вы остановились на уроке ' : 'Первый урок: '}
              </span>
              <span className="font-mono text-zinc-200">{currentLesson.lessonNumber}</span>{' '}
              {currentLesson.title}
            </p>
          ) : (
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              {currentCourse.shortDescription}
            </p>
          )}
        </div>

        <div className="pt-2 space-y-2.5 max-w-md">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>Прогресс по курсу</span>
            <span className="font-mono tabular-nums text-zinc-200">
              {completedCount} / {totalCourseLessons} ({progressPercent}%)
            </span>
          </div>
          <ProgressBar value={progressPercent} />
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href={targetHref}
            className="inline-flex items-center gap-2 rounded-lg py-2.5 px-5 text-sm sm:text-base font-semibold text-zinc-950 bg-zinc-100 hover:bg-white transition-colors"
          >
            <span>
              {activeCourse.lessonSlug ? 'Продолжить урок' : 'Начать обучение'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`/courses/${currentCourse.slug}/`}
            className="inline-flex items-center gap-2 rounded-lg py-2.5 px-4 text-sm sm:text-base font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors"
          >
            Программа курса
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl space-y-6">
      <p className="text-sm sm:text-base font-medium text-brand-400">
        Обучение маркетингу и B2B-продажам · От 0 до Senior
      </p>

      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
        Системные курсы от первых основ до уровня Senior
      </h1>

      <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
        Разбираем простыми словами, как всё устроено на практике, тренируемся на финансовых симуляторах и готовимся к сеньорным собеседованиям по стандарту Google XYZ.
      </p>

      <div className="pt-6 border-t border-zinc-800/70 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {coursesData.length}
          </div>
          <div className="text-sm text-zinc-400 mt-1">Направления</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {totalModulesCount}
          </div>
          <div className="text-sm text-zinc-400 mt-1">Модулей</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {totalLessonsCount}
          </div>
          <div className="text-sm text-zinc-400 mt-1">Уроков и разборов</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            ~{totalHoursCount} <span className="font-sans font-semibold">ч</span>
          </div>
          <div className="text-sm text-zinc-400 mt-1">{totalCasesCount}+ кейсов</div>
        </div>
      </div>
    </section>
  );
};
