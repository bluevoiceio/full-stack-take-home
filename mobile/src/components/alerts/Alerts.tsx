import { FlatList } from 'react-native';

import { Notification } from '../../constants/types';
import { useGetDepartmentUsers } from '../../hooks/api/accountApi';
import {
  useDeleteUserNotification,
  useGetUserNotifications,
  useMarkUserNotificationAsRead,
} from '../../hooks/api/notificationsApi';
import { Button, EmptyState, ListSkeleton, PageWrapper } from '../shared';
import { fullName } from '../utils';
import { NotificationCard } from './NotificationCard';

export const Alerts = () => {
  const { notifications, isRefetching, isError, refetch } =
    useGetUserNotifications();
  const { users } = useGetDepartmentUsers();
  const { markUserNotificationAsRead } = useMarkUserNotificationAsRead();
  const { deleteUserNotification } = useDeleteUserNotification();

  const renderNotification = ({ item }: { item: Notification }) => {
    const sender = users.find(user => user.id === item.senderId);
    return (
      <NotificationCard
        notification={item}
        senderName={sender && fullName(sender)}
        onPress={() => {
          if (!item.read)
            markUserNotificationAsRead({ notificationId: item.id });
        }}
        onDelete={() => deleteUserNotification({ notificationId: item.id })}
      />
    );
  };

  const renderListEmpty = () =>
    isError ? (
      <EmptyState
        icon='cloud-offline-outline'
        title='Could not load your alerts'
        caption='Check your connection and try again.'
        action={
          <Button label='Try again' size='sm' onPress={() => refetch()} />
        }
      />
    ) : !notifications ? (
      <ListSkeleton />
    ) : (
      <EmptyState
        icon='notifications-off-outline'
        title='No alerts'
        caption='Messages from your department will show up here.'
      />
    );

  return (
    <PageWrapper title='Alerts'>
      <FlatList
        data={notifications}
        keyExtractor={notification => notification.id}
        renderItem={renderNotification}
        contentContainerStyle={{
          padding: 20,
          gap: 6,
        }}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={renderListEmpty}
      />
    </PageWrapper>
  );
};
