import { Send } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  Card,
  FormInput,
  PageLayout,
  UserChecklist,
} from '@/components/shared';
import {
  useGetGroupsByDepartmentId,
  useGetUsersByDepartmentId,
  useSendNotification,
} from '@/hooks/admin-api';
import { cn } from '@/utils/cn';

export const DepartmentNotifications = () => {
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
    setTitle('');
    setMessage('');
    setGroupIds([]);
    setUserIds([]);
  };

  return (
    <PageLayout
      title='Notifications'
      description='Send an alert to groups or individual users. It appears in their app.'
    >
      <Card className='max-w-2xl'>
        <form
          className='flex flex-col gap-5 p-6'
          onSubmit={event => {
            event.preventDefault();
            handleSend();
          }}
        >
          <FormInput
            label='Title'
            placeholder='Briefing moved'
            value={title}
            maxLength={80}
            onChange={event => setTitle(event.target.value)}
          />
          <label className='flex flex-col gap-1.5 text-sm font-medium'>
            Message
            <textarea
              rows={4}
              value={message}
              onChange={event => setMessage(event.target.value)}
              className='rounded-md border bg-card px-3 py-2 text-sm font-normal focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
            />
          </label>

          <fieldset>
            <legend className='mb-1.5 text-sm font-medium'>Groups</legend>
            <div className='flex flex-wrap gap-2'>
              {groups.map(group => (
                <button
                  key={group.id}
                  type='button'
                  aria-pressed={groupIds.includes(group.id)}
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-sm',
                    groupIds.includes(group.id)
                      ? 'border-primary bg-primary/10 font-medium text-primary'
                      : 'hover:bg-muted',
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

          <div className='flex justify-end'>
            <Button type='submit' disabled={!canSend} isLoading={isPending}>
              <Send className='size-4' />
              Send notification
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};
