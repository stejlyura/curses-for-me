import Link from 'next/link';
import { Course } from '@/entities/course';
import { Lesson, Module } from '@/entities/lesson';
import { CourseActivityTracker } from '@/features/progress-tracker';
import { UnitEconomicsSimulator } from '@/features/calculators/ui/UnitEconomicsSimulator';
import { AbTestCalculator } from '@/features/calculators/ui/AbTestCalculator';
import { MediaBuyingSimulator } from '@/features/calculators/ui/MediaBuyingSimulator';
import { AffiliatePnLSimulator } from '@/features/calculators/ui/AffiliatePnLSimulator';
import { OutboundPipelineSimulator } from '@/features/calculators/ui/OutboundPipelineSimulator';
import { ResumeBulletGenerator } from '@/features/resume-builder/ui/ResumeBulletGenerator';
import { CourseRoadmapSection } from '@/features/roadmap/ui/CourseRoadmapSection';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

interface CourseOverviewContentProps {
  course: Course;
  modules: Module[];
  lessons: Lesson[];
}

export const CourseOverviewContent = ({
  course,
  modules,
  lessons,
}: CourseOverviewContentProps): React.JSX.Element => {
  const firstLessonSlug = lessons.length > 0 ? lessons[0].slug : undefined;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16 lg:px-8 space-y-16">
      <CourseActivityTracker courseSlug={course.slug} />

      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Все курсы
        </Link>
      </div>

      <section className="max-w-3xl space-y-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="font-medium text-brand-400">{course.roleBadge}</span>
          <span aria-hidden="true">·</span>
          <span>От 0 до {course.level}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15] text-balance">
          {course.title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
          {course.fullDescription}
        </p>

        <div className="pt-6 border-t border-zinc-800/70 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {course.stats.totalModules}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Модулей</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {course.stats.totalLessons}
            </div>
            <div className="text-sm text-zinc-400 mt-1">Уроков</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              ~{course.stats.estimatedHours} <span className="font-sans font-semibold">ч</span>
            </div>
            <div className="text-sm text-zinc-400 mt-1">Длительность</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {course.stats.caseCount}+
            </div>
            <div className="text-sm text-zinc-400 mt-1">Кейсов</div>
          </div>
        </div>

        <div className="pt-2">
          {firstLessonSlug ? (
            <Link
              href={`/courses/${course.slug}/lessons/${firstLessonSlug}/`}
              className="inline-flex items-center gap-2 rounded-lg py-2.5 px-5 text-sm sm:text-base font-semibold text-zinc-950 bg-zinc-100 hover:bg-white transition-colors"
            >
              <span>Начать с первого урока</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <Clock className="h-4 w-4" />
              Учебный план сформирован. Наполнение уроков в разработке
            </div>
          )}
        </div>
      </section>

      <section className="pt-12 border-t border-zinc-800/70 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Для кого этот курс</h2>
          <ul className="space-y-3 text-[15px] sm:text-base text-zinc-300 leading-relaxed">
            {course.targetAudience.map((target, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-zinc-600 select-none">—</span>
                <span>{target}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Ключевые компетенции</h2>
          <ul className="space-y-2.5 text-[15px] sm:text-base text-zinc-300 leading-relaxed">
            {course.keyCompetencies.map((comp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-brand-400 select-none">·</span>
                <span>{comp}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CourseRoadmapSection
        courseSlug={course.slug}
        courseTitle={course.title}
        modules={modules}
        lessons={lessons}
      />

      <section className="pt-12 border-t border-zinc-800/70 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Программа курса</h2>
          <p className="text-base text-zinc-400 mt-1.5">Пошаговый план модулей и уроков.</p>
        </div>

        {modules.length > 0 ? (
          <div className="divide-y divide-zinc-800/70 border-t border-b border-zinc-800/70">
            {modules.map((module, mIdx) => (
              <div key={module.id} className="py-8 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="text-sm font-mono text-brand-400">Модуль {mIdx + 1}</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{module.title}</h3>
                    <p className="text-[15px] sm:text-base text-zinc-400 leading-relaxed">{module.description}</p>
                  </div>
                  <span className="text-sm font-mono text-zinc-500 shrink-0">
                    {module.lessonSlugs.length} уроков
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {module.lessonSlugs.map((slug) => {
                    const lesson = lessons.find((l) => l.slug === slug);

                    return (
                      <Link
                        key={slug}
                        href={`/courses/${course.slug}/lessons/${slug}/`}
                        className="group flex items-center justify-between px-4 py-3.5 rounded-xl border border-zinc-800/70 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors"
                      >
                        <span className="text-sm sm:text-[15px] font-medium text-zinc-200 group-hover:text-white leading-snug pr-3">
                          {lesson ? `${lesson.lessonNumber} ${lesson.title}` : slug}
                        </span>
                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base text-zinc-400">
            Учебный план для курса «{course.title}» формируется.
          </p>
        )}
      </section>

      {course.slug === 'senior-marketing' && (
        <section className="pt-12 border-t border-zinc-800/70 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Практические симуляторы
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              Калькуляторы юнит-экономики, достоверности A/B-тестов и конструктор резюме.
            </p>
          </div>
          <UnitEconomicsSimulator />
          <AbTestCalculator />
          <ResumeBulletGenerator />
        </section>
      )}

      {course.slug === 'media-buying' && (
        <section className="pt-12 border-t border-zinc-800/70 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Симулятор окупаемости медиабаинга
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              Моделирование CPM, CTR, конверсий и точки Break-Even ROAS.
            </p>
          </div>
          <MediaBuyingSimulator />
        </section>
      )}

      {course.slug === 'affiliate-manager' && (
        <section className="pt-12 border-t border-zinc-800/70 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Симулятор P&amp;L партнерской программы
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              Моделирование CPA, RevShare и Hybrid с учетом фрода и чарджбеков.
            </p>
          </div>
          <AffiliatePnLSimulator />
        </section>
      )}

      {course.slug === 'lead-generation' && (
        <section className="pt-12 border-t border-zinc-800/70 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Симулятор воронки B2B-аутрича
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              Расчет доменной инфраструктуры, доставляемости и пайплайна ARR.
            </p>
          </div>
          <OutboundPipelineSimulator />
        </section>
      )}
    </div>
  );
};
