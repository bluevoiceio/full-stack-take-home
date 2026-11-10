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
