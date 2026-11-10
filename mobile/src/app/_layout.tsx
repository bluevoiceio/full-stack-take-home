import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
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

  const [areFontsLoaded] = useFonts({
    'Inter-Light': require('../../assets/fonts/Inter-Light.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.ttf'),
  });

  useEffect(() => {
    setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
  }, [deviceTheme, setTheme]);

  if (!areFontsLoaded) return null;

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
