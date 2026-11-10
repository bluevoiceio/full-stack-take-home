import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useGetUserNotifications } from '../../hooks/api/notificationsApi';
import { useThemeStore } from '../../store/useThemeStore';

type IconName = keyof typeof Ionicons.glyphMap;

export default function TabLayout() {
  const themeColors = useThemeStore(s => s.themeColors);
  const { unreadCount } = useGetUserNotifications();

  const tabBarIcon =
    (name: IconName, focusedName: IconName) =>
    ({ focused, size }: { focused: boolean; size: number }) => (
      <Ionicons
        name={focused ? focusedName : name}
        size={size}
        color={focused ? themeColors.primary : themeColors.mutedText}
      />
    );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.mutedText,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopColor: themeColors.border,
        },
        sceneStyle: { backgroundColor: themeColors.background },
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
