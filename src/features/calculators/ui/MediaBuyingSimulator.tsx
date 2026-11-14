'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SimulationState {
  monthlyBudget: number;
  cpm: number;
  ctr: number;
  cr1: number;
  cr2: number;
  aov: number;
  grossMargin: number;
}

const PRESETS: Record<string, SimulationState> = {
  ecommerce: {
    monthlyBudget: 25000,
    cpm: 18.5,
    ctr: 1.8,
    cr1: 8.5,
    cr2: 24.0,
    aov: 85,
    grossMargin: 65,
  },
  saasTrial: {
    monthlyBudget: 40000,
    cpm: 32.0,
    ctr: 2.4,
    cr1: 12.0,
    cr2: 15.0,
    aov: 240,
    grossMargin: 82,
  },
  leadGen: {
    monthlyBudget: 15000,
    cpm: 24.0,
    ctr: 1.5,
    cr1: 14.0,
    cr2: 8.0,
    aov: 650,
    grossMargin: 55,
  },
};

export const MediaBuyingSimulator = (): React.JSX.Element => {
  const [params, setParams] = useState<SimulationState>(PRESETS.ecommerce);

  const calculations = useMemo(() => {
    const impressions = (params.monthlyBudget / Math.max(0.1, params.cpm)) * 1000;
    const clicks = impressions * (params.ctr / 100);
    const cpc = clicks > 0 ? params.monthlyBudget / clicks : 0;
    const leads = clicks * (params.cr1 / 100);
    const costPerLead = leads > 0 ? params.monthlyBudget / leads : 0;
    const customers = leads * (params.cr2 / 100);
    const cpa = customers > 0 ? params.monthlyBudget / customers : 0;
    const revenue = customers * params.aov;
    const grossProfit = revenue * (params.grossMargin / 100);
    const roas = params.monthlyBudget > 0 ? revenue / params.monthlyBudget : 0;
    const breakEvenRoas = params.grossMargin > 0 ? 100 / params.grossMargin : 0;
    const netProfit = grossProfit - params.monthlyBudget;
    const romi = params.monthlyBudget > 0 ? (netProfit / params.monthlyBudget) * 100 : 0;
    const isProfitable = netProfit > 0;

    return {
      impressions: Math.round(impressions),
      clicks: Math.round(clicks),
      cpc: Number(cpc.toFixed(2)),
      leads: Math.round(leads),
      costPerLead: Number(costPerLead.toFixed(2)),
      customers: Math.round(customers),
      cpa: Number(cpa.toFixed(2)),
      revenue: Math.round(revenue),
      grossProfit: Math.round(grossProfit),
      roas: Number(roas.toFixed(2)),
      breakEvenRoas: Number(breakEvenRoas.toFixed(2)),
      netProfit: Math.round(netProfit),
      romi: Number(romi.toFixed(1)),
      isProfitable,
    };
  }, [params]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/70">
        <div>
          <h4 className="text-base font-semibold text-white">
            Симулятор окупаемости медиабаинга и ROAS
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Сквозной расчет воронки от CPM до чистой прибыли и Break-Even ROAS.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setParams(PRESETS.ecommerce)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.ecommerce
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            E-commerce
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.saasTrial)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.saasTrial
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            B2B SaaS
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.leadGen)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.leadGen
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Lead Gen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="mb-budget" className="text-zinc-300 font-medium">
                Месячный бюджет
              </label>
              <span className="font-mono text-white tabular-nums">
                ${params.monthlyBudget.toLocaleString()}
              </span>
            </div>
            <input
              id="mb-budget"
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={params.monthlyBudget}
              onChange={(e) => setParams({ ...params, monthlyBudget: Number(e.target.value) })}
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="mb-cpm" className="text-[11px] text-zinc-400 block">
                eCPM ($)
              </label>
              <input
                id="mb-cpm"
                type="number"
                step="0.5"
                min="1"
                value={params.cpm}
                onChange={(e) => setParams({ ...params, cpm: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mb-ctr" className="text-[11px] text-zinc-400 block">
                CTR (%)
              </label>
              <input
                id="mb-ctr"
                type="number"
                step="0.1"
                min="0.1"
                max="20"
                value={params.ctr}
                onChange={(e) => setParams({ ...params, ctr: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="mb-cr1" className="text-[11px] text-zinc-400 block">
                CR1 (Клик &rarr; Лид, %)
              </label>
              <input
                id="mb-cr1"
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={params.cr1}
                onChange={(e) => setParams({ ...params, cr1: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mb-cr2" className="text-[11px] text-zinc-400 block">
                CR2 (Лид &rarr; Покупка, %)
              </label>
              <input
                id="mb-cr2"
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                value={params.cr2}
                onChange={(e) => setParams({ ...params, cr2: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="mb-aov" className="text-[11px] text-zinc-400 block">
                Средний чек / AOV ($)
              </label>
              <input
                id="mb-aov"
                type="number"
                step="5"
                min="5"
                value={params.aov}
                onChange={(e) => setParams({ ...params, aov: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mb-margin" className="text-[11px] text-zinc-400 block">
                Валовая маржа (%)
              </label>
              <input
                id="mb-margin"
                type="number"
                step="1"
                min="5"
                max="100"
                value={params.grossMargin}
                onChange={(e) => setParams({ ...params, grossMargin: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 lg:border-l lg:border-zinc-800/70 lg:pl-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-zinc-800/70">
            <div>
              <span className="text-xs text-zinc-400 block">Чистая прибыль</span>
              <div
                className={`text-3xl font-bold font-mono tabular-nums mt-1 ${
                  calculations.isProfitable ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {calculations.isProfitable ? '+' : ''}${calculations.netProfit.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-mono tabular-nums">
                ROMI: {calculations.romi}%
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-zinc-400 block">Факт ROAS / Break-Even</span>
              <div className="flex items-baseline sm:justify-end gap-2 mt-1 font-mono tabular-nums">
                <span
                  className={`text-2xl font-bold ${
                    calculations.roas >= calculations.breakEvenRoas
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {calculations.roas}x
                </span>
                <span className="text-xs text-zinc-500">/ {calculations.breakEvenRoas}x</span>
              </div>
              <div className="text-xs mt-1">
                {calculations.roas >= calculations.breakEvenRoas ? (
                  <span className="text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Выше порога безубыточности
                  </span>
                ) : (
                  <span className="text-rose-400 inline-flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Ниже Break-Even
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <div className="text-xs text-zinc-400">CPC</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                ${calculations.cpc}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                {calculations.clicks.toLocaleString()} кликов
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">CPL</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                ${calculations.costPerLead}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                {calculations.leads.toLocaleString()} лидов
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">CPA</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                ${calculations.cpa}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                {calculations.customers.toLocaleString()} продаж
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">Выручка</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                ${calculations.revenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                Маржа: ${calculations.grossProfit.toLocaleString()}
              </div>
            </div>
          </div>

          <p className="pt-4 border-t border-zinc-800/70 text-xs text-zinc-400 leading-relaxed">
            При марже <span className="font-mono text-zinc-200">{params.grossMargin}%</span> минимальный окупаемый ROAS равен{' '}
            <span className="font-mono text-zinc-200">{calculations.breakEvenRoas}x</span>. Кампании ниже этого порога генерируют кассовый убыток.
          </p>
        </div>
      </div>
    </div>
  );
};
