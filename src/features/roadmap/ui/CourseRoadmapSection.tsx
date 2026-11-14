'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getRoadmapForCourse,
  getAllGlossaryItems,
} from '@/shared/lib/foundational-knowledge';
import { Module, Lesson } from '@/entities/lesson';
import { ArrowRight, Search } from 'lucide-react';

interface CourseRoadmapSectionProps {
  courseSlug: string;
  courseTitle: string;
  modules: Module[];
  lessons: Lesson[];
}

export const CourseRoadmapSection = ({
  courseSlug,
  modules,
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

  const stageModules = modules.filter((m) => currentStage.focusModules.includes(m.id));

  return (
    <section className="pt-12 border-t border-zinc-800/70 space-y-12">
      {/* Header & Stage Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Траектория: От 0 до Senior
          </h2>
          <p className="text-base text-zinc-400 mt-1.5">
            Выберите уровень, чтобы увидеть фокусные модули и ключевые навыки этого этапа.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start md:self-auto">
          {roadmapStages.map((stage, idx) => {
            const isSelected = selectedStageIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedStageIdx(idx)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {stage.level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Details - Flat Clean Layout */}
      <div className="space-y-6">
        <div className="space-y-2.5 max-w-3xl">
          <div className="text-sm text-brand-400 font-medium">
            {currentStage.badge} · {stageModules.length} {stageModules.length === 1 ? 'модуль' : 'модуля'}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{currentStage.title}</h3>
          <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
            {currentStage.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Что вы освоите
            </h4>
            <ul className="space-y-2.5 text-[15px] sm:text-base text-zinc-300 leading-relaxed">
              {currentStage.keySkills.map((skill, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2.5">
                  <span className="text-emerald-400 select-none">✓</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mindset */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Как меняется мышление
            </h4>
            <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
              {currentStage.mindset}
            </p>
          </div>
        </div>

        {/* Stage Modules Links */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stageModules.map((mod) => {
            const firstLessonSlug = mod.lessonSlugs[0];
            return (
              <Link
                key={mod.id}
                href={`/courses/${courseSlug}/lessons/${firstLessonSlug}/`}
                className="group flex items-center justify-between p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/35 hover:bg-zinc-900/70 hover:border-zinc-700 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-sm font-mono text-zinc-400 block mb-0.5">
                    Модуль {mod.id} · {mod.lessonSlugs.length} уроков
                  </span>
                  <span className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                    {mod.title}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Course Glossary */}
      <div className="pt-10 border-t border-zinc-800/70 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              Словарь терминов
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 mt-1">
              Базовые понятия направления простыми словами. Нажмите на термин, чтобы увидеть пример.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Найти термин..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-base sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGlossary.slice(0, 9).map((gItem, idx) => {
            const isExpanded = activeGlossaryTerm === gItem.term;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveGlossaryTerm(isExpanded ? null : gItem.term)}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  isExpanded
                    ? 'border-zinc-700 bg-zinc-900/80'
                    : 'border-zinc-800/70 bg-zinc-900/30 hover:border-zinc-700'
                }`}
              >
                <span className="text-base font-semibold text-white block">{gItem.term}</span>
                <span className="mt-1.5 text-sm sm:text-[15px] text-zinc-300 leading-relaxed block">
                  {gItem.simpleDefinition}
                </span>
                {isExpanded && (
                  <span className="mt-3 pt-3 border-t border-zinc-800 text-sm text-zinc-300 leading-relaxed block">
                    <strong className="text-zinc-200 font-medium">Пример: </strong>
                    {gItem.realWorldAnalogy}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
