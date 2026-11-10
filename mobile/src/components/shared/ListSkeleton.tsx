import { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';

import { useThemeStore } from '../../store/useThemeStore';

export const ListSkeleton = ({ count = 6 }: { count?: number }) => {
  const themeColors = useThemeStore(s => s.themeColors);
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <View style={{ gap: 10 }} testID='list_skeleton'>
      {Array.from({ length: count }, (_, index) => (
        <Animated.View
          key={index}
          style={{
            height: 76,
            borderRadius: 16,
            backgroundColor: themeColors.border,
            opacity,
          }}
        />
      ))}
    </View>
  );
};
