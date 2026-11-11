'use client';

import { useState, useMemo } from 'react';
import { 
  PhoneCall, 
  Mail, 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  Users, 
  Cpu 
} from 'lucide-react';

interface OutboundState {
  domainsCount: number;
  inboxesPerDomain: number;
  dailySendsPerInbox: number; // recommend 30-45
  workingDays: number; // 22 days/month
  deliverabilityRate: number; // %
  replyRate: number; // %
  positiveReplyRatio: number; // % of replies that want a call
  showUpRate: number; // % of booked calls attended
  sqlConversionRate: number; // % attended calls qualified to SQL
  closeRate: number; // % SQL closed to won
  acv: number; // Annual Contract Value $
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
    
    // Each positive reply converts to a booked meeting (assuming 85% book rate from positive interest)
    const bookedMeetings = positiveReplies * 0.85;
    const attendedMeetings = bookedMeetings * (params.showUpRate / 100);
    const salesQualifiedLeads = attendedMeetings * (params.sqlConversionRate / 100);
    const closedWonDeals = salesQualifiedLeads * (params.closeRate / 100);
    const pipelineGenerated = salesQualifiedLeads * params.acv;
    const monthlyArrClosed = closedWonDeals * params.acv;

    // Infrastructure estimated monthly costs ($5/inbox Google/Outlook + $80 Smartlead/Instantly + $150 Clay/Apollo)
    const infraCost = (totalInboxes * 6) + 95 + 180;
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
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
            <PhoneCall className="w-3.5 h-3.5" />
            Outbound Sales Pipeline & Capacity Engine
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Симулятор B2B Outbound воронки и емкости пайплайна
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Сквозной расчет от доменов и почтовых ящиков до ответов, демо-встреч, квалифицированных лидов (SQL) и закрытой выручки (ARR).
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setParams(PRESETS.enterpriseSaaS)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.enterpriseSaaS
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Enterprise ($45k)
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.midMarketTech)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.midMarketTech
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mid-Market ($18k)
          </button>
          <button
            type="button"
            onClick={() => setParams(PRESETS.smbVelocity)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              params === PRESETS.smbVelocity
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            SMB ($6k)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Вторичные домены-сателлиты</label>
              <input
                type="number"
                min="1"
                max="50"
                value={params.domainsCount}
                onChange={(e) => setParams({ ...params, domainsCount: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Почтовых ящиков на домен</label>
              <input
                type="number"
                min="1"
                max="5"
                value={params.inboxesPerDomain}
                onChange={(e) => setParams({ ...params, inboxesPerDomain: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Лимит отправок в день на ящик (Safe: 30-45)</span>
              <span className="font-mono text-sky-400">{params.dailySendsPerInbox} писем/день</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={params.dailySendsPerInbox}
              onChange={(e) => setParams({ ...params, dailySendsPerInbox: Number(e.target.value) })}
              className="w-full accent-sky-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Deliverability (Доставляемость, %)</label>
              <input
                type="number"
                step="1"
                min="80"
                max="99"
                value={params.deliverabilityRate}
                onChange={(e) => setParams({ ...params, deliverabilityRate: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Reply Rate (Конверсия в ответ, %)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="25"
                value={params.replyRate}
                onChange={(e) => setParams({ ...params, replyRate: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Позитивные ответы (Positive %)</label>
              <input
                type="number"
                step="1"
                min="10"
                max="70"
                value={params.positiveReplyRatio}
                onChange={(e) => setParams({ ...params, positiveReplyRatio: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Show-Up Rate (Явка на созвон, %)</label>
              <input
                type="number"
                step="1"
                min="50"
                max="95"
                value={params.showUpRate}
                onChange={(e) => setParams({ ...params, showUpRate: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Квалификация в SQL (%)</label>
              <input
                type="number"
                step="5"
                min="20"
                max="90"
                value={params.sqlConversionRate}
                onChange={(e) => setParams({ ...params, sqlConversionRate: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Средний чек сделки / ACV ($)</label>
              <input
                type="number"
                step="1000"
                min="1000"
                value={params.acv}
                onChange={(e) => setParams({ ...params, acv: Number(e.target.value) })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Pipeline Metric Card */}
          <div className="rounded-2xl p-5 border bg-sky-950/30 border-sky-800/60 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-400">
                  Сгенерированный пайплайн в месяц (Pipeline Value)
                </span>
                <div className="text-3xl font-extrabold font-mono text-sky-400 mt-1">
                  ${calculations.pipelineGenerated.toLocaleString()}
                </div>
                <div className="text-xs text-zinc-300 mt-1">
                  Прогноз закрытой выручки (Closed ARR):{' '}
                  <span className="font-mono font-bold text-emerald-400">
                    ${calculations.monthlyArrClosed.toLocaleString()}
                  </span>{' '}
                  ({calculations.closedWonDeals} сделок/мес)
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-xs text-zinc-400">Инфраструктурный ROI:</div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {calculations.roiMultiple}x
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">
                  Затраты на стек:{' '}
                  <span className="text-zinc-300 font-mono">
                    ${calculations.infraCost}/мес
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Funnel Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">Объем отправки</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {calculations.monthlyTotalSends.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                С {calculations.totalInboxes} ящиков
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">Всего ответов</div>
              <div className="text-lg font-bold font-mono text-white mt-0.5">
                {calculations.totalReplies.toLocaleString()}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Позитивных: {calculations.positiveReplies}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">Состоявшихся демо</div>
              <div className="text-lg font-bold font-mono text-sky-400 mt-0.5">
                {calculations.attendedMeetings}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Букинг: {calculations.bookedMeetings}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/70 p-3">
              <div className="text-[11px] text-zinc-400">SQL для AE</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                {calculations.salesQualifiedLeads}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Себестоимость SQL: ${calculations.costPerSql}
              </div>
            </div>
          </div>

          {/* SDR Lead Playbook Note */}
          <div className="rounded-xl bg-zinc-900/40 border border-zinc-800 p-3.5 text-xs text-zinc-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">SDR Outbound Capacity Benchmark:</span>
              При отправке <span className="font-mono text-sky-300">{params.dailySendsPerInbox}</span> писем в день с{' '}
              <span className="font-mono text-sky-300">{calculations.totalInboxes}</span> ящиков (нагрузка одного SDR) система генерирует{' '}
              <span className="font-mono text-emerald-300">{calculations.salesQualifiedLeads} SQL</span> в месяц. Превышение лимита в 50 писем/ящик уничтожает SPF/DMARC репутацию домена и обрушивает Deliverability ниже 80%.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

