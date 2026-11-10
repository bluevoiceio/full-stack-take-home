import { useMutation, useQuery } from '@tanstack/react-query';

import { API } from '../../api/api';
import { queryClient } from '../../api/queryClient';
import { showErrorToast } from '../../components/errorToast';
import { useAuthStore } from '../../store/useAuthStore';

export const useGetUserNotifications = () => {
  const userId = useAuthStore(state => state.user?.id);
  const {
    data: notifications,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => API.getUserNotifications(),
    enabled: !!userId,
    select: response => response.data,
  });
  // The single source for every unread badge.
  const unreadCount = notifications?.filter(n => !n.read).length ?? 0;
  return {
    notifications,
    unreadCount,
    isLoading,
    isRefetching,
    isError,
    refetch,
  };
};

export const useMarkUserNotificationAsRead = () => {
  const { mutate: markUserNotificationAsRead } = useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      API.setUserNotificationRead({ notificationId, read: true }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: error =>
      showErrorToast({ title: 'Could not mark the alert as read', error }),
  });
  return { markUserNotificationAsRead };
};

export const useDeleteUserNotification = () => {
  const { mutate: deleteUserNotification, isPending } = useMutation({
    mutationFn: ({ notificationId }: { notificationId: string }) =>
      API.deleteUserNotification({ notificationId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
    onError: error =>
      showErrorToast({ title: 'Could not delete the alert', error }),
  });
  return { deleteUserNotification, isPending };
};
