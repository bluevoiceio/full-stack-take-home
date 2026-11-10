import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useThemeStore } from '../../store/useThemeStore';
import { IconName } from './Icon';
import { Text, TextVariant } from './Text';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'link'
  | 'text'
  | 'error'
  | 'success'
  | 'subtle'
  | 'muted';

const SOLID_VARIANTS = ['primary', 'error', 'success'] as const;
type SolidVariant = (typeof SOLID_VARIANTS)[number];

const isSolid = (variant: ButtonVariant): variant is SolidVariant =>
  SOLID_VARIANTS.includes(variant as SolidVariant);

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  /** Pill shape. */
  rounded?: boolean;
  /** Leave out for an icon-only button, and pass `accessibilityLabel` instead. */
  label?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  isLoading?: boolean;
  fullWidth?: boolean;
  textVariant?: TextVariant;
  style?: StyleProp<ViewStyle>;
}

export const Button = ({
  variant = 'primary',
  size = 'lg',
  rounded = false,
  label,
  iconLeft,
  iconRight,
  isLoading = false,
  fullWidth = false,
  textVariant,
  style,
  disabled,
  testID,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  ...props
}: ButtonProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isDisabled = !!disabled && !isLoading;
  const isActive = pressed || hovered;

  const solid = {
    primary: {
      background: themeColors.primary,
      active: themeColors.primaryActive,
      text: themeColors.onPrimary,
    },
    error: {
      background: themeColors.error,
      active: themeColors.errorActive,
      text: themeColors.onError,
    },
    success: {
      background: themeColors.success,
      active: themeColors.successActive,
      text: themeColors.onSuccess,
    },
  };

  const backgroundColor = isSolid(variant)
    ? isDisabled
      ? themeColors.disabledBackground
      : isActive
        ? solid[variant].active
        : solid[variant].background
    : variant === 'subtle'
      ? isActive
        ? themeColors.mutedBackground
        : themeColors.subtleBackground
      : isActive
        ? themeColors.subtleBackground
        : 'transparent';

  const color = isDisabled
    ? themeColors.disabledText
    : isSolid(variant)
      ? solid[variant].text
      : variant === 'text'
        ? themeColors.text
        : variant === 'muted'
          ? themeColors.disabledText
          : themeColors.subtleText;

  const iconSize = size === 'sm' ? 18 : size === 'md' ? 19 : 20;

  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      accessibilityLabel={label}
      testID={testID ? `${testID}_button` : 'button'}
      disabled={disabled || isLoading}
      onPressIn={event => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={event => {
        setPressed(false);
        onPressOut?.(event);
      }}
      onHoverIn={event => {
        setHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={event => {
        setHovered(false);
        onHoverOut?.(event);
      }}
      style={[
        styles.button,
        size === 'sm' && styles.small,
        size === 'md' && styles.medium,
        !label && {
          paddingHorizontal: size === 'sm' ? 5 : size === 'md' ? 7.5 : 10,
        },
        rounded && { borderRadius: 100 },
        {
          backgroundColor,
          borderWidth: 1,
          borderColor:
            variant === 'secondary' ? themeColors.subtleText : 'transparent',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: isLoading ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {isLoading && <ActivityIndicator color={color} />}
      {iconLeft && <Ionicons name={iconLeft} size={iconSize} color={color} />}
      {!!label && (
        <Text
          variant={textVariant ?? (size === 'sm' ? 'subtitle2' : 'subtitle1')}
          weight='semiBold'
          numberOfLines={1}
          style={{
            color,
            textDecorationLine: variant === 'link' ? 'underline' : 'none',
          }}
        >
          {label}
        </Text>
      )}
      {iconRight && <Ionicons name={iconRight} size={iconSize} color={color} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  small: { paddingVertical: 5, paddingHorizontal: 10, gap: 5 },
  medium: { paddingVertical: 8, paddingHorizontal: 15, gap: 8 },
});
