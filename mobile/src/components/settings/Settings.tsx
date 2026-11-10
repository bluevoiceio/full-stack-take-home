import { Switch, View } from 'react-native';

import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Button, Card, PageWrapper, Text } from '../shared';
import { fullName } from '../utils';

export const Settings = () => {
  const { user, signOut } = useAuthStore();
  const { theme, themeColors, toggleTheme } = useThemeStore();

  return (
    <PageWrapper title='Settings'>
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {user && (
          <Card style={{ gap: 2 }}>
            <Text variant='subtitle1' weight='semibold'>
              {fullName(user)}
            </Text>
            <Text color='mutedText'>{user.email}</Text>
          </Card>
        )}
        <Card
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text variant='subtitle1'>Dark mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ true: themeColors.primary }}
          />
        </Card>
        <Button
          label='Sign out'
          variant='secondary'
          iconLeft='log-out-outline'
          fullWidth
          onPress={signOut}
        />
      </View>
    </PageWrapper>
  );
};
