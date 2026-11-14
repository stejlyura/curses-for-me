import { ResearchInsight } from '@/entities/lesson';

interface ResearchSectionProps {
  insights: ResearchInsight[];
}

export const ResearchSection = ({ insights }: ResearchSectionProps): React.JSX.Element | null => {
  if (insights.length === 0) return null;

  return (
    <section className="pt-10 border-t border-zinc-800/70 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Исследования и данные
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 mt-1">
          Отраслевые отчеты и выводы, на которые опираются сеньор-специалисты.
        </p>
      </div>

      <div className="divide-y divide-zinc-800/60 border-t border-b border-zinc-800/60">
        {insights.map((item, idx) => (
          <div key={idx} className="py-5 space-y-2.5">
            <div className="text-sm font-medium text-brand-400">
              {item.source} {item.year ? `· ${item.year}` : ''}
            </div>

            <p className="text-base text-zinc-100 leading-relaxed font-medium">
              {item.finding}
            </p>

            <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed">
              <span className="text-zinc-200 font-medium">На практике: </span>
              {item.practicalTakeaway}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

