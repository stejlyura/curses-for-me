'use client';

import { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  BarChart3,
  Percent,
  RefreshCw,
  Flame
} from 'lucide-react';

interface SimulationState {
  monthlyBudget: number;
  cpm: number;
  ctr: number;
  cr1: number; // Click to Lead / Add to Cart
  cr2: number; // Lead to Customer / Purchase
  aov: number; // Average Order Value
  grossMargin: number; // %
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
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5" />
            Performance Traffic Unit Economics Engine
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Симулятор окупаемости медиабаинга и ROAS
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Сквозной расчет аукционной воронки от CPM до чистой прибыли с учетом валовой маржи и Break-Even ROAS.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setParams(PRESETS.ecommerce)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.ecommerce
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            E-commerce
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.saasTrial)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.saasTrial
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            B2B SaaS
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.leadGen)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.leadGen
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Lead Gen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Input Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Месячный рекламный бюджет</span>
              <span className="font-mono text-emerald-400">${params.monthlyBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={params.monthlyBudget}
              onChange={(e) => setParams({ ...params, monthlyBudget: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">eCPM (Цена 1000 показов, $)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={params.cpm}
                onChange={(e) => setParams({ ...params, cpm: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">CTR креатива (%)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="20"
                value={params.ctr}
                onChange={(e) => setParams({ ...params, ctr: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">CR1 (Клик &rarr; Лид / Корзина, %)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={params.cr1}
                onChange={(e) => setParams({ ...params, cr1: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">CR2 (Лид &rarr; Оплата, %)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                value={params.cr2}
                onChange={(e) => setParams({ ...params, cr2: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Средний чек / AOV ($)</label>
              <input
                type="number"
                step="5"
                min="5"
                value={params.aov}
                onChange={(e) => setParams({ ...params, aov: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Gross Margin (Валовая маржа, %)</label>
              <input
                type="number"
                step="1"
                min="5"
                max="100"
                value={params.grossMargin}
                onChange={(e) => setParams({ ...params, grossMargin: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Calculated Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Status KPI Banner */}
          <div
            className={`rounded-2xl p-5 border transition-all ${
              calculations.isProfitable
                ? 'bg-emerald-950/30 border-emerald-800/60'
                : 'bg-rose-950/30 border-rose-800/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">
                  Финансовый результат кампании
                </span>
                <div
                  className={`text-3xl font-extrabold font-mono mt-1 ${
                    calculations.isProfitable ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {calculations.isProfitable ? '+' : ''}${calculations.netProfit.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-300 mt-1">
                  ROMI: <span className="font-mono font-bold">{calculations.romi}%</span> (Чистая прибыль к расходу)
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-xs text-zinc-400">Факт ROAS vs Точка безубыточности:</div>
                <div className="flex items-center sm:justify-end gap-2 mt-1">
                  <span
                    className={`text-2xl font-black font-mono ${
                      calculations.roas >= calculations.breakEvenRoas
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {calculations.roas}x
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    / BE: {calculations.breakEvenRoas}x
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  {calculations.roas >= calculations.breakEvenRoas ? (
                    <span className="text-emerald-400 flex items-center gap-1 sm:justify-end">
                      <CheckCircle2 className="w-3 h-3" /> Выше порога безубыточности
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 sm:justify-end">
                      <AlertTriangle className="w-3 h-3" /> Слив бюджета ниже Break-Even
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">CPC (Клик)</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                ${calculations.cpc}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                {calculations.clicks.toLocaleString()} кликов
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">CPL (Лид)</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                ${calculations.costPerLead}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                {calculations.leads.toLocaleString()} лидов
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">CPA (Покупка)</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                ${calculations.cpa}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                {calculations.customers.toLocaleString()} продаж
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">Выручка (Gross)</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                ${calculations.revenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Маржа: ${calculations.grossProfit.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Senior Takeaway Alert */}
          <div className="rounded-xl bg-zinc-900/40 border border-zinc-800 p-3.5 text-xs text-zinc-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Senior Media Buyer Rule:</span>
              При марже <span className="font-mono text-emerald-300">{params.grossMargin}%</span> минимальный окупаемый ROAS равен <span className="font-mono text-emerald-300">{calculations.breakEvenRoas}x</span>. Любая кампания с ROAS ниже этого порога генерирует кассовый убыток, даже если рекламный кабинет показывает зеленый ROAS.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

