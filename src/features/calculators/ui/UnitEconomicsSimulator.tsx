'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';

interface IndustryPreset {
  name: string;
  arpu: number;
  grossMargin: number;
  monthlyChurn: number;
  adSpend: number;
  newCustomers: number;
}

const PRESETS: Record<string, IndustryPreset> = {
  b2b: {
    name: 'B2B SaaS Enterprise',
    arpu: 250,
    grossMargin: 82,
    monthlyChurn: 1.8,
    adSpend: 35000,
    newCustomers: 70,
  },
  mobile: {
    name: 'Mobile Subscription App',
    arpu: 12,
    grossMargin: 70,
    monthlyChurn: 6.5,
    adSpend: 60000,
    newCustomers: 4000,
  },
  ecom: {
    name: 'E-commerce DTC',
    arpu: 65,
    grossMargin: 48,
    monthlyChurn: 9.0,
    adSpend: 45000,
    newCustomers: 1200,
  },
  fintech: {
    name: 'Fintech Neo-Bank',
    arpu: 85,
    grossMargin: 76,
    monthlyChurn: 2.8,
    adSpend: 30000,
    newCustomers: 320,
  },
};

export const UnitEconomicsSimulator = (): React.JSX.Element => {
  const [arpu, setArpu] = useState(80);
  const [grossMargin, setGrossMargin] = useState(70);
  const [monthlyChurn, setMonthlyChurn] = useState(4.5);
  const [adSpend, setAdSpend] = useState(25000);
  const [newCustomers, setNewCustomers] = useState(200);

  const applyPreset = (presetKey: string) => {
    const p = PRESETS[presetKey];
    if (!p) return;
    setArpu(p.arpu);
    setGrossMargin(p.grossMargin);
    setMonthlyChurn(p.monthlyChurn);
    setAdSpend(p.adSpend);
    setNewCustomers(p.newCustomers);
  };

  const stats = useMemo(() => {
    const safeChurn = Math.max(0.1, monthlyChurn) / 100;
    const marginFraction = grossMargin / 100;
    const grossProfitPerMonth = arpu * marginFraction;
    
    // LTV Gross Margin
    const ltv = grossProfitPerMonth / safeChurn;
    
    // Paid CAC
    const safeCustomers = Math.max(1, newCustomers);
    const cac = adSpend / safeCustomers;
    
    // Payback Period (months)
    const paybackMonths = grossProfitPerMonth > 0 ? cac / grossProfitPerMonth : 999;
    
    // LTV : CAC
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    // Monthly Net Margin Contribution after Ad Spend
    const monthlyGrossRevenue = safeCustomers * arpu;
    const monthlyGrossMarginAmount = monthlyGrossRevenue * marginFraction;
    const monthlyContributionMargin = monthlyGrossMarginAmount - adSpend;

    let healthStatus: 'healthy' | 'warning' | 'danger' = 'healthy';
    let healthMessage = 'Юнит-экономика здорова и готова к масштабированию.';

    if (ltvCacRatio < 2.0 || paybackMonths > 16) {
      healthStatus = 'danger';
      healthMessage = 'Опасная зона: высокий риск кассового разрыва. Payback слишком длинный либо CAC превышает маржинальный LTV.';
    } else if (ltvCacRatio > 5.0 && paybackMonths < 6) {
      healthStatus = 'warning';
      healthMessage = 'Предостережение: сильное недоинвестирование. Вы растете медленнее потенциала рынка.';
    } else if (ltvCacRatio < 3.0 || paybackMonths > 12) {
      healthStatus = 'warning';
      healthMessage = 'Умеренная зона: экономика сходится, но маржа уязвима при удорожании аукциона.';
    }

    return {
      ltv: Math.round(ltv),
      cac: Math.round(cac),
      paybackMonths: Number(paybackMonths.toFixed(1)),
      ltvCacRatio: Number(ltvCacRatio.toFixed(2)),
      monthlyContributionMargin: Math.round(monthlyContributionMargin),
      healthStatus,
      healthMessage,
    };
  }, [arpu, grossMargin, monthlyChurn, adSpend, newCustomers]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Интерактивный симулятор Unit-экономики</h3>
            <p className="text-xs text-zinc-400">
              Мгновенный стресс-тест когортного LTV, CAC Payback, маржинального вклада и чувствительности к оттоку.
            </p>
          </div>
        </div>

        {/* Industry Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-zinc-500 mr-1 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-400" />
            Бенчмарки:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('b2b')}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            B2B SaaS
          </button>
          <button
            type="button"
            onClick={() => applyPreset('mobile')}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Mobile Apps
          </button>
          <button
            type="button"
            onClick={() => applyPreset('ecom')}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            E-com DTC
          </button>
          <button
            type="button"
            onClick={() => applyPreset('fintech')}
            className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Fintech
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5 text-zinc-300">
              <span>ARPU (Выручка на клиента в мес):</span>
              <span className="font-mono text-brand-400 font-bold">${arpu}</span>
            </div>
            <input
              type="range"
              min={5}
              max={1000}
              step={5}
              value={arpu}
              onChange={(e) => setArpu(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5 text-zinc-300">
              <span>Валовая маржа (Gross Margin):</span>
              <span className="font-mono text-brand-400 font-bold">{grossMargin}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={95}
              value={grossMargin}
              onChange={(e) => setGrossMargin(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5 text-zinc-300">
              <span>Ежемесячный отток (Monthly Churn):</span>
              <span className="font-mono text-brand-400 font-bold">{monthlyChurn}%</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={25}
              step={0.5}
              value={monthlyChurn}
              onChange={(e) => setMonthlyChurn(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5 text-zinc-300">
              <span>Ежемесячный рекламный бюджет:</span>
              <span className="font-mono text-brand-400 font-bold">${adSpend.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={200000}
              step={1000}
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5 text-zinc-300">
              <span>Привлечено новых клиентов:</span>
              <span className="font-mono text-brand-400 font-bold">{newCustomers.toLocaleString()} чел</span>
            </div>
            <input
              type="range"
              min={10}
              max={5000}
              step={10}
              value={newCustomers}
              onChange={(e) => setNewCustomers(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-medium">Когортный LTV (Margin)</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                ${stats.ltv.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">Валовая маржа / Churn</span>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-medium">Paid CAC</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                ${stats.cac.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">Спенд / Новые клиенты</span>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-medium">Соотношение LTV : CAC</span>
              <span className={`text-xl font-bold font-mono mt-1 block ${
                stats.ltvCacRatio >= 3.0 ? 'text-emerald-400' : stats.ltvCacRatio >= 2.0 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {stats.ltvCacRatio}x
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">Бенчмарк: 3.0x - 4.5x</span>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-medium">CAC Payback</span>
              <span className={`text-xl font-bold font-mono mt-1 block ${
                stats.paybackMonths <= 12 ? 'text-emerald-400' : stats.paybackMonths <= 16 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {stats.paybackMonths} мес
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">Окупаемость вложений</span>
            </div>
          </div>

          {/* Health message */}
          <div className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
            stats.healthStatus === 'healthy'
              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
              : stats.healthStatus === 'warning'
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
              : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
          }`}>
            {stats.healthStatus === 'healthy' ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-semibold block">Вердикт симулятора:</span>
              <p className="mt-0.5 leading-relaxed">{stats.healthMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
