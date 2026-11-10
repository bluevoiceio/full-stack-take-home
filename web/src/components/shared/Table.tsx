import type { ReactNode } from 'react';

import { Card } from './Card';

export interface TableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage: string;
}

export const Table = <T,>({
  title,
  columns,
  data,
  getRowId,
  isLoading = false,
  isError = false,
  emptyMessage,
}: TableProps<T>) => {
  const status = isLoading
    ? 'Loading…'
    : isError
      ? 'Could not load this table. Is the API running?'
      : data.length === 0
        ? emptyMessage
        : null;

  return (
    <Card className='overflow-hidden'>
      <div className='flex items-center justify-between border-b px-6 py-4'>
        <h2 className='font-semibold'>{title}</h2>
        {!status && (
          <span className='text-sm text-muted-foreground tabular-nums'>
            {data.length} {data.length === 1 ? 'row' : 'rows'}
          </span>
        )}
      </div>
      {status ? (
        <p className='px-6 py-10 text-center text-sm text-muted-foreground'>
          {status}
        </p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='text-muted-foreground'>
              <tr className='border-b'>
                {columns.map(column => (
                  <th
                    key={column.id}
                    className='px-6 py-3 font-medium whitespace-nowrap'
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr
                  key={getRowId(row)}
                  className='border-b last:border-b-0 hover:bg-muted/50'
                >
                  {columns.map(column => (
                    <td
                      key={column.id}
                      className={column.className ?? 'px-6 py-3'}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
