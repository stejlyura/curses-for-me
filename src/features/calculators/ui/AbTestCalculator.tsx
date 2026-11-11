'use client';

import { useState, useMemo } from 'react';
import { Percent, CheckCircle2, AlertCircle, BarChart2, Calculator } from 'lucide-react';

export const AbTestCalculator = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<'significance' | 'sampleSize'>('significance');

  // Significance test state
  const [visitorsA, setVisitorsA] = useState(10000);
  const [conversionsA, setConversionsA] = useState(300);
  const [visitorsB, setVisitorsB] = useState(10000);
  const [conversionsB, setConversionsB] = useState(360);

  // MDE / Sample size planner state
  const [baselineCr, setBaselineCr] = useState(3.0); // %
  const [targetMde, setTargetMde] = useState(15.0); // % relative uplift
  const [dailyTraffic, setDailyTraffic] = useState(2000); // total visitors/day
  const [statisticalPower, setStatisticalPower] = useState<80 | 90>(80);

  const results = useMemo(() => {
    const rateA = visitorsA > 0 ? conversionsA / visitorsA : 0;
    const rateB = visitorsB > 0 ? conversionsB / visitorsB : 0;
    const uplift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;

    // Pooled proportion
    const totalConversions = conversionsA + conversionsB;
    const totalVisitors = visitorsA + visitorsB;
    const pooledP = totalVisitors > 0 ? totalConversions / totalVisitors : 0;

    // Standard Error
    const se = Math.sqrt(
      pooledP * (1 - pooledP) * (1 / Math.max(1, visitorsA) + 1 / Math.max(1, visitorsB))
    );

    const zScore = se > 0 ? (rateB - rateA) / se : 0;

    // Approximate normal CDF
    const standardNormalCdf = (z: number): number => {
      const t = 1 / (1 + 0.2316419 * Math.abs(z));
      const d = 0.3989423 * Math.exp((-z * z) / 2);
      const prob =
        d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      return z > 0 ? 1 - prob : prob;
    };

    const pValue = 2 * (1 - standardNormalCdf(Math.abs(zScore)));
    const confidence = Math.max(0, Math.min(100, (1 - pValue) * 100));
    const isSignificant = pValue < 0.05;

    return {
      rateA: (rateA * 100).toFixed(2),
      rateB: (rateB * 100).toFixed(2),
      uplift: uplift.toFixed(1),
      pValue: pValue.toFixed(4),
      confidence: confidence.toFixed(1),
      isSignificant,
    };
  }, [visitorsA, conversionsA, visitorsB, conversionsB]);

  // Sample size & MDE calculation (Evan Miller formula approximation)
  const samplePlan = useMemo(() => {
    const p = Math.max(0.0001, Math.min(0.9999, baselineCr / 100));
    const relativeMde = Math.max(0.01, targetMde / 100);
    const delta = p * relativeMde;

    // Z-scores: alpha=0.05 two-sided -> 1.96
    // beta=0.20 (80% power) -> 0.842, beta=0.10 (90% power) -> 1.282
    const zAlpha = 1.96;
    const zBeta = statisticalPower === 90 ? 1.282 : 0.842;
    const factor = Math.pow(zAlpha + zBeta, 2); // 7.84 for 80%, 10.51 for 90%

    // Sample size per variant: n = 2 * factor * p * (1 - p) / delta^2
    const nPerVariant = Math.ceil((2 * factor * p * (1 - p)) / Math.pow(delta, 2));
    const totalSample = nPerVariant * 2;
    const daysNeeded = dailyTraffic > 0 ? Math.ceil(totalSample / dailyTraffic) : 0;

    return {
      nPerVariant,
      totalSample,
      daysNeeded,
      expectedVariantCr: (p * (1 + relativeMde) * 100).toFixed(2),
    };
  }, [baselineCr, targetMde, dailyTraffic, statisticalPower]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Калькулятор достоверности и MDE A/B тестов</h3>
            <p className="text-xs text-zinc-400">
              Расчет Z-score, p-value, минимального эффекта (MDE) и размера выборки (80% power).
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('significance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'significance'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Проверка статзначимости
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sampleSize')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'sampleSize'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Планирование выборки / MDE
          </button>
        </div>
      </div>

      {activeTab === 'significance' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variant A Inputs */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
              <span className="text-xs font-bold text-brand-300 block">Вариант A (Контроль)</span>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Посетители (Визиты):</label>
                <input
                  type="number"
                  value={visitorsA}
                  onChange={(e) => setVisitorsA(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Конверсии (Целевые действия):</label>
                <input
                  type="number"
                  value={conversionsA}
                  onChange={(e) => setConversionsA(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="pt-2 text-xs text-zinc-400">
                Конверсия: <span className="text-white font-bold font-mono">{results.rateA}%</span>
              </div>
            </div>

            {/* Variant B Inputs */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-3">
              <span className="text-xs font-bold text-emerald-400 block">Вариант B (Тест)</span>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Посетители (Визиты):</label>
                <input
                  type="number"
                  value={visitorsB}
                  onChange={(e) => setVisitorsB(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Конверсии (Целевые действия):</label>
                <input
                  type="number"
                  value={conversionsB}
                  onChange={(e) => setConversionsB(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="pt-2 text-xs text-zinc-400">
                Конверсия: <span className="text-white font-bold font-mono">{results.rateB}%</span>
              </div>
            </div>
          </div>

          {/* Decision Output */}
          <div className="mt-6 p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[11px] text-zinc-400 block">Прирост (Uplift)</span>
                <span className={`text-lg font-bold font-mono ${
                  Number(results.uplift) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {Number(results.uplift) > 0 ? `+${results.uplift}%` : `${results.uplift}%`}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">p-value</span>
                <span className="text-lg font-bold font-mono text-zinc-200">{results.pValue}</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Достоверность</span>
                <span className="text-lg font-bold font-mono text-zinc-200">{results.confidence}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {results.isSignificant ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  Победа статистически значима (p &lt; 0.05)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400">
                  <AlertCircle className="w-4 h-4" />
                  Статистически незначимо (Случайный шум)
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        /* MDE & Sample Size Planner */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
              <label className="text-[11px] font-semibold text-zinc-300 block">
                Базовая конверсия (%):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={baselineCr}
                onChange={(e) => setBaselineCr(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-zinc-400 block">Текущий baseline лендинга/воронки</span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
              <label className="text-[11px] font-semibold text-zinc-300 block">
                Желаемый MDE (% относительный):
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="100"
                value={targetMde}
                onChange={(e) => setTargetMde(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-zinc-400 block">
                Ожидаемый CR варианта: <strong className="text-white">{samplePlan.expectedVariantCr}%</strong>
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
              <label className="text-[11px] font-semibold text-zinc-300 block">
                Дневной трафик (посетителей/день):
              </label>
              <input
                type="number"
                step="500"
                min="100"
                max="500000"
                value={dailyTraffic}
                onChange={(e) => setDailyTraffic(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-zinc-400 block">Общий поток на тест (A + B)</span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
              <label className="text-[11px] font-semibold text-zinc-300 block">
                Статистическая мощность (Power):
              </label>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStatisticalPower(80)}
                  className={`flex-1 py-1 text-xs rounded-lg border font-mono ${
                    statisticalPower === 80
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  80% (Стандарт)
                </button>
                <button
                  type="button"
                  onClick={() => setStatisticalPower(90)}
                  className={`flex-1 py-1 text-xs rounded-lg border font-mono ${
                    statisticalPower === 90
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  90% (Строгий)
                </button>
              </div>
              <span className="text-[10px] text-zinc-400 block">Вероятность зафиксировать реальный эффект</span>
            </div>
          </div>

          {/* Sample Size Results Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80">
              <span className="text-[11px] text-zinc-400 block">Выборка на каждый вариант (n):</span>
              <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
                {samplePlan.nPerVariant.toLocaleString()} чел
              </span>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Для достоверного обнаружения +{targetMde}% прироста
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80">
              <span className="text-[11px] text-zinc-400 block">Суммарный объем выборки (A + B):</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {samplePlan.totalSample.toLocaleString()} чел
              </span>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Минимум до остановки теста (исключение peeking problem)
              </span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80">
              <span className="text-[11px] text-zinc-400 block">Расчетная длительность эксперимента:</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                {samplePlan.daysNeeded} дней
              </span>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                {samplePlan.daysNeeded > 45 ? '⚠️ Слишком долгий тест (риск эффекта новизны)' : 'Рекомендуется минимум 2 полных бизнес-недели (14 дней)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
