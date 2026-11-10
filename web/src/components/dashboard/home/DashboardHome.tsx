import { Building2, User, Users } from 'lucide-react';

import { Card, PageLayout, StatCard } from '@/components/shared';
import {
  useGetDepartment,
  useGetGroupsByDepartmentId,
  useGetUnitsByDepartmentId,
  useGetUsersByDepartmentId,
} from '@/hooks/admin-api';
import { useActiveUser } from '@/hooks/useActiveUser';

export const DashboardHome = () => {
  const { user } = useActiveUser();
  const { department } = useGetDepartment();
  const { users } = useGetUsersByDepartmentId();
  const { groups } = useGetGroupsByDepartmentId();
  const { units } = useGetUnitsByDepartmentId();

  return (
    <PageLayout
      title={`Welcome back, ${user?.firstName ?? ''}`}
      description={
        department &&
        `${department.name} · ${department.city}, ${department.state} · ${department.timezone}`
      }
    >
      <div className='grid gap-6 sm:grid-cols-3'>
        <StatCard label='Users' value={users.length} icon={User} />
        <StatCard label='Groups' value={groups.length} icon={Users} />
        <StatCard label='Units' value={units.length} icon={Building2} />
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <h2 className='border-b px-6 py-4 font-semibold'>Units</h2>
          <ul>
            {units.map(unit => (
              <li
                key={unit.id}
                className='flex items-center justify-between border-b px-6 py-3 text-sm last:border-b-0'
              >
                {unit.name}
                {unit.default && (
                  <span className='rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                    Default
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className='border-b px-6 py-4 font-semibold'>Groups</h2>
          <ul>
            {groups.map(group => (
              <li
                key={group.id}
                className='flex items-center justify-between border-b px-6 py-3 text-sm last:border-b-0'
              >
                {group.name}
                <span className='text-muted-foreground tabular-nums'>
                  {group.members.length} members
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageLayout>
  );
};
