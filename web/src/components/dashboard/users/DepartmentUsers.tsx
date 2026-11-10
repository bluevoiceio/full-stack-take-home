import { useMemo } from 'react';

import { PageLayout, Table, type TableColumn } from '@/components/shared';
import { useGetUsersByDepartmentId } from '@/hooks/admin-api';
import type { User } from '@/types/api-types';
import { fullName } from '@/utils/format-utils';

export const DepartmentUsers = () => {
  const { users, isLoading, isError } = useGetUsersByDepartmentId();

  const columns = useMemo<TableColumn<User>[]>(() => {
    const nameByEmail = new Map(
      users.map(user => [user.email, fullName(user)]),
    );
    return [
      {
        id: 'name',
        header: 'Name',
        cell: user => <span className='font-medium'>{fullName(user)}</span>,
      },
      { id: 'title', header: 'Title', cell: user => user.title },
      {
        id: 'employeeId',
        header: 'Employee ID',
        cell: user => <span className='tabular-nums'>{user.employeeId}</span>,
      },
      { id: 'email', header: 'Email', cell: user => user.email },
      {
        id: 'superior',
        header: 'Reports to',
        cell: user =>
          (user.superiorEmail && nameByEmail.get(user.superiorEmail)) ?? '—',
      },
      {
        id: 'role',
        header: 'Role',
        cell: user => (
          <span
            className={
              user.role === 'admin'
                ? 'rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'
                : 'rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
            }
          >
            {user.role}
          </span>
        ),
      },
    ];
  }, [users]);

  return (
    <PageLayout
      title='Users'
      description='Everyone in the department directory.'
    >
      <Table
        title='Users'
        columns={columns}
        data={users}
        getRowId={user => user.id}
        isLoading={isLoading}
        isError={isError}
        emptyMessage='No users in this department.'
      />
    </PageLayout>
  );
};
