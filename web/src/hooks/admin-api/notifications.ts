import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { fetchWithToken } from '@/hooks/apiConfig';
import { showErrorToast } from '@/utils/errorToast';

interface SendNotificationVariables {
  title: string;
  message: string;
  userIds: string[];
  groupIds: string[];
}

export const useSendNotification = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: SendNotificationVariables) =>
      fetchWithToken<{ recipientCount: number }>({
        url: '/notifications',
        method: 'POST',
        data,
      }),
    onSuccess: ({ data }) =>
      toast.success(
        `Success: Sent to ${data.recipientCount} ${data.recipientCount === 1 ? 'person' : 'people'}`,
      ),
    onError: error =>
      showErrorToast({ title: 'Could not send the notification', error }),
  });
  return { sendNotification: mutateAsync, isPending };
};
