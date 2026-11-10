import { ReactNode } from 'react';

import { ColorKey } from '../../constants/Colors';
import { Card, CardContent } from './Card';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

interface SettingsCardProps {
  icon: IconName;
  iconColor?: ColorKey;
  title: string;
  description: string;
  /** A control or chevron shown at the end of the row. */
  action?: ReactNode;
  onPress?: () => void;
}

// An icon, a title and a line of detail: the row used for anything list-like.
export const SettingsCard = ({
  icon,
  iconColor = 'subtleText',
  title,
  description,
  action,
  onPress,
}: SettingsCardProps) => (
  <Card onPress={onPress}>
    <CardContent
      iconLeft={<Icon name={icon} color={iconColor} />}
      iconRight={action}
    >
      <Text variant='subtitle1' weight='semiBold'>
        {title}
      </Text>
      <Text variant='caption' color='subtleText'>
        {description}
      </Text>
    </CardContent>
  </Card>
);
