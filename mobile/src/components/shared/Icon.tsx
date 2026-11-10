import { Ionicons } from '@expo/vector-icons';

import { ColorKey } from '../../constants/Colors';
import { useThemeStore } from '../../store/useThemeStore';

export type IconName = keyof typeof Ionicons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorKey;
}

export const Icon = ({ name, size = 34, color = 'primary' }: IconProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return <Ionicons name={name} size={size} color={themeColors[color]} />;
};
