import { View, ViewProps } from 'react-native';

import { useThemeStore } from '../../store/useThemeStore';

export const Card = ({ style, ...props }: ViewProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return (
    <View
      style={[
        {
          padding: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: themeColors.border,
          backgroundColor: themeColors.card,
        },
        style,
      ]}
      {...props}
    />
  );
};
