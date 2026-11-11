'use client';

import { useState } from 'react';
import { ResumeBullet } from '@/entities/lesson';
import { Copy, Check, FileCheck } from 'lucide-react';

interface ResumeBulletSectionProps {
  bullets: ResumeBullet[];
}

export const ResumeBulletSection = ({ bullets }: ResumeBulletSectionProps): React.JSX.Element => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy bullet:', err);
    }
  };

  if (bullets.length === 0) return <></>;

  return (
    <section className="my-10 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Формулировки для резюме (Google XYZ Formula)
          </h3>
          <p className="text-xs text-zinc-400">
            &ldquo;Accomplished [X] as measured by [Y] by doing [Z]&rdquo; — бери готовые сильные паттерны с конкретными метриками.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {bullets.map((bullet, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="group relative rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
                  {bullet.formula}
                </span>
                <button
                  onClick={() => copyToClipboard(bullet.concreteExample, idx)}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white transition-colors"
                  title="Скопировать в буфер"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm font-medium text-zinc-100 leading-relaxed font-mono bg-zinc-950/70 p-3 rounded-lg border border-zinc-800/60">
                {bullet.concreteExample}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {bullet.keywords.map((kw, kwIdx) => (
                  <span
                    key={kwIdx}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

