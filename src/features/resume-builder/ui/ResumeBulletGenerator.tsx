'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface BulletPreset {
  discipline: string;
  actionVerb: string;
  metricBefore: string;
  metricAfter: string;
  actionHow: string;
  businessImpact: string;
}

const PRESETS: BulletPreset[] = [
  {
    discipline: 'Paid & Performance',
    actionVerb: 'Масштабировал омниканальный перформанс-спенд',
    metricBefore: '$40,000',
    metricAfter: '$180,000/мес',
    actionHow:
      'консолидации структуры кампаний в Meta Advantage+ и внедрения Value-Based Bidding в Google Ads',
    businessImpact: 'снижении Blended CPA на 24% и генерации $1.4M дополнительного ARR',
  },
  {
    discipline: 'Unit Economics',
    actionVerb: 'Сократил срок окупаемости затрат на привлечение (CAC Payback)',
    metricBefore: '14.5 месяцев',
    metricAfter: '7.2 месяцев',
    actionHow:
      'когортной оптимизации каналов, повышению валовой маржинальности и переходу на годовые тарифы',
    businessImpact: 'высвобождении $320,000 свободного оборотного капитала для экспансии',
  },
  {
    discipline: 'Analytics & MMM',
    actionVerb:
      'Внедрил систему доказательного эконометрического моделирования (MMM) и Geo-Lift тестирования',
    metricBefore: 'неопределенности в 45%',
    metricAfter: '92% точности инкрементальной оценки',
    actionHow: 'развертывания Meta Robyn и калибровки атрибуции по реальному инкрементальному ROAS (iROAS)',
    businessImpact: 'перераспределении $250k неэффективного спенда и росте общей выручки бизнеса на 18%',
  },
  {
    discipline: 'PLG & Retention',
    actionVerb: 'Повысил когортный ретеншн первого месяца (M1 Retention)',
    metricBefore: '28%',
    metricAfter: '43%',
    actionHow:
      'сокращения Time-to-Value (TTV) с 4 дней до 15 минут и автоматизации триггерного онбординга вокруг Aha!-момента',
    businessImpact: 'снижении валового оттока (Churn) на 31% и росте NRR до 118%',
  },
  {
    discipline: 'Product Marketing',
    actionVerb: 'Перепозиционировал B2B Enterprise-платформу по методологии Эйприл Данфорд',
    metricBefore: '18% Win-Rate',
    metricAfter: '36% Win-Rate против ключевого конкурента',
    actionHow:
      'разработки Sales Enablement боевых карточек (Battlecards) и фокусировки на ICP-сегменте с чеком от $25k',
    businessImpact: 'увеличении среднего чека сделки (ACV) на 42% и росте пайплайна на $2.1M',
  },
  {
    discipline: 'Leadership',
    actionVerb:
      'Сформировал инхаус команду маркетинга из 6 специалистов и защитил бюджет по модели 70/20/10',
    metricBefore: 'комиссий агентств $110k/год',
    metricAfter: '0% внешней зависимости',
    actionHow:
      'инсорсинга медиабаинга, креативного продакшна и внедрения сквозной P&L отчетности для Совета директоров',
    businessImpact:
      'ускорении цикла тестирования гипотез в 4 раза при соблюдении планового коридора затрат с точностью 94%',
  },
];

export const ResumeBulletGenerator = (): React.JSX.Element => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>(PRESETS[0].discipline);
  const [actionVerb, setActionVerb] = useState(PRESETS[0].actionVerb);
  const [metricBefore, setMetricBefore] = useState(PRESETS[0].metricBefore);
  const [metricAfter, setMetricAfter] = useState(PRESETS[0].metricAfter);
  const [actionHow, setActionHow] = useState(PRESETS[0].actionHow);
  const [businessImpact, setBusinessImpact] = useState(PRESETS[0].businessImpact);
  const [copied, setCopied] = useState(false);

  const applyPreset = (preset: BulletPreset) => {
    setSelectedDiscipline(preset.discipline);
    setActionVerb(preset.actionVerb);
    setMetricBefore(preset.metricBefore);
    setMetricAfter(preset.metricAfter);
    setActionHow(preset.actionHow);
    setBusinessImpact(preset.businessImpact);
  };

  const bullet = `${actionVerb} с ${metricBefore} до ${metricAfter} за счет ${actionHow}, что привело к ${businessImpact}.`;

  const copyBullet = async () => {
    try {
      await navigator.clipboard.writeText(bullet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col gap-4 pb-5 border-b border-zinc-800/70">
        <div>
          <h4 className="text-base font-semibold text-white">
            Конструктор буллетов резюме (Google XYZ)
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Соберите сильную формулировку с измеримым эффектом для P&amp;L.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {PRESETS.map((p) => (
            <button
              key={p.discipline}
              type="button"
              onClick={() => applyPreset(p)}
              className={`px-2.5 py-1 rounded-md border text-xs transition-colors ${
                selectedDiscipline === p.discipline
                  ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-medium'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {p.discipline}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="res-verb" className="text-[11px] text-zinc-400 block mb-1">
              Действие (X)
            </label>
            <input
              id="res-verb"
              type="text"
              value={actionVerb}
              onChange={(e) => setActionVerb(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500 text-xs"
            />
          </div>
          <div>
            <label htmlFor="res-before" className="text-[11px] text-zinc-400 block mb-1">
              Метрика до
            </label>
            <input
              id="res-before"
              type="text"
              value={metricBefore}
              onChange={(e) => setMetricBefore(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500 font-mono text-xs"
            />
          </div>
          <div>
            <label htmlFor="res-after" className="text-[11px] text-zinc-400 block mb-1">
              Метрика после (Y)
            </label>
            <input
              id="res-after"
              type="text"
              value={metricAfter}
              onChange={(e) => setMetricAfter(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500 font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label htmlFor="res-how" className="text-[11px] text-zinc-400 block mb-1">
            Метод и инструменты (Z)
          </label>
          <input
            id="res-how"
            type="text"
            value={actionHow}
            onChange={(e) => setActionHow(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500 text-xs"
          />
        </div>

        <div>
          <label htmlFor="res-impact" className="text-[11px] text-zinc-400 block mb-1">
            Бизнес-результат
          </label>
          <input
            id="res-impact"
            type="text"
            value={businessImpact}
            onChange={(e) => setBusinessImpact(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-500 text-xs"
          />
        </div>

        <div className="pt-5 border-t border-zinc-800/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400">Готовая формулировка</span>
            <button
              onClick={copyBullet}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-zinc-200 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Копировать</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-zinc-100 leading-relaxed">{bullet}</p>
        </div>
      </div>
    </div>
  );
};
