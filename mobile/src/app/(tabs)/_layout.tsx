import { Tabs } from 'expo-router';

import { TabBar, tabBarIcon, useIsLargeScreen } from '../../components/shared';
import { useGetUserNotifications } from '../../hooks/api/notificationsApi';

export default function TabLayout() {
  const { unreadCount } = useGetUserNotifications();
  const isLargeScreen = useIsLargeScreen();

  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isLargeScreen ? 'left' : 'bottom',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: tabBarIcon('home-outline', 'home'),
        }}
      />
      <Tabs.Screen
        name='alerts'
        options={{
          tabBarLabel: 'Alerts',
          tabBarBadge: unreadCount || undefined,
          tabBarIcon: tabBarIcon('notifications-outline', 'notifications'),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: tabBarIcon('settings-outline', 'settings'),
        }}
      />
    </Tabs>
  );
}
