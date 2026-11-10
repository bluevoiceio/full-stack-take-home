import { ChevronDown } from 'lucide-react';

import { Popover } from '@/components/shared';
import type { User } from '@/types/api-types';
import { fullName } from '@/utils/format-utils';

export const GroupMembersCell = ({ members }: { members: User[] }) => {
  if (members.length === 0) {
    return <span className='text-muted-foreground'>No members</span>;
  }

  const countLabel = `${members.length} ${members.length === 1 ? 'member' : 'members'}`;

  return (
    <Popover
      className='w-72'
      triggerLabel={`${countLabel}. Click to view.`}
      triggerClassName='flex items-center gap-1.5 rounded-md px-2 py-1 text-left font-semibold transition-colors hover:bg-accent'
      trigger={
        <>
          <span className='text-muted-foreground'>{countLabel}</span>
          <ChevronDown className='size-4 text-muted-foreground' />
        </>
      }
    >
      {() => (
        <>
          <div className='border-b px-3 py-2'>
            <p className='text-sm font-medium'>Members ({members.length})</p>
          </div>
          <div className='max-h-64 space-y-1 overflow-y-auto p-2'>
            {members.map(member => (
              <div
                key={member.id}
                className='flex items-center justify-between gap-2 rounded-md bg-accent/40 px-2 py-1.5 text-sm'
              >
                <div className='flex min-w-0 flex-col'>
                  <span className='truncate font-medium'>
                    {fullName(member)}
                  </span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {member.email}
                  </span>
                </div>
                <span className='ml-2 shrink-0 text-xs font-medium text-muted-foreground'>
                  {member.title}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Popover>
  );
};
