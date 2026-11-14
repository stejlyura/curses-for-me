import { getAllCourses, getLessonsByCourseSlug } from '@/shared/lib/content-loader';
import { CourseCard } from '@/entities/course';
import { ActiveCourseSection } from '@/features/progress-tracker';

export default function HomePage(): React.JSX.Element {
  const courses = getAllCourses();

  const totalLessonsCount = courses.reduce((acc, c) => acc + c.stats.totalLessons, 0);
  const totalModulesCount = courses.reduce((acc, c) => acc + c.stats.totalModules, 0);
  const totalCasesCount = courses.reduce((acc, c) => acc + c.stats.caseCount, 0);
  const totalHoursCount = courses.reduce((acc, c) => acc + c.stats.estimatedHours, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20 lg:px-8 space-y-20">
      <ActiveCourseSection
        totalModulesCount={totalModulesCount}
        totalLessonsCount={totalLessonsCount}
        totalHoursCount={totalHoursCount}
        totalCasesCount={totalCasesCount}
      />

      {/* Courses Catalog */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Программы обучения
            </h2>
            <p className="text-base text-zinc-400 mt-1.5">
              Выберите специализацию. Внутри каждого урока есть переключение между базой для новичка и продвинутым уровнем.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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

      {/* Clean 3-step Methodology */}
      <section className="pt-12 border-t border-zinc-800/70 space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Как устроено обучение
          </h2>
          <p className="text-base text-zinc-400 mt-1.5">
            Три последовательных шага в каждой теме, чтобы закрыть пробелы в теории и уверенно защищать решения в цифрах.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-2">
            <div className="text-sm font-mono text-zinc-500">01</div>
            <h3 className="text-lg font-semibold text-white">База простыми словами</h3>
            <p className="text-base text-zinc-400 leading-relaxed">
              Объяснение сути без сложного сленга, бытовые аналогии, пошаговая механика процесса и словарь всех аббревиатур.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-mono text-zinc-500">02</div>
            <h3 className="text-lg font-semibold text-white">Финансовые симуляторы</h3>
            <p className="text-base text-zinc-400 leading-relaxed">
              Интерактивные модели юнит-экономики, A/B-тестов, медиабаинга и воронок продаж, чтобы понимать влияние каждой цифры на прибыль.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-mono text-zinc-500">03</div>
            <h3 className="text-lg font-semibold text-white">Защита и резюме</h3>
            <p className="text-base text-zinc-400 leading-relaxed">
              Отраслевые бенчмарки, разбор кейсов реальных компаний, стресс-вопросы собеседований и готовые формулировки по Google XYZ.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
