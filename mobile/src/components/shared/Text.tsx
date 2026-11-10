import {
  Platform,
  Text as RNText,
  TextProps as RNTextProps,
} from 'react-native';

import { ColorKey } from '../../constants/Colors';
import { useThemeStore } from '../../store/useThemeStore';

export const TextVariants = Platform.select({
  web: {
    h1: { fontSize: 40, lineHeight: 52, letterSpacing: -0.2 },
    h2: { fontSize: 32, lineHeight: 42, letterSpacing: 0 },
    h3: { fontSize: 28, lineHeight: 36, letterSpacing: 0.07 },
    h4: { fontSize: 24, lineHeight: 32, letterSpacing: 0 },
    h5: { fontSize: 20, lineHeight: 26, letterSpacing: 0.03 },
    h6: { fontSize: 18, lineHeight: 24, letterSpacing: 0.03 },
    subtitle1: { fontSize: 18, lineHeight: 24, letterSpacing: 0.03 },
    subtitle2: { fontSize: 16, lineHeight: 22, letterSpacing: 0.02 },
    body1: { fontSize: 14, lineHeight: 20, letterSpacing: 0.07 },
    body2: { fontSize: 12, lineHeight: 18, letterSpacing: 0.06 },
    caption: { fontSize: 12, lineHeight: 18, letterSpacing: 0.06 },
  },
  default: {
    h1: { fontSize: 32, lineHeight: 42, letterSpacing: -0.5 },
    h2: { fontSize: 28, lineHeight: 36, letterSpacing: -0.1 },
    h3: { fontSize: 24, lineHeight: 32, letterSpacing: 0 },
    h4: { fontSize: 20, lineHeight: 26, letterSpacing: 0.05 },
    h5: { fontSize: 18, lineHeight: 24, letterSpacing: 0 },
    h6: { fontSize: 16, lineHeight: 22, letterSpacing: 0.02 },
    subtitle1: { fontSize: 16, lineHeight: 22, letterSpacing: 0.02 },
    subtitle2: { fontSize: 14, lineHeight: 20, letterSpacing: 0.01 },
    body1: { fontSize: 14, lineHeight: 20, letterSpacing: 0.07 },
    body2: { fontSize: 12, lineHeight: 18, letterSpacing: 0.06 },
    caption: { fontSize: 12, lineHeight: 18, letterSpacing: 0.06 },
  },
});

// Each weight is its own font file, loaded in the root layout.
export const TextWeights = {
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  heavy: 'Inter-ExtraBold',
};

export type TextVariant = keyof typeof TextVariants;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: keyof typeof TextWeights;
  color?: ColorKey;
  align?: 'left' | 'center' | 'right';
}

export const Text = ({
  variant = 'body1',
  weight = 'regular',
  color = 'text',
  align = 'left',
  style,
  ...props
}: TextProps) => {
  const themeColors = useThemeStore(s => s.themeColors);
  return (
    <RNText
      maxFontSizeMultiplier={2}
      {...props}
      style={[
        TextVariants[variant],
        {
          color: themeColors[color],
          fontFamily: TextWeights[weight],
          textDecorationLine: color === 'linkText' ? 'underline' : 'none',
          textAlign: align,
        },
        style,
      ]}
    />
  );
};
