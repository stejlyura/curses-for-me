import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
      success: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60',
      warning: 'bg-amber-950/40 text-amber-400 border-amber-800/60',
      danger: 'bg-rose-950/40 text-rose-400 border-rose-800/60',
      purple: 'bg-purple-950/40 text-purple-300 border-purple-800/60',
      cyan: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60',
      outline: 'bg-transparent text-zinc-300 border-zinc-800',
    };

    const sizeStyles = {
      sm: 'text-[10px] font-semibold px-2 py-0.5 rounded',
      md: 'text-xs font-semibold px-2.5 py-1 rounded-md',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 border transition-colors',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

