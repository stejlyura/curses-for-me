'use client';

import { useState, useMemo } from 'react';

interface AffiliateScenarioState {
  modelType: 'CPA' | 'RevShare' | 'Hybrid';
  monthlyConversions: number;
  cpaPayout: number;
  revSharePercent: number;
  userLtv: number;
  fraudRate: number;
  refundRate: number;
  trackingCostPerEvent: number;
}

const PRESETS: Record<string, AffiliateScenarioState> = {
  fintechCPA: {
    modelType: 'CPA',
    monthlyConversions: 1500,
    cpaPayout: 90,
    revSharePercent: 0,
    userLtv: 210,
    fraudRate: 6.0,
    refundRate: 3.5,
    trackingCostPerEvent: 0.15,
  },
  igamingHybrid: {
    modelType: 'Hybrid',
    monthlyConversions: 2200,
    cpaPayout: 45,
    revSharePercent: 25,
    userLtv: 160,
    fraudRate: 8.0,
    refundRate: 4.0,
    trackingCostPerEvent: 0.12,
  },
  saasRevShare: {
    modelType: 'RevShare',
    monthlyConversions: 800,
    cpaPayout: 0,
    revSharePercent: 30,
    userLtv: 450,
    fraudRate: 2.0,
    refundRate: 2.5,
    trackingCostPerEvent: 0.2,
  },
};

