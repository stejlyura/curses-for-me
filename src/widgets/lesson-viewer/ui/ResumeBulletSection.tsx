'use client';

import { useState } from 'react';
import { ResumeBullet } from '@/entities/lesson';
import { Copy, Check } from 'lucide-react';

interface ResumeBulletSectionProps {
  bullets: ResumeBullet[];
}

export const ResumeBulletSection = ({ bullets }: ResumeBulletSectionProps): React.JSX.Element | null => {
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

  if (bullets.length === 0) return null;

  return (
    <section className="pt-10 border-t border-zinc-800/70 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Формулировки для резюме
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-1">
          Готовые паттерны по формуле Google XYZ: результат, метрика и конкретное действие.
        </p>
      </div>

      <div className="space-y-4">
        {bullets.map((bullet, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium text-zinc-400">
                  {bullet.formula}
                </span>
                <button
                  onClick={() => copyToClipboard(bullet.concreteExample, idx)}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0"
                  title="Скопировать в буфер"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[15px] sm:text-base text-zinc-100 leading-relaxed">
                {bullet.concreteExample}
              </p>

              {bullet.keywords.length > 0 && (
                <div className="text-sm text-zinc-400">
                  Ключевые слова: {bullet.keywords.join(' · ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
