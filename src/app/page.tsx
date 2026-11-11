import { getAllCourses, getLessonsByCourseSlug } from '@/shared/lib/content-loader';
import { CourseCard } from '@/entities/course';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Cpu, 
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

export default function HomePage(): React.JSX.Element {
  const courses = getAllCourses();

  const totalLessonsCount = courses.reduce((acc, c) => acc + c.stats.totalLessons, 0);
  const totalCasesCount = courses.reduce((acc, c) => acc + c.stats.caseCount, 0);
  const totalHoursCount = courses.reduce((acc, c) => acc + c.stats.estimatedHours, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            Academy of High-Performance Marketing & Outbound Sales
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl text-balance">
            Практические курсы для специалистов, готовых к сеньорным собеседованиям
          </h1>

          <p className="mt-4 text-base text-zinc-300 sm:text-lg leading-relaxed max-w-3xl">
            Никакой воды: аукционная эконометрика, Unit-экономика, когортный анализ, скрапинг B2B данных, антифрод партнерских сетей и готовые ответы для интервью по стандарту Google XYZ. Выберите специализацию для старта.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                <Layers className="w-5 h-5 text-brand-400" />
                {courses.length}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Профессиональных трека</div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {totalLessonsCount}+
              </div>
              <div className="text-xs text-zinc-400 mt-1">Атомарных тем</div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <div className="text-2xl font-bold text-white flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-400" />
                {totalCasesCount}+
              </div>
              <div className="text-xs text-zinc-400 mt-1">Кейсов с защитой перед C-Level</div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
              <div className="text-2xl font-bold text-purple-400 flex items-center gap-1.5">
                <Cpu className="w-5 h-5" />
                ~{totalHoursCount} ч
              </div>
              <div className="text-xs text-zinc-400 mt-1">Концентрированной практики</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Catalog Grid (Core Requirement) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              Каталог образовательных программ
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Выберите направление обучения
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Каждый курс автономен, содержит детальный силлабус, интерактивные симуляторы и проверочные тесты.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => {
            const courseLessons = getLessonsByCourseSlug(course.slug);
            const lessonSlugs = courseLessons.map((l) => l.slug);

            return (
              <CourseCard
                key={course.id}
                course={course}
                lessonSlugs={lessonSlugs}
              />
            );
          })}
        </div>
      </section>

      {/* Standards Banner */}
      <section className="rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 sm:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            Методологические стандарты платформы
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Почему эти курсы готовят к реальному офферу
          </h3>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            В отличие от абстрактных курсов, каждая тема подкреплена реальными когортными отчетами, математическими формулами расчета безубыточности и ответами на каверзные вопросы нанимающих директоров (VP of Growth, CMO, Head of Sales).
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <div className="text-brand-400 font-bold text-sm mb-2">1. Математика & P&L</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Не просто «запуск рекламы», а точный расчет предельного CPA от LTV, инкрементальности (iROAS), эластичности спроса и кассовых разрывов.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <div className="text-emerald-400 font-bold text-sm mb-2">2. Google XYZ Резюме</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Готовые шаблоны формулировок достижений по стандарту Google: «Достиг [X], измеренное через [Y], путем реализации [Z]» под каждый модуль.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <div className="text-purple-400 font-bold text-sm mb-2">3. Zero-Token & Offline SSG</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Все симуляторы, калькуляторы и тесты работают на 100% клиентской стороне (0 API токенов, мгновенный отклик, PWA поддержка).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
