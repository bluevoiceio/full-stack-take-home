import type { ColumnDef } from '@tanstack/react-table';
import { Bell, BellRing, Send, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button, PageLayout, StatsGrid, Table } from '@/components/shared';
import {
  useGetNotificationHistory,
  useGetUsersByDepartmentId,
} from '@/hooks/admin-api';
import type { Notification } from '@/types/api-types';
import {
  countSends,
  formatUTCDateString,
  fullName,
} from '@/utils/format-utils';

import { SendNotificationModal } from './SendNotificationModal';

export const DepartmentNotifications = () => {
  const { notifications, isLoading, isError } = useGetNotificationHistory();
  const { users } = useGetUsersByDepartmentId();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const columns = useMemo<ColumnDef<Notification>[]>(() => {
    const nameById = new Map(users.map(user => [user.id, fullName(user)]));
    return [
      { header: 'Title', id: 'title', accessorKey: 'title', size: 200 },
      { header: 'Message', id: 'message', accessorKey: 'message', size: 320 },
      {
        header: 'Sender',
        id: 'sender',
        accessorFn: row => nameById.get(row.senderId) ?? '—',
        size: 170,
      },
      {
        header: 'Recipient',
        id: 'recipient',
        accessorFn: row => nameById.get(row.receiverId) ?? '—',
        size: 170,
      },
      {
        header: 'Created At',
        id: 'createdAt',
        accessorKey: 'createdAt',
        cell: info =>
          formatUTCDateString({ utcDateString: info.row.original.createdAt }),
        enableColumnFilter: false,
        size: 190,
      },
      {
        header: 'Read',
        id: 'read',
        accessorFn: row => (row.read ? 'Yes' : 'No'),
        cell: info => (
          <span className='font-semibold'>{info.getValue<string>()}</span>
        ),
        size: 110,
      },
    ];
  }, [users]);

  const readCount = notifications.filter(row => row.read).length;

  return (
    <PageLayout
      title='Notifications'
      description='Send and manage push notifications for your department.'
      actions={
        <Button onClick={() => setIsSendModalOpen(true)}>
          <Send />
          Send Notification
        </Button>
      }
    >
      <StatsGrid
        items={[
          {
            title: 'Total Sent',
            value: countSends(notifications),
            icon: <Send className='size-5' />,
          },
          {
            title: 'Deliveries',
            value: notifications.length,
            icon: <Users className='size-5' />,
          },
          {
            title: 'Read',
            value: readCount,
            icon: <Bell className='size-5' />,
          },
          {
            title: 'Unread',
            value: notifications.length - readCount,
            icon: <BellRing className='size-5' />,
          },
        ]}
      />
      <Table
        title='Notification History'
        columns={columns}
        data={notifications}
        isLoading={isLoading}
        isError={isError}
        emptyMessage='Nothing sent yet. Send a notification to get started.'
        canExportCSV
      />
      {isSendModalOpen && (
        <SendNotificationModal onClose={() => setIsSendModalOpen(false)} />
      )}
    </PageLayout>
  );
};
