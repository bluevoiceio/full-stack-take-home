import { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { useThemeStore } from '../../store/useThemeStore';

interface CardProps extends Omit<PressableProps, 'style' | 'children'> {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export const Card = ({
  onPress,
  style,
  iconLeft,
  iconRight,
  children,
  ...props
}: CardProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          shadowColor: themeColors.shadow,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
      {...props}
    >
      {iconLeft}
      <View style={{ flex: 1, gap: 10 }}>{children}</View>
      {iconRight}
    </Pressable>
  );
};

interface CardSectionProps extends ViewProps {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const CardHeader = ({
  style,
  iconLeft,
  iconRight,
  children,
  ...props
}: CardSectionProps) => (
  <View style={styles.header} {...props}>
    {iconLeft}
    <View style={[styles.headerBody, style]}>{children}</View>
    {iconRight}
  </View>
);

export const CardContent = ({
  style,
  iconLeft,
  iconRight,
  children,
  ...props
}: CardSectionProps) => (
  <View style={styles.content} {...props}>
    {iconLeft}
    <View style={[{ flex: 1, gap: 2 }, style]}>{children}</View>
    {iconRight}
  </View>
);

export const CardFooter = ({ style, ...props }: ViewProps) => (
  <View style={[styles.footer, style]} {...props} />
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    gap: 8,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    elevation: 4,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  headerBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  content: { flexDirection: 'row', gap: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
  },
});
