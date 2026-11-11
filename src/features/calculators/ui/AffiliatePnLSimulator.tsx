'use client';

import { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  ShieldAlert,
  Percent,
  Layers,
  Award
} from 'lucide-react';

interface AffiliateScenarioState {
  modelType: 'CPA' | 'RevShare' | 'Hybrid';
  monthlyConversions: number; // FTD / Sales count
  cpaPayout: number; // $
  revSharePercent: number; // %
  userLtv: number; // $
  fraudRate: number; // % of fake / low quality traffic
  refundRate: number; // % of chargebacks
  trackingCostPerEvent: number; // $ TDS / platform fee
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
    trackingCostPerEvent: 0.20,
  },
};

export const AffiliatePnLSimulator = (): React.JSX.Element => {
  const [params, setParams] = useState<AffiliateScenarioState>(PRESETS.fintechCPA);

  const calculations = useMemo(() => {
    const rawConversions = params.monthlyConversions;
    const fraudConversions = Math.round(rawConversions * (params.fraudRate / 100));
    const validConversions = Math.max(0, rawConversions - fraudConversions);
    
    // Revenue calculations based on valid users
    const grossRevenue = validConversions * params.userLtv;
    const refundsAmount = grossRevenue * (params.refundRate / 100);
    const netRevenue = grossRevenue - refundsAmount;

    // Affiliate Payouts based on model
    let affiliatePayout = 0;
    if (params.modelType === 'CPA') {
      // Advertisers typically scrub proven fraud, paying only valid
      affiliatePayout = validConversions * params.cpaPayout;
    } else if (params.modelType === 'RevShare') {
      affiliatePayout = netRevenue * (params.revSharePercent / 100);
    } else if (params.modelType === 'Hybrid') {
      affiliatePayout = (validConversions * params.cpaPayout) + (netRevenue * (params.revSharePercent / 100));
    }

    const platformFees = rawConversions * params.trackingCostPerEvent;
    const totalAffiliateCost = affiliatePayout + platformFees;
    const netProfit = netRevenue - totalAffiliateCost;
    const marginPercent = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;
    const effectiveCpa = validConversions > 0 ? totalAffiliateCost / validConversions : 0;
    const epcEst = rawConversions > 0 ? (netProfit / (rawConversions * 20)) : 0; // assuming 5% CR from click
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
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Affiliate Program Financial P&L Simulator
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Симулятор доходности партнерской программы (CPA / RevShare / Hybrid)
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Моделирование комиссионных моделей, защита от фрода (Scrubbing Rate), учет возвратов и расчет чистой маржи рекламодателя.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setParams(PRESETS.fintechCPA)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.fintechCPA
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            FinTech CPA
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.igamingHybrid)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.igamingHybrid
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            iGaming Hybrid
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.saasRevShare)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.saasRevShare
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            SaaS RevShare
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-300 font-medium">Модель выплат аффилиатам</label>
            <div className="grid grid-cols-3 gap-2">
              {(['CPA', 'RevShare', 'Hybrid'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setParams({ ...params, modelType: m })}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    params.modelType === m
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Объем конверсий (FTD / Sales в мес)</span>
              <span className="font-mono text-amber-400">{params.monthlyConversions.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="50"
              value={params.monthlyConversions}
              onChange={(e) => setParams({ ...params, monthlyConversions: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(params.modelType === 'CPA' || params.modelType === 'Hybrid') && (
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">CPA ставка вебу ($)</label>
                <input
                  type="number"
                  step="5"
                  min="0"
                  value={params.cpaPayout}
                  onChange={(e) => setParams({ ...params, cpaPayout: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
            {(params.modelType === 'RevShare' || params.modelType === 'Hybrid') && (
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">RevShare комиссия (%)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="70"
                  value={params.revSharePercent}
                  onChange={(e) => setParams({ ...params, revSharePercent: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Средний LTV пользователя ($)</label>
              <input
                type="number"
                step="10"
                min="10"
                value={params.userLtv}
                onChange={(e) => setParams({ ...params, userLtv: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Уровень фрода (Scrub %, срезы)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="40"
                value={params.fraudRate}
                onChange={(e) => setParams({ ...params, fraudRate: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Возвраты / Чарджбеки (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="20"
                value={params.refundRate}
                onChange={(e) => setParams({ ...params, refundRate: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">TDS/Трекер расход на клик ($)</label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={params.trackingCostPerEvent}
                onChange={(e) => setParams({ ...params, trackingCostPerEvent: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Profit Card */}
          <div
            className={`rounded-2xl p-5 border transition-all ${
              calculations.isProfitable
                ? 'bg-amber-950/30 border-amber-800/60'
                : 'bg-rose-950/30 border-rose-800/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">
                  Чистая прибыль рекламодателя (Net Profit)
                </span>
                <div
                  className={`text-3xl font-extrabold font-mono mt-1 ${
                    calculations.isProfitable ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {calculations.isProfitable ? '+' : ''}${calculations.netProfit.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-300 mt-1">
                  Рентабельность партнерской программы:{' '}
                  <span className="font-mono font-bold text-amber-300">
                    {calculations.marginPercent}%
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-xs text-zinc-400">Эффективный CPA (Total Cost / Valid):</div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  ${calculations.effectiveCpa}
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Срез фрода:{' '}
                  <span className="text-rose-400 font-mono">
                    -{calculations.fraudConversions} шт
                  </span>{' '}
                  ({params.fraudRate}%)
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">Валидные лиды</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {calculations.validConversions.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Из {calculations.rawConversions.toLocaleString()}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">Чистая выручка</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                ${calculations.netRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Возвраты: -${calculations.refundsAmount.toLocaleString()}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">Выплаты вебам</div>
              <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                ${calculations.affiliatePayout.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                По модели {params.modelType}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">TDS / Инфраструктура</div>
              <div className="text-lg font-bold font-mono text-zinc-300 mt-0.5">
                ${calculations.platformFees.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Серверные расходы
              </div>
            </div>
          </div>

          {/* Head of Affiliates Takeaway Alert */}
          <div className="rounded-xl bg-zinc-900/40 border border-zinc-800 p-3.5 text-xs text-zinc-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Head of Affiliates Rule:</span>
              При модели {params.modelType} максимальная безопасная ставка аффилиату не должна превышать{' '}
              <span className="font-mono text-amber-300">
                ${(params.userLtv * 0.45).toFixed(0)}
              </span>{' '}
              (45% от когортного LTV). Превышение этого порога лишает рекламодателя подушки ликвидности при всплеске чарджбеков и задержках выплат платежных шлюзов.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