export const AffiliatePnLSimulator = (): React.JSX.Element => {
  const [params, setParams] = useState<AffiliateScenarioState>(PRESETS.fintechCPA);

  const calculations = useMemo(() => {
    const rawConversions = params.monthlyConversions;
    const fraudConversions = Math.round(rawConversions * (params.fraudRate / 100));
    const validConversions = Math.max(0, rawConversions - fraudConversions);

    const grossRevenue = validConversions * params.userLtv;
    const refundsAmount = grossRevenue * (params.refundRate / 100);
    const netRevenue = grossRevenue - refundsAmount;

    let affiliatePayout = 0;
    if (params.modelType === 'CPA') {
      affiliatePayout = validConversions * params.cpaPayout;
    } else if (params.modelType === 'RevShare') {
      affiliatePayout = netRevenue * (params.revSharePercent / 100);
    } else if (params.modelType === 'Hybrid') {
      affiliatePayout =
        validConversions * params.cpaPayout + netRevenue * (params.revSharePercent / 100);
    }

    const platformFees = rawConversions * params.trackingCostPerEvent;
    const totalAffiliateCost = affiliatePayout + platformFees;
    const netProfit = netRevenue - totalAffiliateCost;
    const marginPercent = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;
    const effectiveCpa = validConversions > 0 ? totalAffiliateCost / validConversions : 0;
    const isProfitable = netProfit > 0;

    return {
      rawConversions,
      fraudConversions,
      validConversions,
      grossRevenue: Math.round(grossRevenue),
      refundsAmount: Math.round(refundsAmount),
      netRevenue: Math.round(netRevenue),
      affiliatePayout: Math.round(affiliatePayout),
      platformFees: Math.round(platformFees),
      totalAffiliateCost: Math.round(totalAffiliateCost),
      netProfit: Math.round(netProfit),
      marginPercent: Number(marginPercent.toFixed(1)),
      effectiveCpa: Number(effectiveCpa.toFixed(2)),
      isProfitable,
    };
  }, [params]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/70">
        <div>
          <h4 className="text-base font-semibold text-white">
            Симулятор P&amp;L партнерской программы
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Моделирование выплат CPA / RevShare / Hybrid с учетом фрода, возвратов и маржи.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setParams(PRESETS.fintechCPA)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.fintechCPA
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            FinTech CPA
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.igamingHybrid)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.igamingHybrid
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            iGaming Hybrid
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.saasRevShare)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.saasRevShare
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            SaaS RevShare
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs text-zinc-300 font-medium block">Модель выплат</span>
            <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              {(['CPA', 'RevShare', 'Hybrid'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setParams({ ...params, modelType: m })}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                    params.modelType === m
                      ? 'bg-zinc-100 text-zinc-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="aff-conv" className="text-zinc-300 font-medium">
                Конверсии в месяц (FTD / Sales)
              </label>
              <span className="font-mono text-white tabular-nums">
                {params.monthlyConversions.toLocaleString()}
              </span>
            </div>
            <input
              id="aff-conv"
              type="range"
              min="100"
              max="10000"
              step="50"
              value={params.monthlyConversions}
              onChange={(e) =>
                setParams({ ...params, monthlyConversions: Number(e.target.value) })
              }
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(params.modelType === 'CPA' || params.modelType === 'Hybrid') && (
              <div className="space-y-1">
                <label htmlFor="aff-cpa" className="text-[11px] text-zinc-400 block">
                  CPA ставка ($)
                </label>
                <input
                  id="aff-cpa"
                  type="number"
                  step="5"
                  min="0"
                  value={params.cpaPayout}
                  onChange={(e) => setParams({ ...params, cpaPayout: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            )}
            {(params.modelType === 'RevShare' || params.modelType === 'Hybrid') && (
              <div className="space-y-1">
                <label htmlFor="aff-rs" className="text-[11px] text-zinc-400 block">
                  RevShare (%)
                </label>
                <input
                  id="aff-rs"
                  type="number"
                  step="1"
                  min="1"
                  max="70"
                  value={params.revSharePercent}
                  onChange={(e) =>
                    setParams({ ...params, revSharePercent: Number(e.target.value) })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="aff-ltv" className="text-[11px] text-zinc-400 block">
                Средний LTV ($)
              </label>
              <input
                id="aff-ltv"
                type="number"
                step="10"
                min="10"
                value={params.userLtv}
                onChange={(e) => setParams({ ...params, userLtv: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="aff-fraud" className="text-[11px] text-zinc-400 block">
                Фрод / Срез (%)
              </label>
              <input
                id="aff-fraud"
                type="number"
                step="0.5"
                min="0"
                max="40"
                value={params.fraudRate}
                onChange={(e) => setParams({ ...params, fraudRate: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="aff-refund" className="text-[11px] text-zinc-400 block">
                Возвраты / Чарджбеки (%)
              </label>
              <input
                id="aff-refund"
                type="number"
                step="0.5"
                min="0"
                max="20"
                value={params.refundRate}
                onChange={(e) => setParams({ ...params, refundRate: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="aff-track" className="text-[11px] text-zinc-400 block">
                Трекер на конверсию ($)
              </label>
              <input
                id="aff-track"
                type="number"
                step="0.05"
                min="0"
                value={params.trackingCostPerEvent}
                onChange={(e) =>
                  setParams({ ...params, trackingCostPerEvent: Number(e.target.value) })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 lg:border-l lg:border-zinc-800/70 lg:pl-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-zinc-800/70">
            <div>
              <span className="text-xs text-zinc-400 block">Чистая прибыль рекламодателя</span>
              <div
                className={`text-3xl font-bold font-mono tabular-nums mt-1 ${
                  calculations.isProfitable ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {calculations.isProfitable ? '+' : ''}${calculations.netProfit.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-mono tabular-nums">
                Рентабельность: {calculations.marginPercent}%
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-zinc-400 block">Эффективный CPA</span>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                ${calculations.effectiveCpa}
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-mono tabular-nums">
                Срез фрода: -{calculations.fraudConversions} ({params.fraudRate}%)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <div className="text-xs text-zinc-400">Валидные лиды</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                {calculations.validConversions.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                из {calculations.rawConversions.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">Чистая выручка</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                ${calculations.netRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                Возвраты: -${calculations.refundsAmount.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">Выплаты вебам</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                ${calculations.affiliatePayout.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500">{params.modelType}</div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">Инфраструктура</div>
              <div className="text-lg font-semibold font-mono text-zinc-300 mt-0.5 tabular-nums">
                ${calculations.platformFees.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500">Трекер / TDS</div>
            </div>
          </div>

          <p className="pt-4 border-t border-zinc-800/70 text-xs text-zinc-400 leading-relaxed">
            Ориентир безопасности: при модели {params.modelType} ставка аффилиату не должна превышать{' '}
            <span className="font-mono text-zinc-200">${(params.userLtv * 0.45).toFixed(0)}</span>{' '}
            (45% от когортного LTV), чтобы сохранить буфер ликвидности при росте чарджбеков.
          </p>
        </div>
      </div>
    </div>
  );
};
