import type { User } from '@/types/api-types';
import { fullName } from '@/utils/format-utils';

interface UserChecklistProps {
  label: string;
  users: User[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export const UserChecklist = ({
  label,
  users,
  selectedIds,
  onChange,
}: UserChecklistProps) => {
  const toggle = (id: string) =>
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(selected => selected !== id)
        : [...selectedIds, id],
    );

  return (
    <fieldset className='flex flex-col gap-1.5'>
      <legend className='mb-1.5 text-sm font-medium'>
        {label}{' '}
        <span className='font-normal text-muted-foreground'>
          ({selectedIds.length} selected)
        </span>
      </legend>
      <div className='max-h-56 overflow-y-auto rounded-md border'>
        {users.map(user => (
          <label
            key={user.id}
            className='flex cursor-pointer items-center gap-3 border-b px-3 py-2 text-sm last:border-b-0 hover:bg-muted/50'
          >
            <input
              type='checkbox'
              className='size-4 accent-primary'
              checked={selectedIds.includes(user.id)}
              onChange={() => toggle(user.id)}
            />
            <span className='flex-1'>{fullName(user)}</span>
            <span className='text-xs text-muted-foreground'>{user.title}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
