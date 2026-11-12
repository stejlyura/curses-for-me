'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lesson } from '@/entities/lesson';
import { useProgress } from '@/features/progress-tracker/model/useProgress';
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
import { 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Sigma,
  GraduationCap,
  SlidersHorizontal
} from 'lucide-react';

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
  const [learningMode, setLearningMode] = useState<'all' | 'foundation' | 'senior'>('all');
  const { isCompleted, toggleLesson } = useProgress();
  const completed = isCompleted(lesson.slug);
  const course = getCourseBySlug(courseSlug);
  const courseTitle = course ? course.title : 'Курс';
  const foundationalExplainer = getFoundationalExplainerForLesson(lesson);


  return (
    <article className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400 mb-6 flex-wrap">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Главная
        </Link>
        <span className="text-zinc-600">/</span>
        <Link href={`/courses/${courseSlug}/`} className="hover:text-white transition-colors truncate max-w-[200px] sm:max-w-none">
          {courseTitle}
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300 truncate max-w-[180px] sm:max-w-xs">{lesson.moduleTitle}</span>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-100 font-medium truncate max-w-[150px] sm:max-w-xs">Урок {lesson.lessonNumber}</span>
      </nav>

      {/* Header Info */}
      <header className="border-b border-zinc-800 pb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
            Урок {lesson.lessonNumber}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              lesson.level === 'Lead'
                ? 'bg-purple-950/40 border-purple-800 text-purple-300'
                : lesson.level === 'Senior'
                ? 'bg-indigo-950/40 border-indigo-800 text-indigo-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}
          >
            Уровень: {lesson.level}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lesson.readTimeMinutes} мин чтения
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {lesson.title}
        </h1>

        <div className="mt-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-300 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block mb-0.5">Суть без воды:</span>
            {lesson.summary}
          </div>
        </div>
      </header>

      {/* Learning Mode Switcher (От 0 до Senior) */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Режим обучения:</span>
          <span className="text-zinc-400 hidden md:inline">выберите подачу под свои цели</span>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80 text-xs">
          <button
            type="button"
            onClick={() => setLearningMode('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              learningMode === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚡ От 0 до Senior (Полный)
          </button>
          <button
            type="button"
            onClick={() => setLearningMode('foundation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              learningMode === 'foundation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🔰 С нуля (Понимание)
          </button>
          <button
            type="button"
            onClick={() => setLearningMode('senior')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              learningMode === 'senior'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🚀 Senior экспресс
          </button>
        </div>
      </div>

      {/* Step 1: Foundational Explainer (Shown in 'all' and 'foundation' modes) */}
      {(learningMode === 'all' || learningMode === 'foundation') && (
        <FoundationalSection
          explainer={foundationalExplainer}
          lessonTitle={lesson.title}
          lessonNumber={lesson.lessonNumber}
        />
      )}

      {/* Core Concepts & Formulas */}
      {lesson.coreConcepts.length > 0 && (
        <section className="my-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Sigma className="w-4 h-4 text-brand-400" />
            Ключевые понятия и математические формулы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.coreConcepts.map((c, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-4">
                <h3 className="text-sm font-bold text-brand-300">{c.title}</h3>
                <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">{c.explanation}</p>
                {c.formulas && c.formulas.length > 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-zinc-800/60 space-y-1">
                    {c.formulas.map((f, fIdx) => (
                      <div key={fIdx} className="text-xs font-mono text-emerald-400 bg-zinc-900 px-2 py-1 rounded">
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

      {/* Benchmarks (Shown in 'all' and 'senior' modes) */}
      {learningMode !== 'foundation' && (
        <BenchmarkSection metrics={lesson.benchmarkMetrics} />
      )}

      {/* Research Insights (Shown in 'all' and 'senior' modes) */}
      {learningMode !== 'foundation' && (
        <ResearchSection insights={lesson.researchInsights} />
      )}

      {/* Longread Deep Dive */}
      <section className="my-10">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-brand-400" />
          <h2 className="text-xl font-bold text-white">Углубленный разбор темы</h2>
        </div>
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-strong:text-white prose-code:text-brand-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          <div className="whitespace-pre-line leading-relaxed text-sm text-zinc-300">
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
        <section className="my-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Интерактивный тренажер к уроку</h3>
          </div>
          <UnitEconomicsSimulator />
        </section>
      )}

      {lesson.slug.startsWith('2-4-') && (
        <section className="my-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Интерактивный калькулятор A/B теста</h3>
          </div>
          <AbTestCalculator />
        </section>
      )}

      {(lesson.slug.startsWith('7-1-') || lesson.slug.startsWith('7-2-') || lesson.slug.startsWith('11-1-')) && (
        <section className="my-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Интерактивный симулятор окупаемости медиабаинга</h3>
          </div>
          <MediaBuyingSimulator />
        </section>
      )}

      {(lesson.slug.startsWith('12-2-') || lesson.slug.startsWith('16-1-')) && (
        <section className="my-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Интерактивный симулятор P&L партнерской программы</h3>
          </div>
          <AffiliatePnLSimulator />
        </section>
      )}

      {(lesson.slug.startsWith('17-1-') ||
        lesson.slug.startsWith('19-1-') ||
        lesson.slug.startsWith('20-1-') ||
        lesson.slug.startsWith('21-1-')) && (
        <section className="my-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Интерактивный симулятор воронки B2B аутрича</h3>
          </div>
          <OutboundPipelineSimulator />
        </section>
      )}

      {(lesson.slug.includes('resume') ||
        lesson.slug.startsWith('6-6-') ||
        lesson.slug.startsWith('11-3-') ||
        lesson.slug.startsWith('16-3-') ||
        lesson.slug.startsWith('21-3-')) && (
        <section className="my-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Генератор формулировок резюме (Google XYZ)</h3>
          </div>
          <ResumeBulletGenerator />
        </section>
      )}

      {/* Resume Bullets */}
      <ResumeBulletSection bullets={lesson.resumeBullets} />

      {/* Bottom Completion & Navigation */}
      <footer className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => toggleLesson(lesson.slug)}
          type="button"
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            completed
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-zinc-800 text-zinc-200 hover:bg-brand-600 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {completed ? 'Пройдено (Нажмите, чтобы сбросить)' : 'Отметить как пройденный'}
        </button>

        <div className="flex items-center gap-3">
          {prevLesson && (
            <Link
              href={`/courses/${courseSlug}/lessons/${prevLesson.slug}/`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Предыдущий
            </Link>
          )}
          {nextLesson && (
            <Link
              href={`/courses/${courseSlug}/lessons/${nextLesson.slug}/`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors shadow-sm"
            >
              Следующий
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
