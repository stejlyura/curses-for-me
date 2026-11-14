'use client';

import { useState, useMemo } from 'react';

interface OutboundState {
  domainsCount: number;
  inboxesPerDomain: number;
  dailySendsPerInbox: number;
  workingDays: number;
  deliverabilityRate: number;
  replyRate: number;
  positiveReplyRatio: number;
  showUpRate: number;
  sqlConversionRate: number;
  closeRate: number;
  acv: number;
}

const PRESETS: Record<string, OutboundState> = {
  enterpriseSaaS: {
    domainsCount: 5,
    inboxesPerDomain: 3,
    dailySendsPerInbox: 35,
    workingDays: 22,
    deliverabilityRate: 97,
    replyRate: 8.5,
    positiveReplyRatio: 35,
    showUpRate: 80,
    sqlConversionRate: 65,
    closeRate: 25,
    acv: 45000,
  },
  midMarketTech: {
    domainsCount: 8,
    inboxesPerDomain: 3,
    dailySendsPerInbox: 40,
    workingDays: 22,
    deliverabilityRate: 96,
    replyRate: 11.0,
    positiveReplyRatio: 40,
    showUpRate: 82,
    sqlConversionRate: 60,
    closeRate: 20,
    acv: 18000,
  },
  smbVelocity: {
    domainsCount: 12,
    inboxesPerDomain: 3,
    dailySendsPerInbox: 45,
    workingDays: 22,
    deliverabilityRate: 94,
    replyRate: 14.0,
    positiveReplyRatio: 45,
    showUpRate: 75,
    sqlConversionRate: 50,
    closeRate: 18,
    acv: 6000,
  },
};

