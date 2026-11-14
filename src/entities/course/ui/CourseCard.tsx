'use client';

import Link from 'next/link';
import { Course } from '../model/schemas';
import { useProgress, useActiveCourse } from '@/features/progress-tracker';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  lessonSlugs?: string[];
}

export const CourseCard = ({ course, lessonSlugs = [] }: CourseCardProps): React.JSX.Element => {
  const { completedSlugs, isLoaded } = useProgress();
  const { activeCourse, isLoaded: isActiveLoaded } = useActiveCourse();

  const completedCount = isLoaded
    ? lessonSlugs.filter((slug) => completedSlugs.includes(slug)).length
    : 0;

  const isCurrentCourse = isActiveLoaded && activeCourse?.courseSlug === course.slug;
  const totalLessons = course.stats.totalLessons;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const hasStarted = completedCount > 0;

  return (
    <Link
      href={`/courses/${course.slug}/`}
      className={`group flex flex-col justify-between rounded-2xl border p-7 sm:p-8 transition-colors duration-200 ${
        isCurrentCourse
          ? 'border-zinc-600 bg-zinc-900/60 hover:border-zinc-500'
          : 'border-zinc-800/80 bg-zinc-900/35 hover:border-zinc-700 hover:bg-zinc-900/60'
      }`}
    >
      <div className="space-y-4">
        {/* Clean unboxed metadata line */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-brand-400">{course.roleBadge}</span>
            <span aria-hidden="true">·</span>
            <span>От 0 до {course.level}</span>
          </div>
          {isCurrentCourse && (
            <span className="font-medium text-emerald-400">Текущий курс</span>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-2.5">
          <h3 className="text-xl sm:text-[22px] font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors">
            {course.title}
          </h3>
          <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed line-clamp-3">
            {course.shortDescription}
          </p>
        </div>

        {/* Unboxed Focus Summary */}
        {(course.keyMetrics?.length || course.tools?.length) ? (
          <div className="pt-2 space-y-1.5 text-sm text-zinc-400">
            {course.keyMetrics && course.keyMetrics.length > 0 && (
              <p className="line-clamp-1">
                <span className="text-zinc-500">Метрики: </span>
                <span className="text-zinc-300">{course.keyMetrics.slice(0, 4).join(', ')}</span>
              </p>
            )}
            {course.tools && course.tools.length > 0 && (
              <p className="line-clamp-1">
                <span className="text-zinc-500">Стек: </span>
                <span className="text-zinc-300">{course.tools.slice(0, 4).join(', ')}</span>
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-8 pt-5 border-t border-zinc-800/70 space-y-4">
        {(hasStarted || isCurrentCourse) && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>Прогресс</span>
              <span className="font-mono tabular-nums text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-zinc-400 font-mono tabular-nums">
            {course.stats.totalModules} мод. · {course.stats.totalLessons} ур. · ~{course.stats.estimatedHours} ч
          </div>

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:text-brand-300 transition-colors whitespace-nowrap shrink-0">
            {hasStarted || isCurrentCourse ? 'Продолжить' : 'Открыть курс'}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
