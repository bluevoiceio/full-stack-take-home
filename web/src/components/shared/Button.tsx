import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';

const VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border bg-card hover:bg-muted',
  ghost: 'hover:bg-muted',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'default' | 'sm' | 'icon';
  isLoading?: boolean;
}

export const Button = ({
  variant = 'default',
  size = 'default',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    type='button'
    disabled={disabled || isLoading}
    className={cn(
      'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      size === 'default' && 'h-9 px-4',
      size === 'sm' && 'h-8 px-3 text-xs',
      size === 'icon' && 'size-9',
      VARIANTS[variant],
      className,
    )}
    {...props}
  >
    {isLoading ? 'Working…' : children}
  </button>
);
