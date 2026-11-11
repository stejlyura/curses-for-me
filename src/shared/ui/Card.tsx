import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'border border-zinc-800 bg-zinc-900/60',
      elevated: 'border border-zinc-800 bg-zinc-950/80 shadow-xl',
      glass: 'border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md',
      bordered: 'border border-zinc-800 bg-transparent',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl transition-colors', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

