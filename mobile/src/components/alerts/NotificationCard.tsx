import { Notification } from '../../constants/types';
import { useThemeStore } from '../../store/useThemeStore';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Text,
} from '../shared';
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
    <Card
      onPress={onPress}
      style={{
        borderLeftWidth: 5,
        borderLeftColor: notification.read
          ? themeColors.outline
          : themeColors.info,
      }}
    >
      <CardHeader
        style={{ alignItems: 'center' }}
        iconRight={
          <Button
            variant='muted'
            size='sm'
            iconLeft='close-circle'
            accessibilityLabel={`Delete ${notification.title}`}
            style={{ paddingHorizontal: 0, paddingVertical: 0 }}
            onPress={onDelete}
          />
        }
      >
        <Text
          variant='subtitle1'
          weight={notification.read ? 'semiBold' : 'bold'}
          style={{ flex: 1 }}
        >
          {notification.title}
        </Text>
      </CardHeader>
      <CardContent>
        <Text>{notification.message}</Text>
      </CardContent>
      <CardFooter>
        <Text variant='caption' color='subtleText' style={{ flex: 1 }}>
          {fromNow(notification.createdAt)}
        </Text>
        {senderName && (
          <Text variant='caption' color='subtleText' numberOfLines={1}>
            {senderName}
          </Text>
        )}
      </CardFooter>
    </Card>
  );
};
