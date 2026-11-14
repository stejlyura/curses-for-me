'use client';

import { useProgress } from '../model/useProgress';
import { ProgressBar } from '@/shared/ui';

interface CourseProgressWidgetProps {
  totalLessons: number;
  courseLessonSlugs?: string[];
}

export const CourseProgressWidget = ({
  totalLessons,
  courseLessonSlugs,
}: CourseProgressWidgetProps): React.JSX.Element | null => {
  const { completedSlugs, isLoaded } = useProgress();

  if (!isLoaded) return null;

  const completedCount = courseLessonSlugs
    ? completedSlugs.filter((slug) => courseLessonSlugs.includes(slug)).length
    : completedSlugs.length;

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="pb-5 border-b border-zinc-800/70 space-y-2.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-300">Прогресс по курсу</span>
        <span className="font-mono text-zinc-400 tabular-nums">
          {completedCount} / {totalLessons} ({percentage}%)
        </span>
      </div>

      <ProgressBar value={percentage} />

      <p className="text-xs text-zinc-500">
        {percentage === 100
          ? 'Курс полностью пройден.'
          : 'Сохраняется локально в браузере.'}
      </p>
    </div>
  );
};
