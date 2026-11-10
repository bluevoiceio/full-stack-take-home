import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorKey } from '../../constants/Colors';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { Logo } from './Logo';
import { Text } from './Text';

const ICON_SIZE = 30;

/** A wide browser window gets a side drawer. Phones and narrow windows get the floating bar. */
export const useIsLargeScreen = () => {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width > 1000;
};

const useTabColor = (isFocused: boolean): ColorKey => {
  const theme = useThemeStore(s => s.theme);
  const isLargeScreen = useIsLargeScreen();
  if (!isFocused) return 'mutedText';
  return isLargeScreen || theme === 'dark' ? 'onPrimary' : 'primary';
};

/** For a screen's `tabBarIcon` option: the outline icon, filled in when its tab is open. */
export const tabBarIcon =
  (name: IconName, focusedName: IconName) =>
  ({ focused }: { focused: boolean }) => (
    <TabIcon name={focused ? focusedName : name} isFocused={focused} />
  );

const TabIcon = ({
  name,
  isFocused,
}: {
  name: IconName;
  isFocused: boolean;
}) => <Icon name={name} size={ICON_SIZE} color={useTabColor(isFocused)} />;

const Badge = ({ count }: { count: number }) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return (
    <View style={[styles.badge, { backgroundColor: themeColors.error }]}>
      <Text variant='caption' color='onError' style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

interface TabItemProps {
  isFocused: boolean;
  icon: ReactNode;
  label: string;
  badge?: number;
  onPress: () => void;
  accessibilityLabel?: string;
}

const TabButton = ({
  isFocused,
  icon,
  label,
  badge,
  onPress,
  accessibilityLabel,
}: TabItemProps) => {
  const color = useTabColor(isFocused);
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={styles.tabItem}
    >
      <View>
        {icon}
        {!!badge && (
          <View style={styles.tabBadge}>
            <Badge count={badge} />
          </View>
        )}
      </View>
      <Text variant='caption' color={color}>
        {label}
      </Text>
    </Pressable>
  );
};

const DrawerItem = ({
  isFocused,
  icon,
  label,
  badge,
  onPress,
  accessibilityLabel,
}: TabItemProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  const color = useTabColor(isFocused);
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={[
        styles.drawerItem,
        isFocused && { backgroundColor: themeColors.primary },
      ]}
    >
      {icon}
      <Text variant='body1' weight='semiBold' color={color} style={{ flex: 1 }}>
        {label}
      </Text>
      {!!badge && <Badge count={badge} />}
    </Pressable>
  );
};

// Draws the tabs declared in the `(tabs)` layout: a floating pill on phones, a
// side drawer in a wide browser window.
export const TabBar = ({
  state,
  descriptors,
  emitter,
  navigateToTab,
}: BottomTabBarProps) => {
  const { theme, themeColors } = useThemeStore();
  const signOut = useAuthStore(s => s.signOut);
  const { bottom } = useSafeAreaInsets();
  const isLargeScreen = useIsLargeScreen();
  const Item = isLargeScreen ? DrawerItem : TabButton;

  const items = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const onPress = () => {
      const event = emitter.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) navigateToTab(route.key);
    };

    return (
      <Item
        key={route.key}
        isFocused={isFocused}
        icon={options.tabBarIcon?.({
          focused: isFocused,
          color: themeColors.mutedText,
          size: ICON_SIZE,
        })}
        label={
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name)
        }
        badge={options.tabBarBadge ? Number(options.tabBarBadge) : undefined}
        onPress={onPress}
        accessibilityLabel={options.tabBarAccessibilityLabel}
      />
    );
  });

  const surface = {
    backgroundColor: themeColors.card,
    shadowColor: themeColors.shadow,
  };

  if (isLargeScreen) {
    return (
      <View style={{ backgroundColor: themeColors.background }}>
        <View style={[styles.drawer, surface]}>
          <View style={{ paddingHorizontal: 20 }}>
            <Logo
              variant='inlineWithText'
              color={theme === 'light' ? 'primary' : 'onPrimary'}
            />
          </View>
          <View style={{ flex: 1 }}>{items}</View>
          <Button
            variant='error'
            label='Log Out'
            iconLeft='log-out-outline'
            onPress={signOut}
            style={{ borderRadius: 15, marginHorizontal: 12 }}
            fullWidth
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: themeColors.background }}>
      <View
        style={[
          styles.bar,
          surface,
          {
            marginBottom:
              Platform.OS === 'ios' ? Math.max(bottom - 10, 10) : bottom + 10,
          },
        ]}
      >
        {items}
      </View>
    </View>
  );
};

const shadow = {
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 4,
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderRadius: 99,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow,
  },
  drawer: {
    flex: 1,
    width: 250,
    margin: 10,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 20,
    borderRadius: 20,
    ...shadow,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 12,
    marginVertical: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 56,
  },
  tabBadge: { position: 'absolute', top: -4, right: -8 },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 10, lineHeight: 14, fontFamily: 'Inter-SemiBold' },
});
