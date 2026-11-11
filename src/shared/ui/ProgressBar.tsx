import { cn } from '@/shared/lib/cn';

export interface ProgressBarProps {
  value: number; // 0 - 100
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({
  value,
  className,
  barClassName,
  showLabel = false,
}: ProgressBarProps): React.JSX.Element => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('w-full space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
          <span>Прогресс</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300', barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

