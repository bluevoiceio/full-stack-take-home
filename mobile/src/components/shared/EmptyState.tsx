import { ReactNode } from 'react';
import { View } from 'react-native';

import { Icon, IconName } from './Icon';
import { Text } from './Text';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  caption: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  caption,
  action,
}: EmptyStateProps) => (
  <View style={{ alignItems: 'center', gap: 6, paddingTop: 60 }}>
    <Icon name={icon} size={48} color='mutedText' />
    <Text variant='subtitle1' weight='semiBold' style={{ marginTop: 6 }}>
      {title}
    </Text>
    <Text
      color='subtleText'
      align='center'
      style={{ maxWidth: 280, marginBottom: 10 }}
    >
      {caption}
    </Text>
    {action && <View style={{ alignSelf: 'center' }}>{action}</View>}
  </View>
);