export const OutboundPipelineSimulator = (): React.JSX.Element => {
  const [params, setParams] = useState<OutboundState>(PRESETS.enterpriseSaaS);

  const calculations = useMemo(() => {
    const totalInboxes = params.domainsCount * params.inboxesPerDomain;
    const monthlyTotalSends = totalInboxes * params.dailySendsPerInbox * params.workingDays;
    const deliveredEmails = monthlyTotalSends * (params.deliverabilityRate / 100);
    const totalReplies = deliveredEmails * (params.replyRate / 100);
    const positiveReplies = totalReplies * (params.positiveReplyRatio / 100);

    const bookedMeetings = positiveReplies * 0.85;
    const attendedMeetings = bookedMeetings * (params.showUpRate / 100);
    const salesQualifiedLeads = attendedMeetings * (params.sqlConversionRate / 100);
    const closedWonDeals = salesQualifiedLeads * (params.closeRate / 100);
    const pipelineGenerated = salesQualifiedLeads * params.acv;
    const monthlyArrClosed = closedWonDeals * params.acv;

    const infraCost = totalInboxes * 6 + 95 + 180;
    const costPerSql = salesQualifiedLeads > 0 ? infraCost / salesQualifiedLeads : 0;
    const roiMultiple = infraCost > 0 ? monthlyArrClosed / infraCost : 0;

    return {
      totalInboxes,
      monthlyTotalSends: Math.round(monthlyTotalSends),
      deliveredEmails: Math.round(deliveredEmails),
      totalReplies: Math.round(totalReplies),
      positiveReplies: Math.round(positiveReplies),
      bookedMeetings: Math.round(bookedMeetings),
      attendedMeetings: Math.round(attendedMeetings),
      salesQualifiedLeads: Math.round(salesQualifiedLeads),
      closedWonDeals: Number(closedWonDeals.toFixed(1)),
      pipelineGenerated: Math.round(pipelineGenerated),
      monthlyArrClosed: Math.round(monthlyArrClosed),
      infraCost: Math.round(infraCost),
      costPerSql: Number(costPerSql.toFixed(2)),
      roiMultiple: Number(roiMultiple.toFixed(1)),
    };
  }, [params]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/70">
        <div>
          <h4 className="text-base font-semibold text-white">
            Симулятор B2B Outbound воронки
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Расчет от доменов и ящиков до ответов, демо-встреч, SQL и закрытой выручки.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setParams(PRESETS.enterpriseSaaS)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.enterpriseSaaS
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Enterprise
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.midMarketTech)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.midMarketTech
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mid-Market
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.smbVelocity)}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              params === PRESETS.smbVelocity
                ? 'bg-zinc-100 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            SMB
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="out-domains" className="text-[11px] text-zinc-400 block">
                Домены-сателлиты
              </label>
              <input
                id="out-domains"
                type="number"
                min="1"
                max="50"
                value={params.domainsCount}
                onChange={(e) => setParams({ ...params, domainsCount: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="out-inboxes" className="text-[11px] text-zinc-400 block">
                Ящиков на домен
              </label>
              <input
                id="out-inboxes"
                type="number"
                min="1"
                max="5"
                value={params.inboxesPerDomain}
                onChange={(e) => setParams({ ...params, inboxesPerDomain: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="out-limit" className="text-zinc-300 font-medium">
                Отправок в день на ящик
              </label>
              <span className="font-mono text-white tabular-nums">
                {params.dailySendsPerInbox} / день
              </span>
            </div>
            <input
              id="out-limit"
              type="range"
              min="15"
              max="60"
              step="5"
              value={params.dailySendsPerInbox}
              onChange={(e) =>
                setParams({ ...params, dailySendsPerInbox: Number(e.target.value) })
              }
              className="w-full accent-brand-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="out-deliv" className="text-[11px] text-zinc-400 block">
                Доставляемость (%)
              </label>
              <input
                id="out-deliv"
                type="number"
                step="1"
                min="80"
                max="99"
                value={params.deliverabilityRate}
                onChange={(e) =>
                  setParams({ ...params, deliverabilityRate: Number(e.target.value) })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="out-reply" className="text-[11px] text-zinc-400 block">
                Reply Rate (%)
              </label>
              <input
                id="out-reply"
                type="number"
                step="0.5"
                min="1"
                max="25"
                value={params.replyRate}
                onChange={(e) => setParams({ ...params, replyRate: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="out-pos" className="text-[11px] text-zinc-400 block">
                Позитивные ответы (%)
              </label>
              <input
                id="out-pos"
                type="number"
                step="1"
                min="10"
                max="70"
                value={params.positiveReplyRatio}
                onChange={(e) =>
                  setParams({ ...params, positiveReplyRatio: Number(e.target.value) })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="out-showup" className="text-[11px] text-zinc-400 block">
                Явка на созвон (%)
              </label>
              <input
                id="out-showup"
                type="number"
                step="1"
                min="50"
                max="95"
                value={params.showUpRate}
                onChange={(e) => setParams({ ...params, showUpRate: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="out-sql" className="text-[11px] text-zinc-400 block">
                Квалификация в SQL (%)
              </label>
              <input
                id="out-sql"
                type="number"
                step="5"
                min="20"
                max="90"
                value={params.sqlConversionRate}
                onChange={(e) =>
                  setParams({ ...params, sqlConversionRate: Number(e.target.value) })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="out-acv" className="text-[11px] text-zinc-400 block">
                Чек сделки / ACV ($)
              </label>
              <input
                id="out-acv"
                type="number"
                step="1000"
                min="1000"
                value={params.acv}
                onChange={(e) => setParams({ ...params, acv: Number(e.target.value) })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono tabular-nums text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 lg:border-l lg:border-zinc-800/70 lg:pl-8 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-zinc-800/70">
            <div>
              <span className="text-xs text-zinc-400 block">Пайплайн в месяц</span>
              <div className="text-3xl font-bold font-mono text-white mt-1 tabular-nums">
                ${calculations.pipelineGenerated.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-mono tabular-nums">
                Прогноз ARR:{' '}
                <span className="text-emerald-400 font-semibold">
                  ${calculations.monthlyArrClosed.toLocaleString()}
                </span>{' '}
                ({calculations.closedWonDeals} сделок)
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-zinc-400 block">ROI инфраструктуры</span>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {calculations.roiMultiple}x
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-mono tabular-nums">
                Стек: ${calculations.infraCost}/мес
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <div className="text-xs text-zinc-400">Отправок</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                {calculations.monthlyTotalSends.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                {calculations.totalInboxes} ящиков
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">Ответов</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                {calculations.totalReplies.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                Позитивных: {calculations.positiveReplies}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">Демо-встреч</div>
              <div className="text-lg font-semibold font-mono text-white mt-0.5 tabular-nums">
                {calculations.attendedMeetings}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                Букинг: {calculations.bookedMeetings}
              </div>
            </div>

            <div>
              <div className="text-xs text-zinc-400">SQL</div>
              <div className="text-lg font-semibold font-mono text-emerald-400 mt-0.5 tabular-nums">
                {calculations.salesQualifiedLeads}
              </div>
              <div className="text-[11px] text-zinc-500 tabular-nums">
                ${calculations.costPerSql} / SQL
              </div>
            </div>
          </div>

          <p className="pt-4 border-t border-zinc-800/70 text-xs text-zinc-400 leading-relaxed">
            Безопасный потолок отправки — 30–45 писем в день с одного ящика. Превышение 50 писем в день ухудшает репутацию домена и снижает доставляемость ниже 80%.
          </p>
        </div>
      </div>
    </div>
  );
};
