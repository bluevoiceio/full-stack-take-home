import type { LucideIcon } from 'lucide-react';

import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

export const StatCard = ({ label, value, icon: Icon }: StatCardProps) => (
  <Card className='flex items-center justify-between p-6'>
    <div>
      <p className='text-xs font-medium tracking-wider text-muted-foreground uppercase'>
        {label}
      </p>
      <p className='mt-1 text-3xl font-bold tabular-nums'>{value}</p>
    </div>
    <div className='rounded-xl bg-primary/10 p-3 text-primary'>
      <Icon className='size-5' />
    </div>
  </Card>
);
