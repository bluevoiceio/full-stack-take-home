import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { ColorKey } from '../../constants/Colors';
import { useThemeStore } from '../../store/useThemeStore';

const VARIANTS = {
  h3: { fontSize: 24, lineHeight: 32 },
  h5: { fontSize: 18, lineHeight: 24 },
  subtitle1: { fontSize: 16, lineHeight: 22 },
  body1: { fontSize: 14, lineHeight: 20 },
  caption: { fontSize: 12, lineHeight: 18 },
};

const WEIGHTS = { regular: '400', semibold: '600', bold: '700' } as const;

interface TextProps extends RNTextProps {
  variant?: keyof typeof VARIANTS;
  weight?: keyof typeof WEIGHTS;
  color?: ColorKey;
}

export const Text = ({
  variant = 'body1',
  weight = 'regular',
  color = 'text',
  style,
  ...props
}: TextProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return (
    <RNText
      style={[
        VARIANTS[variant],
        { fontWeight: WEIGHTS[weight], color: themeColors[color] },
        style,
      ]}
      {...props}
    />
  );
};
