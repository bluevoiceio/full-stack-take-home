import type { ColumnDef } from '@tanstack/react-table';
import { Building2, Shield, User as UserIcon, Users } from 'lucide-react';
import { useMemo } from 'react';

import { PageLayout, StatsGrid, Table } from '@/components/shared';
import {
  useGetUnitsByDepartmentId,
  useGetUsersByDepartmentId,
} from '@/hooks/admin-api';
import type { User } from '@/types/api-types';
import { fullName } from '@/utils/format-utils';

export const DepartmentUsers = () => {
  const { users, isLoading, isError } = useGetUsersByDepartmentId();
  const { units } = useGetUnitsByDepartmentId();

  const columns = useMemo<ColumnDef<User>[]>(() => {
    const nameByEmail = new Map(
      users.map(user => [user.email, fullName(user)]),
    );
    return [
      { header: 'Email', id: 'email', accessorKey: 'email', size: 300 },
      {
        header: 'First Name',
        id: 'firstName',
        accessorKey: 'firstName',
        size: 140,
      },
      {
        header: 'Last Name',
        id: 'lastName',
        accessorKey: 'lastName',
        size: 140,
      },
      { header: 'Title', id: 'title', accessorKey: 'title', size: 150 },
      {
        header: 'Employee ID',
        id: 'employeeId',
        accessorKey: 'employeeId',
        size: 140,
      },
      {
        header: 'Reports To',
        id: 'reportsTo',
        accessorFn: user =>
          (user.superiorEmail && nameByEmail.get(user.superiorEmail)) ?? '—',
        size: 170,
      },
      { header: 'Role', id: 'role', accessorKey: 'role', size: 120 },
    ];
  }, [users]);

  return (
    <PageLayout
      title='Users'
      description='Everyone in your department directory.'
    >
      <StatsGrid
        items={[
          {
            title: 'Total Users',
            value: users.length,
            icon: <Users className='size-5' />,
          },
          {
            title: 'Admins',
            value: users.filter(user => user.role === 'admin').length,
            icon: <Shield className='size-5' />,
          },
          {
            title: 'Officers',
            value: users.filter(user => user.role === 'officer').length,
            icon: <UserIcon className='size-5' />,
          },
          {
            title: 'Units',
            value: units.length,
            icon: <Building2 className='size-5' />,
          },
        ]}
      />
      <Table
        title='Users'
        columns={columns}
        data={users}
        isLoading={isLoading}
        isError={isError}
        emptyMessage='No users in this department.'
        canExportCSV
      />
    </PageLayout>
  );
};
