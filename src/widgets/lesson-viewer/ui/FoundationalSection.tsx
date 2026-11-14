'use client';

import { useState } from 'react';
import { FoundationalExplainer } from '@/entities/lesson';

interface FoundationalSectionProps {
  explainer: FoundationalExplainer;
  lessonTitle: string;
  lessonNumber: string;
}

export type ViewMode = 'all' | 'foundation' | 'senior';

export const FoundationalSection = ({
  explainer,
}: FoundationalSectionProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'glossary' | 'mindset'>('overview');

  return (
    <section className="pt-10 border-t border-zinc-800/70 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Основы простыми словами
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Как это работает на практике, зачем нужно бизнесу и ключевые термины.
          </p>
        </div>

        {/* Clean underline / segmented sub-tabs */}
        <div className="inline-flex flex-wrap items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-sm self-start sm:self-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Суть
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'steps'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Пошагово
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'glossary'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Словарь
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mindset')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'mindset'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Junior vs Senior
          </button>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white">Что это такое</h3>
              <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
                {explainer.simpleExplanation}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white">Зачем это бизнесу</h3>
              <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
                {explainer.whyItMatters}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-2">
            <div className="text-sm font-medium text-emerald-400">
              Пример из жизни
            </div>
            <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
              {explainer.realWorldAnalogy}
            </p>
          </div>
        </div>
      )}

      {/* Tab: Steps */}
      {activeTab === 'steps' && (
        <ol className="divide-y divide-zinc-800/60 border-t border-b border-zinc-800/60">
          {explainer.stepByStepMechanics.map((step, idx) => (
            <li key={idx} className="py-4 flex items-start gap-4">
              <span className="text-sm font-mono text-zinc-500 pt-0.5 tabular-nums">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="text-[15px] sm:text-base text-zinc-200 leading-relaxed">
                {step}
              </span>
            </li>
          ))}
        </ol>
      )}

      {/* Tab: Glossary */}
      {activeTab === 'glossary' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {explainer.glossary.map((g, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 space-y-2"
            >
              <div className="text-base font-semibold text-white">{g.term}</div>
              <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
                {g.definition}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Mindset */}
      {activeTab === 'mindset' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-2">
            <div className="text-sm font-medium text-rose-400">
              Логика новичка (ошибки)
            </div>
            <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
              {explainer.mindsetShift.juniorView}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-2">
            <div className="text-sm font-medium text-emerald-400">
              Логика уровня Senior
            </div>
            <p className="text-[15px] sm:text-base text-zinc-200 leading-relaxed">
              {explainer.mindsetShift.seniorView}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
