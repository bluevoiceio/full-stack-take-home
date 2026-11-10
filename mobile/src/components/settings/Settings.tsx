import { ScrollView, Switch, View } from 'react-native';

import { useGetDepartment } from '../../hooks/api/accountApi';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Button, PageWrapper, SettingsCard } from '../shared';
import { fullName } from '../utils';

export const Settings = () => {
  const { user, signOut } = useAuthStore();
  const { theme, themeColors, toggleTheme } = useThemeStore();
  const { department } = useGetDepartment();

  return (
    <PageWrapper title='Settings'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      >
        <View style={{ gap: 10 }}>
          {user && (
            <SettingsCard
              icon='person-circle-outline'
              title={fullName(user)}
              description={`${user.title}\n${user.email}`}
            />
          )}
          {department && (
            <SettingsCard
              icon='business-outline'
              title={department.name}
              description={`${department.city}, ${department.state}`}
            />
          )}
          <SettingsCard
            icon='moon-outline'
            title='Dark Mode'
            description='Switch between light and dark mode'
            action={
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{
                  true: themeColors.primary,
                  false: themeColors.subtleBackground,
                }}
              />
            }
          />
          <Button
            testID='settings_log-out'
            variant='error'
            label='Log Out'
            iconLeft='log-out-outline'
            onPress={signOut}
            fullWidth
            rounded
          />
        </View>
      </ScrollView>
    </PageWrapper>
  );
};
