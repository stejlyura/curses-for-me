import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  getAllCourses, 
  getCourseBySlug, 
  getModulesByCourseSlug, 
  getLessonsByCourseSlug 
} from '@/shared/lib/content-loader';
import { UnitEconomicsSimulator } from '@/features/calculators/ui/UnitEconomicsSimulator';
import { AbTestCalculator } from '@/features/calculators/ui/AbTestCalculator';
import { MediaBuyingSimulator } from '@/features/calculators/ui/MediaBuyingSimulator';
import { AffiliatePnLSimulator } from '@/features/calculators/ui/AffiliatePnLSimulator';
import { OutboundPipelineSimulator } from '@/features/calculators/ui/OutboundPipelineSimulator';
import { ResumeBulletGenerator } from '@/features/resume-builder/ui/ResumeBulletGenerator';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Target, 
  Briefcase,
  LineChart,
  Crosshair,
  Users,
  PhoneCall,
  Flame,
  BadgeDollarSign,
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

interface PageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  return courses.map((course) => ({
    courseSlug: course.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    return {
      title: 'Курс не найден | Marketolog Academy',
    };
  }

  return {
    title: `${course.title} — Практический курс | Marketolog`,
    description: course.shortDescription,
    openGraph: {
      title: `${course.title} | Marketolog Academy`,
      description: course.shortDescription,
      type: 'website',
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const modules = getModulesByCourseSlug(courseSlug);
  const lessons = getLessonsByCourseSlug(courseSlug);
  const firstLessonSlug = lessons.length > 0 ? lessons[0].slug : undefined;
  const IconComponent = iconMap[course.iconName] || Briefcase;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation Top */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Все курсы платформы
          </Link>
        </div>

        {/* Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 sm:p-12 shadow-2xl">
          <div
            className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(circle, ${course.colorTheme.accent} 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  backgroundColor: `${course.colorTheme.accent}15`,
                  borderColor: `${course.colorTheme.accent}30`,
                  color: course.colorTheme.accent,
                }}
              >
                <IconComponent className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-300">
                Уровень: {course.level}
              </span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
                style={{
                  backgroundColor: `${course.colorTheme.accent}15`,
                  borderColor: `${course.colorTheme.accent}40`,
                  color: course.colorTheme.accent,
                }}
              >
                {course.roleBadge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
              {course.fullDescription}
            </p>

            {/* Stats Row */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-5 h-5 text-zinc-400" />
                  {course.stats.totalModules}
                </div>
                <div className="text-xs text-zinc-400 mt-1">Практических модулей</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  {course.stats.totalLessons}
                </div>
                <div className="text-xs text-zinc-400 mt-1">Атомарных уроков</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-zinc-400" />
                  ~{course.stats.estimatedHours} ч
                </div>
                <div className="text-xs text-zinc-400 mt-1">Длительность курса</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-2xl font-bold text-brand-400 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5" />
                  {course.stats.caseCount}+
                </div>
                <div className="text-xs text-zinc-400 mt-1">Кейсов с защитой</div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {firstLessonSlug ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${firstLessonSlug}/`}
                  className="inline-flex items-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold text-white shadow-xl transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${course.colorTheme.from}, ${course.colorTheme.to})`,
                  }}
                >
                  <span>Начать обучение</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl py-3 px-5 text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                  <Clock className="h-4 w-4" />
                  Учебный план сформирован. Наполнение уроков в разработке
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Competencies & Target Audience */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-brand-400" />
              Для кого этот курс
            </h2>
            <ul className="space-y-2.5">
              {course.targetAudience.map((target, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{target}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Ключевые компетенции программы
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.keyCompetencies.map((comp, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/70 text-zinc-300"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Syllabus / Modules Roadmap */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Учебный план и модули
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Пошаговая программа с формулами, бенчмарками и вопросами для интервью.
              </p>
            </div>
          </div>

          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module, mIdx) => {
                const moduleLessons = lessons.filter((l) => l.moduleId === module.id);

                return (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-zinc-800/80">
                      <div>
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                          Модуль {mIdx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-0.5">{module.title}</h3>
                        <p className="text-xs text-zinc-400 mt-1">{module.description}</p>
                      </div>
                      <span className="text-xs text-zinc-400 shrink-0 self-start sm:self-center">
                        {module.lessonSlugs.length} уроков
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {module.lessonSlugs.map((slug) => {
                        const lesson = lessons.find((l) => l.slug === slug);

                        return (
                          <Link
                            key={slug}
                            href={`/courses/${course.slug}/lessons/${slug}/`}
                            className="group flex items-center justify-between p-3 rounded-xl border border-zinc-800/60 bg-zinc-950/50 hover:bg-zinc-800/60 hover:border-brand-500/40 transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <BookOpen className="w-4 h-4 text-zinc-500 group-hover:text-brand-400 shrink-0 transition-colors" />
                              <span className="text-xs font-medium text-zinc-300 group-hover:text-white truncate">
                                {lesson ? `${lesson.lessonNumber} ${lesson.title}` : slug}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Модули курса проектируются</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                План уроков для курса «{course.title}» зафиксирован в бэклоге платформы. Контент и симуляторы будут развернуты в следующих шагах.
              </p>
            </div>
          )}
        </section>

        {/* Course Specific Interactive Simulators */}
        {courseSlug === 'senior-marketing' && (
          <section className="space-y-8 pt-6 border-t border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 text-xs font-semibold mb-2">
                <Cpu className="w-3.5 h-3.5" />
                Практикум: 100% Client-Side Simulators
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Интерактивные тренажеры и калькуляторы курса
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Инструменты для стресс-тестирования экономики, расчетов A/B экспериментов и генерации формулировок резюме.
              </p>
            </div>

            <UnitEconomicsSimulator />
            <AbTestCalculator />
            <ResumeBulletGenerator />
          </section>
        )}

        {courseSlug === 'media-buying' && (
          <section className="space-y-8 pt-6 border-t border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
                <Flame className="w-3.5 h-3.5" />
                Практикум: Traffic Unit Economics Engine
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Интерактивный симулятор окупаемости медиабаинга
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Моделирование CPM, CTR, конверсий CR1/CR2, допустимого CPA, маржинальности и точки Break-Even ROAS.
              </p>
            </div>

            <MediaBuyingSimulator />
          </section>
        )}

        {courseSlug === 'affiliate-manager' && (
          <section className="space-y-8 pt-6 border-t border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                Практикум: Affiliate Program Financial P&L Simulator
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Интерактивный симулятор P&L партнерской программы
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Моделирование комиссионных моделей CPA, RevShare и Hybrid, учет фрода, чарджбеков и расчет чистой маржи рекламодателя.
              </p>
            </div>

            <AffiliatePnLSimulator />
          </section>
        )}

        {courseSlug === 'lead-generation' && (
          <section className="space-y-8 pt-6 border-t border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
                <Target className="w-3.5 h-3.5" />
                Практикум: Outbound B2B Pipeline Engine
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Интерактивный симулятор воронки холодного аутрича
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Моделирование доменной инфраструктуры, Deliverability, конверсий от ответа до демо и расчет пайплайна ARR.
              </p>
            </div>

            <OutboundPipelineSimulator />
          </section>
        )}
      </div>
    </div>
  );
}
