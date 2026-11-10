import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button, type TableColumn } from '@/components/shared';
import {
  useDeleteGroup,
  useGetGroupsByDepartmentId,
  useSaveGroup,
} from '@/hooks/admin-api';
import type { GroupResponse } from '@/types/api-types';
import { formatUTCDateString, fullName } from '@/utils/format-utils';

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

  const columns = useMemo<TableColumn<GroupResponse>[]>(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        className: 'px-4 py-1.5',
        cell: group => (
          <div className='flex gap-1'>
            <Button
              variant='ghost'
              size='icon'
              aria-label={`Edit ${group.name}`}
              onClick={() => setModal({ kind: 'details', group })}
            >
              <Pencil className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              aria-label={`Delete ${group.name}`}
              onClick={() => setModal({ kind: 'delete', group })}
            >
              <Trash2 className='size-4 text-destructive' />
            </Button>
          </div>
        ),
      },
      {
        id: 'name',
        header: 'Name',
        cell: group => <span className='font-medium'>{group.name}</span>,
      },
      {
        id: 'members',
        header: 'Members',
        cell: group => (
          <span title={group.members.map(fullName).join(', ')}>
            {group.members.length}
          </span>
        ),
      },
      {
        id: 'updatedAt',
        header: 'Updated',
        cell: group => formatUTCDateString({ utcDateString: group.updatedAt }),
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
