import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-500/20',
      secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100',
      outline: 'bg-transparent border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white',
      ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white',
    };

    const sizeStyles = {
      sm: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
      md: 'px-4 py-2 text-xs font-bold rounded-xl',
      lg: 'px-5 py-2.5 text-sm font-bold rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

