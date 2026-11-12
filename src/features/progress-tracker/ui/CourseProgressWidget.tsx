'use client';

import { useProgress } from '../model/useProgress';
import { ProgressBar } from '@/shared/ui';
import { Award, CheckCircle2 } from 'lucide-react';

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Ваш прогресс</span>
        </div>
        <span className="font-mono text-zinc-300">
          {completedCount} из {totalLessons} ({percentage}%)
        </span>
      </div>

      <ProgressBar value={percentage} />

      {percentage === 100 ? (
        <div className="text-[11px] text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Курс полностью пройден! Вы готовы к сеньорным собеседованиям.
        </div>
      ) : (
        <div className="text-[11px] text-zinc-400">
          Сохраняется автоматически на устройстве (без сервера).
        </div>
      )}
    </div>
  );
};
