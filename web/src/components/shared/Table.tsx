import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type Table as TableInstance,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { cn } from '@/utils/cn';
import { exportToCSV } from '@/utils/format-utils';

import { Button } from './Button';
import { Card } from './Card';
import { inputStyles } from './styles';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface TableProps<T> {
  title: string;
  /** Columns sort and filter on their accessor. Give a column `enableSorting: false`
   * and `enableColumnFilter: false` to opt it out, as the actions column does. */
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  /** Shown when there are no rows at all, as opposed to none matching the filters. */
  emptyMessage?: string;
  canExportCSV?: boolean;
}

const buildCsvRows = <T,>(table: TableInstance<T>) => {
  const columns = table
    .getAllLeafColumns()
    .filter(column => column.accessorFn !== undefined);
  return table.getFilteredRowModel().rows.map(row =>
    Object.fromEntries(
      columns.map(column => {
        const header = column.columnDef.header;
        return [
          typeof header === 'string' ? header : column.id,
          row.getValue(column.id),
        ];
      }),
    ),
  );
};

export const Table = <T,>({
  title,
  columns,
  data,
  isLoading = false,
  isError = false,
  emptyMessage,
  canExportCSV = false,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const placeholderMessage = isLoading
    ? 'Loading…'
    : isError
      ? 'Could not load this table. Is the API running?'
      : data.length === 0
        ? (emptyMessage ?? 'No results.')
        : 'No matching results.';

  return (
    <Card className='flex flex-col overflow-hidden'>
      <div className='flex flex-row flex-wrap items-center gap-4 border-b px-6 py-4'>
        <h2 className='text-xl leading-none font-semibold tracking-tight'>
          {title}
        </h2>
        <div className='flex flex-wrap items-center gap-3'>
          {canExportCSV && (
            <Button
              variant='secondary'
              size='sm'
              onClick={() =>
                exportToCSV({ data: buildCsvRows(table), fileName: title })
              }
            >
              <Download />
              Export to CSV ({filteredCount.toLocaleString()}{' '}
              {filteredCount === 1 ? 'row' : 'rows'})
            </Button>
          )}
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table
          className='w-full text-sm'
          style={{ minWidth: table.getTotalSize() }}
        >
          <thead className='border-b'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const sorted = header.column.getIsSorted();
                  const label = flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );
                  return (
                    <th
                      key={header.id}
                      className='h-10 px-4 text-left align-middle font-medium text-muted-foreground'
                      style={{ minWidth: header.column.getSize() }}
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type='button'
                          className='flex cursor-pointer items-center gap-1 select-none'
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {label}
                          {sorted === 'asc' ? (
                            <ArrowUp className='size-4' aria-hidden='true' />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className='size-4' aria-hidden='true' />
                          ) : (
                            <ArrowUpDown
                              className='size-4 opacity-50'
                              aria-hidden='true'
                            />
                          )}
                        </button>
                      ) : (
                        label
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={`${headerGroup.id}-filter`}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className='px-4 pt-1 pb-3 text-left align-middle font-normal'
                  >
                    {header.column.getCanFilter() && (
                      <input
                        type='text'
                        placeholder='Search...'
                        aria-label={`Filter by ${header.column.id}`}
                        value={(header.column.getFilterValue() ?? '') as string}
                        onChange={event =>
                          header.column.setFilterValue(event.target.value)
                        }
                        className={cn(inputStyles, 'h-8 py-1')}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className='h-24 text-center text-muted-foreground'
                >
                  {placeholderMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className='border-b transition-colors hover:bg-muted/50'
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className='p-4 align-top wrap-break-word'
                      style={{ maxWidth: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav className='border-t px-4 py-3' aria-label='Table pagination'>
        <TablePagination table={table} />
      </nav>
    </Card>
  );
};

const TablePagination = <T,>({ table }: { table: TableInstance<T> }) => {
  const rowCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const pageButton = (
    label: string,
    icon: ReactNode,
    onClick: () => void,
    disabled: boolean,
  ) => (
    <Button
      variant='secondary'
      size='icon'
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  );

  return (
    <div className='flex flex-wrap items-center justify-between gap-4'>
      <div className='flex items-center gap-2'>
        {pageButton(
          'Go to first page',
          <ChevronFirst aria-hidden='true' />,
          () => table.firstPage(),
          !table.getCanPreviousPage(),
        )}
        {pageButton(
          'Go to previous page',
          <ChevronLeft aria-hidden='true' />,
          () => table.previousPage(),
          !table.getCanPreviousPage(),
        )}
        {pageButton(
          'Go to next page',
          <ChevronRight aria-hidden='true' />,
          () => table.nextPage(),
          !table.getCanNextPage(),
        )}
        {pageButton(
          'Go to last page',
          <ChevronLast aria-hidden='true' />,
          () => table.lastPage(),
          !table.getCanNextPage(),
        )}
      </div>

      <div className='flex flex-wrap items-center gap-4 text-sm'>
        {rowCount > PAGE_SIZE_OPTIONS[0] && (
          <label className='flex items-center gap-2'>
            <span className='text-muted-foreground'>Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={event => table.setPageSize(Number(event.target.value))}
              className={cn(inputStyles, 'h-8 w-20 py-1')}
            >
              {PAGE_SIZE_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
        <span className='text-muted-foreground' aria-live='polite'>
          Page {rowCount === 0 ? 0 : currentPage} of {pageCount}
        </span>
        <span className='font-medium'>
          {rowCount.toLocaleString()} {rowCount === 1 ? 'row' : 'rows'}
        </span>
      </div>
    </div>
  );
};
