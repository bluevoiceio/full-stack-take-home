import type { HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export const Card = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('rounded-xl border bg-card shadow', className)}
    {...props}
  />
);
