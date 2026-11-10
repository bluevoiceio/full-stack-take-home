import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

import { User } from '../constants/types';
import { Toast, useToastStore } from '../store/useToastStore';

dayjs.extend(utc);
dayjs.extend(relativeTime);

// API timestamps are UTC with no offset, so `new Date()` would read them as local time.
export const fromNow = (utcDateString: string) =>
  dayjs.utc(utcDateString).fromNow();

export const fullName = (user: Pick<User, 'firstName' | 'lastName'>) =>
  `${user.firstName} ${user.lastName}`;

export const parseAxiosError = (error: unknown) => {
  if (!isAxiosError(error)) return { status: undefined, message: undefined };
  const body = error.response?.data as
    { message?: string; detail?: string; code?: string } | undefined;
  return {
    status: error.response?.status,
    code: body?.code,
    message: body?.message ?? body?.detail,
  };
};

export const showToast = (toast: Toast) => useToastStore.getState().show(toast);
