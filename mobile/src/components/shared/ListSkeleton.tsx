import { useEffect, useRef } from 'react';
import { Animated, DimensionValue, Platform, View } from 'react-native';

import { useThemeStore } from '../../store/useThemeStore';

// Card-shaped placeholder rows, so a loading list doesn't flash its empty state.
export const ListSkeleton = ({ count = 6 }: { count?: number }) => {
  const themeColors = useThemeStore(s => s.themeColors);
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const bar = (width: DimensionValue, height: number, borderRadius = 6) => (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: themeColors.subtleBackground,
        opacity,
      }}
    />
  );

  return (
    <View style={{ gap: 10 }} testID='list_skeleton'>
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: themeColors.border,
            backgroundColor: themeColors.card,
          }}
        >
          {bar(36, 36, 18)}
          <View style={{ flex: 1, gap: 8 }}>
            {bar('55%', 12)}
            {bar('35%', 10)}
          </View>
        </View>
      ))}
    </View>
  );
};
