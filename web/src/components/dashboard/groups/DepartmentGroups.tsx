import { Plus } from 'lucide-react';

import { Button, Modal, PageLayout, Table } from '@/components/shared';

import { GroupDetailsModal } from './GroupDetailsModal';
import { useDepartmentGroups } from './useDepartmentGroups';

export const DepartmentGroups = () => {
  const {
    groups,
    columns,
    isLoading,
    isError,
    modal,
    isSaving,
    isDeleting,
    openCreateModal,
    closeModal,
    saveGroup,
    deleteGroup,
  } = useDepartmentGroups();

  return (
    <PageLayout
      title='Groups'
      description='Organize department users into reusable groups.'
      actions={
        <Button onClick={openCreateModal}>
          <Plus className='size-4' />
          Create group
        </Button>
      }
    >
      <Table
        title='Groups'
        columns={columns}
        data={groups}
        canExportCSV
        isLoading={isLoading}
        isError={isError}
        emptyMessage='No groups yet. Create one to get started.'
      />

      {modal.kind === 'details' && (
        <GroupDetailsModal
          key={modal.group?.id ?? 'new'}
          group={modal.group}
          onClose={closeModal}
          onSubmit={values => saveGroup({ group: modal.group, ...values })}
          isPending={isSaving}
        />
      )}
      {modal.kind === 'delete' && (
        <Modal
          isOpen
          variant='error'
          title={`Delete ${modal.group.name}?`}
          body={
            <p className='text-sm text-muted-foreground'>
              The group is removed for everyone. Its members stay in the
              department.
            </p>
          }
          confirmButtonLabel='Delete'
          isConfirmLoading={isDeleting}
          onClose={closeModal}
          onConfirm={() =>
            deleteGroup({ group: modal.group }, { onSuccess: closeModal })
          }
        />
      )}
    </PageLayout>
  );
};
