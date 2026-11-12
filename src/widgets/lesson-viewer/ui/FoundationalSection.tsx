'use client';

import { useState } from 'react';
import { FoundationalExplainer } from '@/entities/lesson';
import { 
  Lightbulb, 
  HelpCircle, 
  Compass, 
  ListOrdered, 
  BookOpen, 
  Scale, 
  ChevronDown, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FoundationalSectionProps {
  explainer: FoundationalExplainer;
  lessonTitle: string;
  lessonNumber: string;
}

export type ViewMode = 'all' | 'foundation' | 'senior';

export const FoundationalSection = ({
  explainer,
  lessonTitle,
  lessonNumber,
}: FoundationalSectionProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'glossary' | 'mindset'>('overview');
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);

  return (
    <section className="my-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-zinc-900/60 to-zinc-950 p-6 sm:p-8 shadow-xl">
      {/* Badge & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Траектория «От 0 до Senior» • Шаг 1: Фундамент
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Как это работает и зачем нужно (Основы для новичка)
            </h2>
          </div>
        </div>

        {/* Inner sub-tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Суть и аналогия
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'steps'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Пошагово ({explainer.stepByStepMechanics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'glossary'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Словарь ({explainer.glossary.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mindset')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'mindset'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Junior vs Senior
          </button>
        </div>
      </div>

      {/* Tab: Overview (Simple explanation + Why it matters + Real world analogy) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Simple Explanation */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                <Lightbulb className="w-4 h-4" />
                Что это такое простыми словами
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {explainer.simpleExplanation}
              </p>
            </div>

            {/* Why it Matters */}
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                <HelpCircle className="w-4 h-4" />
                Зачем это бизнесу и какую боль решает
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {explainer.whyItMatters}
              </p>
            </div>
          </div>

          {/* Real World Analogy */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5">
            <div className="flex items-start gap-3.5">
              <span className="text-2xl mt-0.5" role="img" aria-label="coffee">☕</span>
              <div className="space-y-1.5">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Аналогия из реальной жизни (Mental Model)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                    Чтобы сразу щелкнуло
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  {explainer.realWorldAnalogy}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Steps */}
      {activeTab === 'steps' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <ListOrdered className="w-4 h-4 text-emerald-400" />
            <span>Как этот процесс устроен на практике: цепочка шагов от нуля к результату</span>
          </div>
          <div className="space-y-3">
            {explainer.stepByStepMechanics.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                  {idx + 1}
                </div>
                <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed pt-0.5">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Glossary */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Словарь новичка: разбор терминов и аббревиатур урока понятным языком</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {explainer.glossary.map((g, idx) => {
              const isSelected = expandedGlossary === g.term;
              return (
                <div
                  key={idx}
                  onClick={() => setExpandedGlossary(isSelected ? null : g.term)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500/60 bg-zinc-900 shadow-md'
                      : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-emerald-300">{g.term}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform ${
                        isSelected ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                    {g.definition}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Mindset (Junior vs Senior) */}
      {activeTab === 'mindset' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <Scale className="w-4 h-4 text-purple-400" />
            <span>Эволюция мышления: типичные заблуждения новичка против подхода сеньора</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Junior Thinking */}
            <div className="rounded-2xl border border-red-900/40 bg-red-950/15 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Логика новичка (Junior / Ошибки)
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                {explainer.mindsetShift.juniorView}
              </p>
            </div>

            {/* Senior Thinking */}
            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Логика сеньора (Senior / Как мыслить правильно)
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                {explainer.mindsetShift.seniorView}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transition to Senior Level Indicator */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400 shrink-0" />
          <span>Фундамент усвоен? Ниже начинается углубленный разбор, математика и сеньорная защита.</span>
        </div>
        <div className="inline-flex items-center gap-1 text-brand-400 font-semibold self-start sm:self-center">
          <span>Сеньорный уровень далее</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </section>
  );
};
