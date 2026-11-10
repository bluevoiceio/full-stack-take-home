import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  useGetDepartment,
  useGetDepartmentUsers,
} from '../../hooks/api/accountApi';
import { useGetUserNotifications } from '../../hooks/api/notificationsApi';
import { useAuthStore } from '../../store/useAuthStore';
import { Button, Card, PageWrapper, Text } from '../shared';
import { fullName } from '../utils';

export const Home = () => {
  const user = useAuthStore(state => state.user);
  const { department } = useGetDepartment();
  const { users } = useGetDepartmentUsers();
  const { unreadCount } = useGetUserNotifications();

  if (!user) return null;

  const superior = users.find(u => u.email === user.superiorEmail);
  const reports = users.filter(u => u.superiorEmail === user.email);

  return (
    <PageWrapper title={`Hi, ${user.firstName}`} subtitle={department?.name}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 12,
        }}
      >
        <Card style={{ gap: 2 }}>
          <Text variant='caption' color='mutedText'>
            {user.employeeId}
          </Text>
          <Text variant='h5' weight='semibold'>
            {fullName(user)}
          </Text>
          <Text color='subtleText'>{user.title}</Text>
          {superior && (
            <Text color='mutedText' style={{ marginTop: 8 }}>
              Reports to {superior.title} {fullName(superior)}
            </Text>
          )}
        </Card>

        <Card style={{ gap: 10 }}>
          <Text variant='subtitle1' weight='semibold'>
            {unreadCount === 0
              ? 'You are all caught up'
              : `${unreadCount} unread ${unreadCount === 1 ? 'alert' : 'alerts'}`}
          </Text>
          <Button
            label='Open alerts'
            size='sm'
            variant='secondary'
            iconLeft='notifications-outline'
            onPress={() => router.navigate('/alerts')}
          />
        </Card>

        {reports.length > 0 && (
          <Card style={{ gap: 10 }}>
            <Text variant='subtitle1' weight='semibold'>
              Your team
            </Text>
            {reports.map(report => (
              <View
                key={report.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>{fullName(report)}</Text>
                <Text color='mutedText'>{report.title}</Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </PageWrapper>
  );
};
