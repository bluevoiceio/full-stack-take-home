import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ActionsMenu } from '@/components/shared';
import {
  useDeleteGroup,
  useGetGroupsByDepartmentId,
  useSaveGroup,
} from '@/hooks/admin-api';
import type { GroupResponse } from '@/types/api-types';
import { formatUTCDateString } from '@/utils/format-utils';

import { GroupMembersCell } from './GroupMembersCell';

type ModalState =
  | { kind: 'closed' }
  | { kind: 'details'; group: GroupResponse | null }
  | { kind: 'delete'; group: GroupResponse };

// Owns the page's table columns and modal state, so the page component only lays things out.
export const useDepartmentGroups = () => {
  const { groups, isLoading, isError } = useGetGroupsByDepartmentId();
  const { saveGroup, isPending: isSaving } = useSaveGroup();
  const { deleteGroup, isPending: isDeleting } = useDeleteGroup();
  const [modal, setModal] = useState<ModalState>({ kind: 'closed' });

  const columns = useMemo<ColumnDef<GroupResponse>[]>(
    () => [
      {
        header: 'Actions',
        id: 'actions',
        cell: info => {
          const group = info.row.original;
          return (
            <ActionsMenu
              items={[
                {
                  label: 'Edit',
                  icon: Pencil,
                  onClick: () => setModal({ kind: 'details', group }),
                },
                {
                  label: 'Delete',
                  icon: Trash2,
                  iconStyle: 'text-destructive',
                  onClick: () => setModal({ kind: 'delete', group }),
                },
              ]}
            />
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
        size: 130,
      },
      { header: 'Name', id: 'name', accessorKey: 'name', size: 240 },
      {
        header: 'Members',
        id: 'members',
        accessorFn: group => group.members.length,
        cell: info => <GroupMembersCell members={info.row.original.members} />,
        enableColumnFilter: false,
        size: 150,
      },
      {
        header: 'Created',
        id: 'createdAt',
        accessorFn: group =>
          formatUTCDateString({
            utcDateString: group.createdAt,
            variant: 'date-only',
          }),
        size: 150,
      },
      {
        header: 'Updated',
        id: 'updatedAt',
        accessorFn: group =>
          formatUTCDateString({
            utcDateString: group.updatedAt,
            variant: 'date-only',
          }),
        size: 150,
      },
    ],
    [],
  );

  return {
    groups,
    columns,
    isLoading,
    isError,
    modal,
    isSaving,
    isDeleting,
    openCreateModal: () => setModal({ kind: 'details', group: null }),
    closeModal: () => setModal({ kind: 'closed' }),
    saveGroup,
    deleteGroup,
  };
};
