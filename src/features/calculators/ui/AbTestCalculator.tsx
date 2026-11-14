'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const AbTestCalculator = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<'significance' | 'sampleSize'>('significance');

  const [visitorsA, setVisitorsA] = useState(10000);
  const [conversionsA, setConversionsA] = useState(300);
  const [visitorsB, setVisitorsB] = useState(10000);
  const [conversionsB, setConversionsB] = useState(360);

  const [baselineCr, setBaselineCr] = useState(3.0);
  const [targetMde, setTargetMde] = useState(15.0);
  const [dailyTraffic, setDailyTraffic] = useState(2000);
  const [statisticalPower, setStatisticalPower] = useState<80 | 90>(80);

  const results = useMemo(() => {
    const rateA = visitorsA > 0 ? conversionsA / visitorsA : 0;
    const rateB = visitorsB > 0 ? conversionsB / visitorsB : 0;
    const uplift = rateA > 0 ? ((rateB - rateA) / rateA) * 100 : 0;

    const totalConversions = conversionsA + conversionsB;
    const totalVisitors = visitorsA + visitorsB;
    const pooledP = totalVisitors > 0 ? totalConversions / totalVisitors : 0;

    const se = Math.sqrt(
      pooledP * (1 - pooledP) * (1 / Math.max(1, visitorsA) + 1 / Math.max(1, visitorsB))
    );

    const zScore = se > 0 ? (rateB - rateA) / se : 0;

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

  const samplePlan = useMemo(() => {
    const p = Math.max(0.0001, Math.min(0.9999, baselineCr / 100));
    const relativeMde = Math.max(0.01, targetMde / 100);
    const delta = p * relativeMde;

    const zAlpha = 1.96;
    const zBeta = statisticalPower === 90 ? 1.282 : 0.842;
    const factor = Math.pow(zAlpha + zBeta, 2);

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
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/70">
        <div>
          <h4 className="text-base font-semibold text-white">Калькулятор A/B тестов и MDE</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Расчет Z-score, p-value, минимального детектируемого эффекта и размера выборки.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-950 p-1 border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('significance')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'significance'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Статзначимость
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sampleSize')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'sampleSize'
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Размер выборки
          </button>
        </div>
      </div>

      {activeTab === 'significance' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-medium text-zinc-300">Вариант A (Контроль)</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ab-va" className="text-[11px] text-zinc-400 block mb-1">
                    Посетители
                  </label>
                  <input
                    id="ab-va"
                    type="number"
                    value={visitorsA}
                    onChange={(e) => setVisitorsA(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label htmlFor="ab-ca" className="text-[11px] text-zinc-400 block mb-1">
                    Конверсии
                  </label>
                  <input
                    id="ab-ca"
                    type="number"
                    value={conversionsA}
                    onChange={(e) => setConversionsA(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
              <div className="text-xs text-zinc-400">
                Конверсия: <span className="text-white font-mono tabular-nums">{results.rateA}%</span>
              </div>
            </div>

            <div className="space-y-3 md:border-l md:border-zinc-800/70 md:pl-6">
              <div className="text-xs font-medium text-zinc-300">Вариант B (Тест)</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ab-vb" className="text-[11px] text-zinc-400 block mb-1">
                    Посетители
                  </label>
                  <input
                    id="ab-vb"
                    type="number"
                    value={visitorsB}
                    onChange={(e) => setVisitorsB(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label htmlFor="ab-cb" className="text-[11px] text-zinc-400 block mb-1">
                    Конверсии
                  </label>
                  <input
                    id="ab-cb"
                    type="number"
                    value={conversionsB}
                    onChange={(e) => setConversionsB(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
              <div className="text-xs text-zinc-400">
                Конверсия: <span className="text-white font-mono tabular-nums">{results.rateB}%</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className="text-xs text-zinc-400 block">Прирост (Uplift)</span>
                <span
                  className={`text-xl font-bold font-mono tabular-nums ${
                    Number(results.uplift) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {Number(results.uplift) > 0 ? `+${results.uplift}%` : `${results.uplift}%`}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">p-value</span>
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {results.pValue}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">Достоверность</span>
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  {results.confidence}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium">
              {results.isSignificant ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Статистически значимо (p &lt; 0.05)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-zinc-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Статистически незначимо
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="ab-base-cr" className="text-xs font-medium text-zinc-300 block">
                Базовая CR (%)
              </label>
              <input
                id="ab-base-cr"
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={baselineCr}
                onChange={(e) => setBaselineCr(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-zinc-500"
              />
              <span className="text-[11px] text-zinc-500 block">Текущий baseline воронки</span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ab-mde" className="text-xs font-medium text-zinc-300 block">
                Целевой MDE (%)
              </label>
              <input
                id="ab-mde"
                type="number"
                step="1"
                min="1"
                max="100"
                value={targetMde}
                onChange={(e) => setTargetMde(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-zinc-500"
              />
              <span className="text-[11px] text-zinc-500 block">
                Ожидаемый CR: <span className="text-zinc-300 font-mono">{samplePlan.expectedVariantCr}%</span>
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ab-traffic" className="text-xs font-medium text-zinc-300 block">
                Трафик в день (A+B)
              </label>
              <input
                id="ab-traffic"
                type="number"
                step="500"
                min="100"
                max="500000"
                value={dailyTraffic}
                onChange={(e) => setDailyTraffic(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono tabular-nums focus:outline-none focus:border-zinc-500"
              />
              <span className="text-[11px] text-zinc-500 block">Общий дневной поток</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium text-zinc-300 block">Мощность (Power)</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatisticalPower(80)}
                  className={`flex-1 py-2 text-xs rounded-lg border font-mono transition-colors ${
                    statisticalPower === 80
                      ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  80%
                </button>
                <button
                  type="button"
                  onClick={() => setStatisticalPower(90)}
                  className={`flex-1 py-2 text-xs rounded-lg border font-mono transition-colors ${
                    statisticalPower === 90
                      ? 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  90%
                </button>
              </div>
              <span className="text-[11px] text-zinc-500 block">Вероятность найти эффект</span>
            </div>
          </div>

          <div className="pt-5 border-t border-zinc-800/70 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-zinc-400 block">Выборка на вариант (n)</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block tabular-nums">
                {samplePlan.nPerVariant.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block">
                Для эффекта +{targetMde}%
              </span>
            </div>

            <div>
              <span className="text-xs text-zinc-400 block">Общая выборка (A + B)</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block tabular-nums">
                {samplePlan.totalSample.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block">
                Минимум до остановки теста
              </span>
            </div>

            <div>
              <span className="text-xs text-zinc-400 block">Длительность теста</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block tabular-nums">
                {samplePlan.daysNeeded} дн.
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block">
                {samplePlan.daysNeeded > 45
                  ? 'Слишком долгий тест: риск эффекта новизны'
                  : 'Рекомендуется минимум 14 дней'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
