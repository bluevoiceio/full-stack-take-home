import { useState } from 'react';

import { FormInput, Modal, UserChecklist } from '@/components/shared';
import { useGetUsersByDepartmentId } from '@/hooks/admin-api';
import type { GroupResponse } from '@/types/api-types';
import { parseAxiosError } from '@/utils/errorToast';

interface GroupDetailsModalProps {
  // null creates a group.
  group: GroupResponse | null;
  onClose: () => void;
  onSubmit: (values: { name: string; memberIds: string[] }) => Promise<unknown>;
  isPending: boolean;
}

export const GroupDetailsModal = ({
  group,
  onClose,
  onSubmit,
  isPending,
}: GroupDetailsModalProps) => {
  const { users } = useGetUsersByDepartmentId();
  const [name, setName] = useState(group?.name ?? '');
  const [memberIds, setMemberIds] = useState(
    group?.members.map(member => member.id) ?? [],
  );
  const [nameError, setNameError] = useState<string>();

  const handleSubmit = async () => {
    try {
      await onSubmit({ name, memberIds });
      onClose();
    } catch (error) {
      if (parseAxiosError(error).status === 409)
        setNameError('A group with this name already exists');
    }
  };

  return (
    <Modal
      isOpen
      title={group ? 'Edit Group' : 'Create Group'}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmButtonLabel={group ? 'Save changes' : 'Create'}
      isConfirmLoading={isPending}
      isConfirmDisabled={!name.trim()}
      body={
        <div className='flex flex-col gap-5'>
          <FormInput
            autoFocus
            label='Name'
            placeholder='Group name'
            value={name}
            error={nameError}
            maxLength={60}
            onChange={event => {
              setName(event.target.value);
              setNameError(undefined);
            }}
          />
          <UserChecklist
            label='Members'
            users={users}
            selectedIds={memberIds}
            onChange={setMemberIds}
          />
        </div>
      }
    />
  );
};
