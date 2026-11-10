import {
  Bell,
  Building2,
  type LucideIcon,
  Shield,
  User as UserIcon,
  UserPlus,
  Users,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';

import { SendNotificationModal } from '@/components/dashboard/notifications/SendNotificationModal';
import { Button, Card, PageLayout, StatsGrid } from '@/components/shared';
import {
  useGetDepartment,
  useGetGroupsByDepartmentId,
  useGetNotificationHistory,
  useGetUnitsByDepartmentId,
  useGetUsersByDepartmentId,
} from '@/hooks/admin-api';
import { useActiveUser } from '@/hooks/useActiveUser';
import { formatUTCDateString } from '@/utils/format-utils';

interface WidgetProps {
  title: string;
  icon: LucideIcon;
  href: string;
  children: ReactNode;
}

const Widget = ({ title, icon: Icon, href, children }: WidgetProps) => (
  <Card className='flex h-full flex-col'>
    <div className='flex items-center justify-between p-6 pb-3'>
      <h2 className='flex items-center gap-2 text-base leading-none font-semibold tracking-tight'>
        <Icon className='size-4' />
        {title}
      </h2>
      <Link
        to={href}
        className='inline-flex h-7 items-center rounded-md px-3 text-xs font-medium transition-colors hover:bg-accent'
      >
        View All
      </Link>
    </div>
    <div className='flex-1 p-6 pt-0'>{children}</div>
  </Card>
);

const EmptyState = ({
  icon: Icon,
  message,
}: {
  icon: LucideIcon;
  message: string;
}) => (
  <div className='flex flex-col items-center justify-center py-6 text-center'>
    <Icon className='size-8 text-muted-foreground' />
    <p className='mt-2 text-sm text-muted-foreground'>{message}</p>
  </div>
);

const Row = ({ label, detail }: { label: string; detail: ReactNode }) => (
  <div className='flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3'>
    <p className='min-w-0 truncate text-sm font-semibold'>{label}</p>
    <div className='shrink-0 text-xs font-medium text-muted-foreground'>
      {detail}
    </div>
  </div>
);

export const DashboardHome = () => {
  const { user } = useActiveUser();
  const { department } = useGetDepartment();
  const { users } = useGetUsersByDepartmentId();
  const { groups } = useGetGroupsByDepartmentId();
  const { units } = useGetUnitsByDepartmentId();
  const { notifications } = useGetNotificationHistory();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const adminCount = users.filter(u => u.role === 'admin').length;
  const officerCount = users.length - adminCount;
  // History has a row per recipient, so collapse it back to one line per send.
  const recentSends = [
    ...new Map(
      notifications.map(row => [`${row.title}|${row.createdAt}`, row]),
    ).values(),
  ].slice(0, 3);

  return (
    <PageLayout
      title={`Welcome back, ${user?.firstName ?? ''}`}
      description={
        department &&
        `${department.name} · ${department.city}, ${department.state}`
      }
    >
      <StatsGrid
        items={[
          {
            title: 'Total Users',
            value: users.length,
            subline: `${adminCount} admins, ${officerCount} officers`,
            icon: <Users className='size-5' />,
            href: '/dashboard/users',
          },
          {
            title: 'Groups',
            value: groups.length,
            icon: <Shield className='size-5' />,
            href: '/dashboard/groups',
          },
          {
            title: 'Units',
            value: units.length,
            subline: units.find(unit => unit.default)?.name,
            icon: <Building2 className='size-5' />,
          },
          {
            title: 'Notifications Sent',
            value: notifications.length,
            icon: <Bell className='size-5' />,
            href: '/dashboard/notifications',
          },
        ]}
      />

      <div className='rounded-xl border bg-card p-5 shadow-xs'>
        <h2 className='mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase'>
          Quick Actions
        </h2>
        <div className='flex flex-wrap gap-3'>
          <Button
            variant='secondary'
            className='h-auto gap-2 px-4 py-3'
            onClick={() => setIsSendModalOpen(true)}
          >
            <Bell />
            <span className='font-medium'>Send Notification</span>
          </Button>
          <Link
            to='/dashboard/groups'
            className='inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent'
          >
            <UserPlus className='size-4' />
            Manage Groups
          </Link>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Widget title='Team' icon={Users} href='/dashboard/users'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between rounded-lg bg-muted/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-full bg-muted p-2'>
                  <Users className='size-4 text-muted-foreground' />
                </div>
                <p className='text-sm font-semibold'>Total members</p>
              </div>
              <p className='text-lg font-bold tabular-nums'>{users.length}</p>
            </div>
            <div className='flex gap-3'>
              {[
                { label: 'Admins', count: adminCount, icon: Shield },
                { label: 'Officers', count: officerCount, icon: UserIcon },
              ].map(({ label, count, icon: Icon }) => (
                <div
                  key={label}
                  className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted/50 p-3 text-center'
                >
                  <Icon className='size-4 text-muted-foreground' />
                  <div>
                    <p className='text-lg font-bold tabular-nums'>{count}</p>
                    <p className='text-xs font-medium text-muted-foreground'>
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Widget>

        <Widget title='Groups' icon={Shield} href='/dashboard/groups'>
          {groups.length === 0 ? (
            <EmptyState icon={Shield} message='No groups yet' />
          ) : (
            <div className='flex flex-col gap-2'>
              {groups.slice(0, 4).map(group => (
                <Row
                  key={group.id}
                  label={group.name}
                  detail={`${group.members.length} members`}
                />
              ))}
            </div>
          )}
        </Widget>

        <Widget
          title='Recent Notifications'
          icon={Bell}
          href='/dashboard/notifications'
        >
          {recentSends.length === 0 ? (
            <EmptyState icon={Bell} message='No notifications sent yet' />
          ) : (
            <div className='flex flex-col gap-2'>
              {recentSends.map(row => (
                <Row
                  key={row.id}
                  label={row.title}
                  detail={formatUTCDateString({
                    utcDateString: row.createdAt,
                    variant: 'date-only',
                  })}
                />
              ))}
            </div>
          )}
        </Widget>
      </div>

      {isSendModalOpen && (
        <SendNotificationModal onClose={() => setIsSendModalOpen(false)} />
      )}
    </PageLayout>
  );
};
