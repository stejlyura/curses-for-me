import Link from 'next/link';
import { Lesson } from '../model/schemas';
import { Badge } from '@/shared/ui';
import { Clock, Target, HelpCircle, FileCheck, ArrowRight } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
}

export const LessonCard = ({ lesson, isCompleted }: LessonCardProps): React.JSX.Element => {
  return (
    <Link
      href={`/lessons/${lesson.slug}/`}
      className="group block p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-brand-500/40 transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">
            {lesson.lessonNumber}
          </Badge>
          <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
            {lesson.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isCompleted && (
            <Badge variant="success" size="sm">
              Пройдено
            </Badge>
          )}
          <Badge variant="default" size="sm">
            {lesson.level}
          </Badge>
        </div>
      </div>

      <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
        {lesson.summary}
      </p>

      <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            {lesson.readTimeMinutes} мин
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-400" />
            {lesson.benchmarkMetrics.length}
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-brand-400" />
            {lesson.interviewCases.length}
          </span>
          <span className="flex items-center gap-1">
            <FileCheck className="w-3 h-3 text-emerald-400" />
            {lesson.resumeBullets.length}
          </span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
};

