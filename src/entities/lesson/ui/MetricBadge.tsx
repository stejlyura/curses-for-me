import { BenchmarkMetric } from '../model/schemas';
import { Badge } from '@/shared/ui';

interface MetricBadgeProps {
  metric: BenchmarkMetric;
}

export const MetricBadge = ({ metric }: MetricBadgeProps): React.JSX.Element => {
  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
      <span className="font-semibold text-zinc-200">{metric.metric}:</span>
      <Badge variant="success" size="sm">
        {metric.targetBenchmark}
      </Badge>
    </div>
  );
};

