import { useState } from 'react';

import {
  FormInput,
  inputStyles,
  Modal,
  UserChecklist,
} from '@/components/shared';
import {
  useGetGroupsByDepartmentId,
  useGetUsersByDepartmentId,
  useSendNotification,
} from '@/hooks/admin-api';
import { cn } from '@/utils/cn';

export const SendNotificationModal = ({ onClose }: { onClose: () => void }) => {
  const { users } = useGetUsersByDepartmentId();
  const { groups } = useGetGroupsByDepartmentId();
  const { sendNotification, isPending } = useSendNotification();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);

  const canSend =
    !!title.trim() && !!message.trim() && groupIds.length + userIds.length > 0;

  const toggleGroup = (id: string) =>
    setGroupIds(previous =>
      previous.includes(id)
        ? previous.filter(selected => selected !== id)
        : [...previous, id],
    );

  const handleSend = async () => {
    try {
      await sendNotification({ title, message, groupIds, userIds });
    } catch {
      // The hook has already shown the error, and the form keeps what was typed.
      return;
    }
    onClose();
  };

  return (
    <Modal
      isOpen
      title='Send Notification'
      onClose={onClose}
      onConfirm={handleSend}
      confirmButtonLabel='Send'
      isConfirmLoading={isPending}
      isConfirmDisabled={!canSend}
      body={
        <div className='flex flex-col gap-5'>
          <FormInput
            autoFocus
            required
            label='Title'
            placeholder='Briefing moved'
            value={title}
            maxLength={80}
            onChange={event => setTitle(event.target.value)}
          />
          <label className='flex flex-col gap-2 text-sm leading-none font-medium'>
            <span>
              Message<span className='ml-0.5 text-destructive'>*</span>
            </span>
            <textarea
              rows={4}
              value={message}
              onChange={event => setMessage(event.target.value)}
              className={cn(inputStyles, 'leading-normal font-normal')}
            />
          </label>

          <fieldset>
            <legend className='mb-2 text-sm leading-none font-medium'>
              Groups
            </legend>
            <div className='flex flex-wrap gap-2'>
              {groups.map(group => (
                <button
                  key={group.id}
                  type='button'
                  aria-pressed={groupIds.includes(group.id)}
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    'h-8 rounded-md border px-3 text-xs font-medium shadow-xs transition-colors duration-150',
                    groupIds.includes(group.id)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent',
                  )}
                >
                  {group.name} · {group.members.length}
                </button>
              ))}
            </div>
          </fieldset>

          <UserChecklist
            label='Individual users'
            users={users}
            selectedIds={userIds}
            onChange={setUserIds}
          />
        </div>
      }
    />
  );
};
