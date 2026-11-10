import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, PressableProps } from 'react-native';

import { useThemeStore } from '../../store/useThemeStore';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'error' | 'text';

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'lg';
  iconLeft?: keyof typeof Ionicons.glyphMap;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  label,
  variant = 'primary',
  size = 'lg',
  iconLeft,
  isLoading = false,
  fullWidth = false,
  disabled,
  testID,
  ...props
}: ButtonProps) => {
  const themeColors = useThemeStore(s => s.themeColors);

  const background = {
    primary: themeColors.primary,
    secondary: themeColors.card,
    error: themeColors.error,
    text: 'transparent',
  }[variant];
  const foreground = {
    primary: themeColors.onPrimary,
    secondary: themeColors.text,
    error: '#ffffff',
    text: themeColors.primary,
  }[variant];

  return (
    <Pressable
      accessibilityRole='button'
      testID={testID && `${testID}_button`}
      disabled={disabled || isLoading}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        height: size === 'lg' ? 46 : 34,
        paddingHorizontal: size === 'lg' ? 20 : 12,
        borderRadius: 10,
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: themeColors.outline,
        backgroundColor: background,
        opacity: disabled || isLoading ? 0.5 : pressed ? 0.8 : 1,
      })}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <>
          {iconLeft && (
            <Ionicons
              name={iconLeft}
              size={size === 'lg' ? 18 : 15}
              color={foreground}
            />
          )}
          <Text
            variant={size === 'lg' ? 'subtitle1' : 'body1'}
            weight='semibold'
            style={{ color: foreground }}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};
