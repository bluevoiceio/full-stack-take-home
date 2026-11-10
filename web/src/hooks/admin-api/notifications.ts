import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { fetchWithToken, queryClient } from '@/hooks/apiConfig';
import { useActiveUser } from '@/hooks/useActiveUser';
import type { Notification } from '@/types/api-types';
import { showErrorToast } from '@/utils/errorToast';

const historyQueryKey = (departmentId?: string) => [
  'departments',
  departmentId,
  'notifications',
  'history',
];

// One row per recipient, newest first.
export const useGetNotificationHistory = () => {
  const { departmentId } = useActiveUser();
  const { data, isLoading, isError } = useQuery({
    queryKey: historyQueryKey(departmentId),
    queryFn: () =>
      fetchWithToken<Notification[]>({
        url: '/notifications/history',
        method: 'GET',
      }),
    enabled: !!departmentId,
  });
  return { notifications: data?.data ?? [], isLoading, isError };
};

interface SendNotificationVariables {
  title: string;
  message: string;
  userIds: string[];
  groupIds: string[];
}

export const useSendNotification = () => {
  const { departmentId } = useActiveUser();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: SendNotificationVariables) =>
      fetchWithToken<{ recipientCount: number }>({
        url: '/notifications',
        method: 'POST',
        data,
      }),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: historyQueryKey(departmentId),
      });
      toast.success(
        `Success: Sent to ${data.recipientCount} ${data.recipientCount === 1 ? 'person' : 'people'}`,
      );
    },
    onError: error =>
      showErrorToast({ title: 'Could not send the notification', error }),
  });
  return { sendNotification: mutateAsync, isPending };
};
