'use client';

import Link from 'next/link';
import { Lesson } from '@/entities/lesson';
import {
  useProgress,
  useLearningMode,
  CourseActivityTracker,
} from '@/features/progress-tracker';
import { FoundationalSection } from './FoundationalSection';
import { BenchmarkSection } from './BenchmarkSection';
import { ResearchSection } from './ResearchSection';
import { InterviewSection } from './InterviewSection';
import { ResumeBulletSection } from './ResumeBulletSection';
import { QuizSection } from './QuizSection';
import { CaseStudySection } from './CaseStudySection';
import { UnitEconomicsSimulator } from '@/features/calculators/ui/UnitEconomicsSimulator';
import { AbTestCalculator } from '@/features/calculators/ui/AbTestCalculator';
import { MediaBuyingSimulator } from '@/features/calculators/ui/MediaBuyingSimulator';
import { AffiliatePnLSimulator } from '@/features/calculators/ui/AffiliatePnLSimulator';
import { OutboundPipelineSimulator } from '@/features/calculators/ui/OutboundPipelineSimulator';
import { ResumeBulletGenerator } from '@/features/resume-builder/ui/ResumeBulletGenerator';
import { getCourseBySlug } from '@/shared/lib/content-loader';
import { getFoundationalExplainerForLesson } from '@/shared/lib/foundational-knowledge';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

interface LessonViewerProps {
  lesson: Lesson;
  courseSlug?: string;
  prevLesson?: Lesson;
  nextLesson?: Lesson;
}

