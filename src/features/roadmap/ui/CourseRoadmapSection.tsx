'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  RoadmapStage, 
  GlossaryItem, 
  getRoadmapForCourse, 
  getAllGlossaryItems 
} from '@/shared/lib/foundational-knowledge';
import { Module, Lesson } from '@/entities/lesson';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  BookOpen, 
  Compass, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface CourseRoadmapSectionProps {
  courseSlug: string;
  courseTitle: string;
  modules: Module[];
  lessons: Lesson[];
}

export const CourseRoadmapSection = ({
  courseSlug,
  courseTitle,
  modules,
  lessons,
}: CourseRoadmapSectionProps): React.JSX.Element => {
  const roadmapStages = getRoadmapForCourse(courseSlug);
  const glossaryItems = getAllGlossaryItems(courseSlug);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);

  const currentStage = roadmapStages[selectedStageIdx] || roadmapStages[0];

  const filteredGlossary = glossaryItems.filter((item) => {
    if (!glossarySearch.trim()) return true;
    const q = glossarySearch.toLowerCase();
    return (
      item.term.toLowerCase().includes(q) ||
      item.simpleDefinition.toLowerCase().includes(q) ||
      item.whyItMatters.toLowerCase().includes(q)
    );
  });

  // Get modules for this stage
  const stageModules = modules.filter((m) => currentStage.focusModules.includes(m.id));

  return (
    <section className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/80 via-zinc-950/80 to-zinc-950 p-6 sm:p-10 space-y-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <Compass className="w-3.5 h-3.5" />
            Интерактивная методология обучения
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Траектория развития: От 0 до Senior
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Курс построен без пробелов в знаниях: сначала разбираем простыми словами, как всё устроено и зачем это нужно бизнесу, тренируемся на прикладных симуляторах, а затем переходим к сеньорной стратегии и защите на собеседованиях.
          </p>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl shrink-0">
          {roadmapStages.map((stage, idx) => {
            const isSelected = selectedStageIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedStageIdx(idx)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-lg scale-[1.02]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {stage.badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Card */}
      <div className="rounded-2xl border border-brand-500/30 bg-brand-950/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentStage.badgeColor}`}>
              {currentStage.level}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {currentStage.title}
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            Охватывает {stageModules.length} {stageModules.length === 1 ? 'модуль' : 'модуля'}
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
          {currentStage.description}
        </p>

        {/* Mindset Transformation Box */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
              Трансформация мышления на этом этапе
            </span>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {currentStage.mindset}
            </p>
          </div>
        </div>

        {/* Key Skills Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Приобретаемые навыки и компетенции:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentStage.keySkills.map((skill, sIdx) => (
              <div key={sIdx} className="flex items-center gap-2.5 text-xs text-zinc-200 bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modules for this stage */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Модули для изучения на этом уровне:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stageModules.map((mod) => {
              const firstLessonSlug = mod.lessonSlugs[0];
              return (
                <Link
                  key={mod.id}
                  href={`/courses/${courseSlug}/lessons/${firstLessonSlug}/`}
                  className="group flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-brand-500/50 transition-all"
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-xs font-semibold text-brand-400 block mb-0.5">
                      Модуль {mod.id} • {mod.lessonSlugs.length} уроков
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                      {mod.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Course-level Glossary (С нуля) */}
      <div className="pt-6 border-t border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              База знаний направления (С нуля)
            </div>
            <h3 className="text-lg font-bold text-white">
              Глоссарий ключевых терминов и понятий
            </h3>
            <p className="text-xs text-zinc-400">
              Быстрый справочник: разбор всех аббревиатур простыми словами с жизненными аналогиями.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Поиск термина (LTV, CAC, CAPI)..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Glossary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredGlossary.slice(0, 9).map((gItem, idx) => {
            const isExpanded = activeGlossaryTerm === gItem.term;
            return (
              <div
                key={idx}
                onClick={() => setActiveGlossaryTerm(isExpanded ? null : gItem.term)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isExpanded
                    ? 'border-brand-500/60 bg-zinc-900 shadow-md'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-brand-300">{gItem.term}</span>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                    Термин
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                  {gItem.simpleDefinition}
                </p>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
                    <div>
                      <strong className="text-zinc-200">Аналогия:</strong> {gItem.realWorldAnalogy}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
