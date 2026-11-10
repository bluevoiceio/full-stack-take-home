import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '../../store/useThemeStore';
import { Button } from './Button';
import { Text } from './Text';

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  /** Buttons shown at the end of the header row. */
  rightActions?: ReactNode;
  children: ReactNode;
}

export const PageWrapper = ({
  title,
  subtitle,
  showBackButton = false,
  rightActions,
  children,
}: PageWrapperProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  const insets = useSafeAreaInsets();
  const hasHeader = Boolean(
    title || subtitle || showBackButton || rightActions,
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'web' ? 20 : insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: themeColors.background,
      }}
    >
      {hasHeader && (
        <View style={styles.header}>
          {showBackButton && router.canGoBack() && (
            <Button
              testID='page-header_back'
              variant='subtle'
              iconLeft='chevron-back'
              accessibilityLabel='Back'
              onPress={() => router.back()}
              rounded
            />
          )}
          <View style={{ flex: 1 }}>
            {title && (
              <Text
                variant='h3'
                weight='bold'
                color='subtleText'
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text color='subtleText' numberOfLines={2}>
                {subtitle}
              </Text>
            )}
          </View>
          {rightActions && (
            <View style={styles.rightActions}>{rightActions}</View>
          )}
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 10,
  },
  rightActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
