import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/utils/cn';

import { Card } from './Card';

export interface StatItem {
  title: string;
  value: number | string;
  /** Leading icon, e.g. `<Users className='size-5' />`. */
  icon: ReactNode;
  /** A line of detail under the value. */
  subline?: ReactNode;
  /** Makes the whole card a link. */
  href?: string;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  subline,
  href,
  className,
}: StatItem) => {
  const card = (
    <Card
      className={cn(
        'h-full p-5',
        href && 'transition-colors hover:bg-muted/50',
        className,
      )}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
            {title}
          </p>
          <p className='mt-2 text-3xl font-bold tracking-tight tabular-nums'>
            {value}
          </p>
          {subline && (
            <div className='mt-2 text-xs text-muted-foreground'>{subline}</div>
          )}
        </div>
        <div className='rounded-xl bg-primary/10 p-3 text-primary'>{icon}</div>
      </div>
    </Card>
  );
  return href ? <Link to={href}>{card}</Link> : card;
};

const LG_COLUMN_CLASS = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
} as const;

interface StatsGridProps {
  items: StatItem[];
  /** Column count on large screens. Small screens always show two. */
  columns?: keyof typeof LG_COLUMN_CLASS;
}

export const StatsGrid = ({ items, columns = 4 }: StatsGridProps) => (
  <div className={cn('grid grid-cols-2 gap-4', LG_COLUMN_CLASS[columns])}>
    {items.map(item => (
      <StatCard key={item.title} {...item} />
    ))}
  </div>
);
