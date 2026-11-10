import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type BadgeVariant = 'primary' | 'secondary' | 'error' | 'outline';

const VARIANTS: Record<BadgeVariant, string> = {
  primary: 'border-transparent bg-primary text-primary-foreground shadow',
  secondary: 'border-transparent bg-muted text-foreground',
  error: 'border-transparent bg-destructive text-destructive-foreground shadow',
  outline: 'text-foreground',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({
  variant = 'primary',
  className,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
      VARIANTS[variant],
      className,
    )}
    {...props}
  />
);
