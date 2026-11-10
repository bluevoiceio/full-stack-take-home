import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { Notification } from '../../constants/types';
import { useThemeStore } from '../../store/useThemeStore';
import { Text } from '../shared';
import { fromNow } from '../utils';

interface NotificationCardProps {
  notification: Notification;
  senderName?: string;
  onPress: () => void;
  onDelete: () => void;
}

export const NotificationCard = ({
  notification,
  senderName,
  onPress,
  onDelete,
}: NotificationCardProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 10,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themeColors.border,
        backgroundColor: themeColors.card,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          marginTop: 7,
          borderRadius: 99,
          backgroundColor: notification.read
            ? 'transparent'
            : themeColors.primary,
        }}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          variant='subtitle1'
          weight={notification.read ? 'regular' : 'semibold'}
        >
          {notification.title}
        </Text>
        <Text color='subtleText'>{notification.message}</Text>
        <Text variant='caption' color='mutedText' style={{ marginTop: 4 }}>
          {[senderName, fromNow(notification.createdAt)]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>
      <Pressable
        onPress={onDelete}
        hitSlop={10}
        accessibilityRole='button'
        accessibilityLabel={`Delete ${notification.title}`}
      >
        <Ionicons
          name='trash-outline'
          size={18}
          color={themeColors.mutedText}
        />
      </Pressable>
    </Pressable>
  );
};
