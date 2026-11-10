import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import {
  useGetDepartment,
  useGetDepartmentUsers,
} from '../../hooks/api/accountApi';
import { useGetUserNotifications } from '../../hooks/api/notificationsApi';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Card,
  CardContent,
  CardHeader,
  Icon,
  PageWrapper,
  SettingsCard,
  Text,
} from '../shared';
import { fullName } from '../utils';

export const Home = () => {
  const user = useAuthStore(state => state.user);
  const { department } = useGetDepartment();
  const { users } = useGetDepartmentUsers();
  const {
    notifications,
    unreadCount,
    isError: isAlertsError,
  } = useGetUserNotifications();

  if (!user) return null;

  const superior = users.find(u => u.email === user.superiorEmail);
  const reports = users.filter(u => u.superiorEmail === user.email);

  return (
    <PageWrapper title={`Hi, ${user.firstName}`} subtitle={department?.name}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, gap: 10 }}
      >
        <SettingsCard
          icon='person-circle-outline'
          title={`${user.title} ${fullName(user)}`}
          description={
            superior
              ? `${user.employeeId}\nReports to ${superior.title} ${fullName(superior)}`
              : user.employeeId
          }
        />

        <SettingsCard
          icon={unreadCount === 0 ? 'notifications-outline' : 'notifications'}
          iconColor={unreadCount === 0 ? 'subtleText' : 'info'}
          title={
            isAlertsError
              ? 'Could not load your alerts'
              : !notifications
                ? 'Checking your alerts…'
                : unreadCount === 0
                  ? 'You are all caught up'
                  : `${unreadCount} unread ${unreadCount === 1 ? 'alert' : 'alerts'}`
          }
          description='Messages from your department'
          action={<Icon name='chevron-forward' size={20} color='mutedText' />}
          onPress={() => router.navigate('/alerts')}
        />

        {reports.length > 0 && (
          <Card>
            <CardHeader>
              <Text variant='subtitle1' weight='semiBold'>
                Your team
              </Text>
            </CardHeader>
            <CardContent style={{ gap: 6 }}>
              {reports.map(report => (
                <View
                  key={report.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text>{fullName(report)}</Text>
                  <Text color='subtleText'>{report.title}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </PageWrapper>
  );
};
