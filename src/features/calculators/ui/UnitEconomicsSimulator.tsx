'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

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
    name: 'B2B SaaS',
    arpu: 250,
    grossMargin: 82,
    monthlyChurn: 1.8,
    adSpend: 35000,
    newCustomers: 70,
  },
  mobile: {
    name: 'Mobile Apps',
    arpu: 12,
    grossMargin: 70,
    monthlyChurn: 6.5,
    adSpend: 60000,
    newCustomers: 4000,
  },
  ecom: {
    name: 'E-com DTC',
    arpu: 65,
    grossMargin: 48,
    monthlyChurn: 9.0,
    adSpend: 45000,
    newCustomers: 1200,
  },
  fintech: {
    name: 'Fintech',
    arpu: 85,
    grossMargin: 76,
    monthlyChurn: 2.8,
    adSpend: 30000,
    newCustomers: 320,
  },
};

export const UnitEconomicsSimulator = (): React.JSX.Element => {
  const [activePreset, setActivePreset] = useState<string>('custom');
  const [arpu, setArpu] = useState(80);
  const [grossMargin, setGrossMargin] = useState(70);
  const [monthlyChurn, setMonthlyChurn] = useState(4.5);
  const [adSpend, setAdSpend] = useState(25000);
  const [newCustomers, setNewCustomers] = useState(200);

  const applyPreset = (presetKey: string) => {
    const p = PRESETS[presetKey];
    if (!p) return;
    setActivePreset(presetKey);
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

    const ltv = grossProfitPerMonth / safeChurn;
    const safeCustomers = Math.max(1, newCustomers);
    const cac = adSpend / safeCustomers;
    const paybackMonths = grossProfitPerMonth > 0 ? cac / grossProfitPerMonth : 999;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    const monthlyGrossRevenue = safeCustomers * arpu;
    const monthlyGrossMarginAmount = monthlyGrossRevenue * marginFraction;
    const monthlyContributionMargin = monthlyGrossMarginAmount - adSpend;

    let healthStatus: 'healthy' | 'warning' | 'danger' = 'healthy';
    let healthMessage = 'Юнит-экономика сходится и готова к масштабированию.';

    if (ltvCacRatio < 2.0 || paybackMonths > 16) {
      healthStatus = 'danger';
      healthMessage =
        'Высокий риск кассового разрыва: срок окупаемости слишком длинный или CAC превышает маржинальный LTV.';
    } else if (ltvCacRatio > 5.0 && paybackMonths < 6) {
      healthStatus = 'warning';
      healthMessage =
        'Сильное недоинвестирование: запас маржи позволяет агрессивнее закупать трафик и расти быстрее.';
    } else if (ltvCacRatio < 3.0 || paybackMonths > 12) {
      healthStatus = 'warning';
      healthMessage =
        'Умеренная устойчивость: экономика сходится, но маржа уязвима к росту ставок аукциона.';
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
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/70">
        <div>
          <h4 className="text-base font-semibold text-white">Симулятор Unit-экономики</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Расчет когортного LTV, CAC Payback и чувствительности к оттоку.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                activePreset === key
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="ue-arpu" className="text-zinc-300 font-medium">
                ARPU (выручка на клиента в мес)
              </label>
              <span className="font-mono text-white tabular-nums">${arpu}</span>
            </div>
            <input
              id="ue-arpu"
              type="range"
              min={5}
              max={1000}
              step={5}
              value={arpu}
              onChange={(e) => {
                setActivePreset('custom');
                setArpu(Number(e.target.value));
              }}
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="ue-margin" className="text-zinc-300 font-medium">
                Валовая маржа (Gross Margin)
              </label>
              <span className="font-mono text-white tabular-nums">{grossMargin}%</span>
            </div>
            <input
              id="ue-margin"
              type="range"
              min={10}
              max={95}
              value={grossMargin}
              onChange={(e) => {
                setActivePreset('custom');
                setGrossMargin(Number(e.target.value));
              }}
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="ue-churn" className="text-zinc-300 font-medium">
                Ежемесячный отток (Monthly Churn)
              </label>
              <span className="font-mono text-white tabular-nums">{monthlyChurn}%</span>
            </div>
            <input
              id="ue-churn"
              type="range"
              min={0.5}
              max={25}
              step={0.5}
              value={monthlyChurn}
              onChange={(e) => {
                setActivePreset('custom');
                setMonthlyChurn(Number(e.target.value));
              }}
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="ue-spend" className="text-zinc-300 font-medium">
                Рекламный бюджет в месяц
              </label>
              <span className="font-mono text-white tabular-nums">${adSpend.toLocaleString()}</span>
            </div>
            <input
              id="ue-spend"
              type="range"
              min={1000}
              max={200000}
              step={1000}
              value={adSpend}
              onChange={(e) => {
                setActivePreset('custom');
                setAdSpend(Number(e.target.value));
              }}
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <label htmlFor="ue-customers" className="text-zinc-300 font-medium">
                Новых клиентов в месяц
              </label>
              <span className="font-mono text-white tabular-nums">{newCustomers.toLocaleString()}</span>
            </div>
            <input
              id="ue-customers"
              type="range"
              min={10}
              max={5000}
              step={10}
              value={newCustomers}
              onChange={(e) => {
                setActivePreset('custom');
                setNewCustomers(Number(e.target.value));
              }}
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between lg:border-l lg:border-zinc-800/70 lg:pl-8 space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <span className="text-xs text-zinc-400 block">Когортный LTV</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block tabular-nums">
                ${stats.ltv.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block">Маржа / Churn</span>
            </div>

            <div>
              <span className="text-xs text-zinc-400 block">Paid CAC</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block tabular-nums">
                ${stats.cac.toLocaleString()}
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block">Бюджет / Клиенты</span>
            </div>

            <div>
              <span className="text-xs text-zinc-400 block">LTV : CAC</span>
              <span
                className={`text-2xl font-bold font-mono mt-1 block tabular-nums ${
                  stats.ltvCacRatio >= 3.0
                    ? 'text-emerald-400'
                    : stats.ltvCacRatio >= 2.0
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {stats.ltvCacRatio}x
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block">Ориентир: 3.0x–4.5x</span>
            </div>

            <div>
              <span className="text-xs text-zinc-400 block">CAC Payback</span>
              <span
                className={`text-2xl font-bold font-mono mt-1 block tabular-nums ${
                  stats.paybackMonths <= 12
                    ? 'text-emerald-400'
                    : stats.paybackMonths <= 16
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {stats.paybackMonths} мес
              </span>
              <span className="text-[11px] text-zinc-500 mt-0.5 block">Срок окупаемости</span>
            </div>
          </div>

          <div className="pt-5 border-t border-zinc-800/70 flex items-start gap-2.5 text-xs">
            {stats.healthStatus === 'healthy' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  stats.healthStatus === 'warning' ? 'text-amber-400' : 'text-rose-400'
                }`}
              />
            )}
            <p className="text-zinc-300 leading-relaxed">{stats.healthMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
