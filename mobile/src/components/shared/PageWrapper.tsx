import { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '../../store/useThemeStore';
import { Text } from './Text';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const PageWrapper = ({
  title,
  subtitle,
  children,
}: PageWrapperProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 12,
        backgroundColor: themeColors.background,
      }}
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text variant='h3' weight='bold'>
          {title}
        </Text>
        {subtitle && (
          <Text color='mutedText' style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
};
