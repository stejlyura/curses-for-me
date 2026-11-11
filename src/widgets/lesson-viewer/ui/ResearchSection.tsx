import { ResearchInsight } from '@/entities/lesson';
import { BookOpen, ExternalLink, Lightbulb } from 'lucide-react';

interface ResearchSectionProps {
  insights: ResearchInsight[];
}

export const ResearchSection = ({ insights }: ResearchSectionProps): React.JSX.Element => {
  if (insights.length === 0) return <></>;

  return (
    <section className="my-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Исследования и доказательная база
          </h3>
          <p className="text-xs text-zinc-400">
            Отраслевые отчеты и эконометрические выводы, на которые ссылаются топ-маркетологи.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                {item.source} {item.year ? `(${item.year})` : ''}
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-200 leading-relaxed font-medium">
              {item.finding}
            </p>

            <div className="mt-3 p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-300">Применение на практике: </span>
                {item.practicalTakeaway}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

