import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const PageLayout = ({
  title,
  description,
  actions,
  children,
}: PageLayoutProps) => (
  <div className='space-y-6'>
    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-balance'>
          {title}
        </h1>
        {description && (
          <p className='mt-1 text-sm text-pretty text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {actions && <div className='flex flex-wrap gap-2'>{actions}</div>}
    </div>
    {children}
  </div>
);