export const LessonViewer = ({
  lesson,
  courseSlug = 'senior-marketing',
  prevLesson,
  nextLesson,
}: LessonViewerProps): React.JSX.Element => {
  const { learningMode, setLearningMode } = useLearningMode();
  const { isCompleted, toggleLesson } = useProgress();
  const completed = isCompleted(lesson.slug);
  const course = getCourseBySlug(courseSlug);
  const courseTitle = course ? course.title : 'Курс';
  const foundationalExplainer = getFoundationalExplainerForLesson(lesson);

  return (
    <article className="max-w-3xl mx-auto px-6 py-10 sm:py-14 space-y-12">
      <CourseActivityTracker courseSlug={courseSlug} lessonSlug={lesson.slug} />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-zinc-400 flex-wrap">
        <Link href="/" className="hover:text-zinc-200 transition-colors">
          Курсы
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/courses/${courseSlug}/`} className="hover:text-zinc-200 transition-colors truncate max-w-[200px] sm:max-w-none">
          {courseTitle}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-200 truncate max-w-[200px] sm:max-w-xs">{lesson.moduleTitle}</span>
      </nav>

      {/* Header */}
      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <span className="font-mono text-brand-400">Урок {lesson.lessonNumber}</span>
          <span aria-hidden="true">·</span>
          <span>Уровень {lesson.level}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{lesson.readTimeMinutes} мин</span>
        </div>

        <h1 className="text-[26px] sm:text-4xl font-bold text-white tracking-tight leading-[1.2] text-balance">
          {lesson.title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
          {lesson.summary}
        </p>

        {/* Clean Learning Mode Switcher */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm text-zinc-400">Режим отображения:</span>
          <div className="inline-flex flex-wrap items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-sm self-start sm:self-auto max-w-full">
            <button
              type="button"
              onClick={() => setLearningMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                learningMode === 'all'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Полный курс
            </button>
            <button
              type="button"
              onClick={() => setLearningMode('foundation')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                learningMode === 'foundation'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              База с нуля
            </button>
            <button
              type="button"
              onClick={() => setLearningMode('senior')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
                learningMode === 'senior'
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Только Senior
            </button>
          </div>
        </div>
      </header>

      {/* Step 1: Foundational Explainer */}
      {(learningMode === 'all' || learningMode === 'foundation') && (
        <FoundationalSection
          explainer={foundationalExplainer}
          lessonTitle={lesson.title}
          lessonNumber={lesson.lessonNumber}
        />
      )}

      {/* Core Concepts & Formulas */}
      {lesson.coreConcepts.length > 0 && (
        <section className="pt-10 border-t border-zinc-800/70 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Ключевые понятия и формулы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lesson.coreConcepts.map((c, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-3">
                <h3 className="text-base font-semibold text-white">{c.title}</h3>
                <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">{c.explanation}</p>
                {c.formulas && c.formulas.length > 0 && (
                  <div className="pt-3 border-t border-zinc-800/60 space-y-1.5">
                    {c.formulas.map((f, fIdx) => (
                      <div key={fIdx} className="text-sm font-mono text-emerald-400 break-words">
                        {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Benchmarks */}
      {learningMode !== 'foundation' && (
        <BenchmarkSection metrics={lesson.benchmarkMetrics} />
      )}

      {/* Research Insights */}
      {learningMode !== 'foundation' && (
        <ResearchSection insights={lesson.researchInsights} />
      )}

      {/* Longread Deep Dive */}
      <section className="pt-10 border-t border-zinc-800/70 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Подробный разбор
        </h2>
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-headings:font-semibold prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-strong:text-white prose-code:text-brand-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          <div className="whitespace-pre-line leading-[1.75] text-base sm:text-[17px] text-zinc-200">
            {lesson.longreadMarkdown}
          </div>
        </div>
      </section>

      {/* Interview Defense */}
      <InterviewSection cases={lesson.interviewCases} />

      {/* Case Studies */}
      <CaseStudySection caseStudies={lesson.caseStudies || []} />

      {/* Quiz */}
      <QuizSection questions={lesson.quizQuestions || []} />

      {/* Contextual Interactive Simulators */}
      {(lesson.slug.startsWith('1-1-') || lesson.slug.startsWith('1-2-') || lesson.slug.startsWith('1-3-')) && (
        <section className="pt-10 border-t border-zinc-800/70 space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Практический симулятор</h3>
          <UnitEconomicsSimulator />
        </section>
      )}

      {lesson.slug.startsWith('2-4-') && (
        <section className="pt-10 border-t border-zinc-800/70 space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Калькулятор A/B-теста</h3>
          <AbTestCalculator />
        </section>
      )}

      {(lesson.slug.startsWith('7-1-') || lesson.slug.startsWith('7-2-') || lesson.slug.startsWith('11-1-')) && (
        <section className="pt-10 border-t border-zinc-800/70 space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Симулятор окупаемости медиабаинга</h3>
          <MediaBuyingSimulator />
        </section>
      )}

      {(lesson.slug.startsWith('12-2-') || lesson.slug.startsWith('16-1-')) && (
        <section className="pt-10 border-t border-zinc-800/70 space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Симулятор P&L партнерской программы</h3>
          <AffiliatePnLSimulator />
        </section>
      )}

      {(lesson.slug.startsWith('17-1-') ||
        lesson.slug.startsWith('19-1-') ||
        lesson.slug.startsWith('20-1-') ||
        lesson.slug.startsWith('21-1-')) && (
        <section className="pt-10 border-t border-zinc-800/70 space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Симулятор воронки B2B-аутрича</h3>
          <OutboundPipelineSimulator />
        </section>
      )}

      {(lesson.slug.includes('resume') ||
        lesson.slug.startsWith('6-6-') ||
        lesson.slug.startsWith('11-3-') ||
        lesson.slug.startsWith('16-3-') ||
        lesson.slug.startsWith('21-3-')) && (
        <section className="pt-10 border-t border-zinc-800/70 space-y-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Генератор формулировок резюме</h3>
          <ResumeBulletGenerator />
        </section>
      )}

      {/* Resume Bullets */}
      <ResumeBulletSection bullets={lesson.resumeBullets} />

      {/* Bottom Completion & Navigation */}
      <footer className="pt-8 border-t border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => toggleLesson(lesson.slug)}
          type="button"
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            completed
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {completed ? 'Урок пройден' : 'Отметить пройденным'}
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {prevLesson && (
            <Link
              href={`/courses/${courseSlug}/lessons/${prevLesson.slug}/`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Предыдущий
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/courses/${courseSlug}/lessons/${nextLesson.slug}/`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
            >
              Следующий
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
