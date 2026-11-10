import { useEffect } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '../../store/useThemeStore';
import { useToastStore } from '../../store/useToastStore';
import { Text } from './Text';

const TOAST_DURATION_MS = 4000;

export const GlobalToastHost = () => {
  const themeColors = useThemeStore(s => s.themeColors);
  const { toast, hide } = useToastStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(hide, TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [toast, hide]);

  if (!toast) return null;

  return (
    <Pressable
      onPress={hide}
      accessibilityRole='alert'
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderColor:
          toast.variant === 'error' ? themeColors.error : themeColors.success,
        backgroundColor: themeColors.card,
      }}
    >
      <Text weight='semibold' testID='toastText1'>
        {toast.title}
      </Text>
      {toast.caption && (
        <Text variant='caption' color='subtleText' testID='toastText2'>
          {toast.caption}
        </Text>
      )}
    </Pressable>
  );
};
