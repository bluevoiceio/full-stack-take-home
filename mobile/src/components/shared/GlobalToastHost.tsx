import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeStore } from '../../store/useThemeStore';
import { useToastStore } from '../../store/useToastStore';
import { Icon } from './Icon';
import { Text } from './Text';

const TOAST_DURATION_MS = 4000;
const TINT_OPACITY = { light: 0.1, dark: 0.22 };
const TEXT_STYLE = { fontSize: 15, lineHeight: 20 };

const VARIANTS = {
  success: { icon: 'checkmark-circle', color: 'success' },
  error: { icon: 'alert-circle', color: 'error' },
} as const;

export const GlobalToastHost = () => {
  const { theme, themeColors } = useThemeStore();
  const { toast, hide } = useToastStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(hide, TOAST_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [toast, hide]);

  if (!toast) return null;

  const { icon, color } = VARIANTS[toast.variant];

  return (
    <Pressable
      onPress={hide}
      accessibilityRole='alert'
      style={{
        position: 'absolute',
        top: insets.top + 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '92%',
        maxWidth: 500,
        alignSelf: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: themeColors.card,
        overflow: 'hidden',
        boxShadow:
          theme === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.5)'
            : '0 6px 20px rgba(2, 6, 24, 0.12)',
      }}
    >
      {/* A light wash of the variant colour, so the text stays on a near-neutral surface. */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: themeColors[color],
          opacity: TINT_OPACITY[theme],
        }}
      />
      <Icon name={icon} size={26} color={color} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text
          testID='toastText1'
          weight='semiBold'
          numberOfLines={2}
          style={TEXT_STYLE}
        >
          {toast.title}
        </Text>
        {toast.caption && (
          <Text
            testID='toastText2'
            color='subtleText'
            numberOfLines={3}
            style={TEXT_STYLE}
          >
            {toast.caption}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
