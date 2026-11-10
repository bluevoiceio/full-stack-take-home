import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '../api/queryClient';
import { GlobalToastHost } from '../components/shared';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export default function RootLayout() {
  const deviceTheme = useColorScheme();
  const { theme, themeColors, setTheme } = useThemeStore();
  const isSignedIn = useAuthStore(state => !!state.accessToken);

  useEffect(() => {
    setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
  }, [deviceTheme, setTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themeColors.background },
          }}
        >
          <Stack.Protected guard={isSignedIn}>
            <Stack.Screen name='(tabs)' />
          </Stack.Protected>
          <Stack.Protected guard={!isSignedIn}>
            <Stack.Screen name='login' />
          </Stack.Protected>
        </Stack>
        <GlobalToastHost />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
