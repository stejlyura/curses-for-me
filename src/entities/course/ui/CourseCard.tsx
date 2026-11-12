'use client';

import Link from 'next/link';
import { Course } from '../model/schemas';
import { useProgress } from '@/features/progress-tracker';
import { 
  ArrowRight, 
  Clock, 
  Layers, 
  CheckCircle2, 
  LineChart, 
  Crosshair, 
  Users, 
  PhoneCall, 
  Briefcase, 
  Flame, 
  BadgeDollarSign,
  TrendingUp,
  Cpu,
  type LucideIcon 
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  LineChart,
  Crosshair,
  Users,
  PhoneCall,
  Briefcase,
  Flame,
  BadgeDollarSign,
};

interface CourseCardProps {
  course: Course;
  lessonSlugs?: string[];
}

export const CourseCard = ({ course, lessonSlugs = [] }: CourseCardProps): React.JSX.Element => {
  const IconComponent = iconMap[course.iconName] || Briefcase;
  const { completedSlugs, isLoaded } = useProgress();

  const completedCount = isLoaded
    ? lessonSlugs.filter((slug) => completedSlugs.includes(slug)).length
    : 0;

  const totalLessons = course.stats.totalLessons;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const hasStarted = completedCount > 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-300 shadow-xl">
      <div
        className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 transition-opacity duration-300 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle, ${course.colorTheme.accent} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header badges */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${course.colorTheme.accent}15`,
              borderColor: `${course.colorTheme.accent}30`,
              color: course.colorTheme.accent,
            }}
          >
            <IconComponent className="h-6 w-6" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300">
              От 0 до {course.level}
            </span>
            <span
              className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
              style={{
                backgroundColor: `${course.colorTheme.accent}15`,
                borderColor: `${course.colorTheme.accent}40`,
                color: course.colorTheme.accent,
              }}
            >
              {course.roleBadge}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight group-hover:text-brand-300 transition-colors">
          {course.title}
        </h3>

        <p className="mt-3 text-sm text-zinc-300 leading-relaxed line-clamp-3">
          {course.shortDescription}
        </p>

        {/* Key Metrics Badges */}
        {course.keyMetrics && course.keyMetrics.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-800/60">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Целевые бизнес-метрики:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {course.keyMetrics.map((metric, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-300"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tool Stack */}
        {course.tools && course.tools.length > 0 && (
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-brand-400" />
              Стек инструментов:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {course.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/70 border border-zinc-700/60 text-zinc-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-6 pt-5 border-t border-zinc-800/80">
        {/* Progress bar if started */}
        {hasStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Прогресс курса
              </span>
              <span className="font-mono text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 py-2 px-1">
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              {course.stats.totalModules}
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Модулей</div>
          </div>
          <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 py-2 px-1">
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {course.stats.totalLessons}
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Уроков</div>
          </div>
          <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 py-2 px-1">
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {course.stats.estimatedHours}ч
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Времени</div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/courses/${course.slug}/`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all duration-200 border text-white shadow-lg group/btn hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${course.colorTheme.from}, ${course.colorTheme.to})`,
            borderColor: `${course.colorTheme.accent}40`,
          }}
        >
          <span>{hasStarted ? 'Продолжить обучение' : 'Начать обучение'}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
