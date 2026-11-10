import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { useThemeStore } from '../../store/useThemeStore';
import { Text } from './Text';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  caption: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  caption,
  action,
}: EmptyStateProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return (
    <View style={{ alignItems: 'center', gap: 6, paddingTop: 60 }}>
      <Ionicons name={icon} size={44} color={themeColors.outline} />
      <Text variant='subtitle1' weight='semibold' style={{ marginTop: 6 }}>
        {title}
      </Text>
      <Text
        color='mutedText'
        style={{ textAlign: 'center', maxWidth: 280, marginBottom: 10 }}
      >
        {caption}
      </Text>
      {action}
    </View>
  );
};
