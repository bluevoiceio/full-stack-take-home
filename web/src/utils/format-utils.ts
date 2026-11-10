import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import type { User } from '@/types/api-types';

dayjs.extend(utc);

// API timestamps are UTC with no offset, so `new Date()` would read them as local time.
export const formatUTCDateString = ({
  utcDateString,
  variant = 'date-time',
}: {
  utcDateString: string;
  variant?: 'date-only' | 'date-time';
}) =>
  dayjs
    .utc(utcDateString)
    .local()
    .format(variant === 'date-only' ? 'MMM D, YYYY' : 'MMM D, YYYY h:mm A');

export const fullName = (user: Pick<User, 'firstName' | 'lastName'>) =>
  `${user.firstName} ${user.lastName}`;

const csvCell = (value: unknown) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

export const exportToCSV = ({
  data,
  fileName = 'export',
}: {
  data: Record<string, unknown>[];
  fileName?: string;
}) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const lines = [headers, ...data.map(row => headers.map(key => row[key]))];
  const csv = lines.map(line => line.map(csvCell).join(',')).join('\n');
  const url = URL.createObjectURL(
    new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// History has one row per recipient. A send shares a sender, title and timestamp.
export const countSends = (
  rows: { senderId: string; title: string; createdAt: string }[],
) =>
  new Set(rows.map(row => `${row.senderId}|${row.title}|${row.createdAt}`))
    .size;
