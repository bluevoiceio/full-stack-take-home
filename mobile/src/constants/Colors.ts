const palette = {
  primary: { 50: '#e6f0fe', 400: '#315d9f', 500: '#043887' },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cad5e2',
    400: '#90a1b9',
    500: '#62748e',
    600: '#45556c',
    700: '#314158',
    800: '#1d293d',
    900: '#0f172b',
    950: '#020618',
  },
};

export const Colors = {
  light: {
    primary: palette.primary[500],
    onPrimary: palette.primary[50],
    background: palette.slate[100],
    card: palette.slate[50],
    border: palette.slate[200],
    outline: palette.slate[300],
    text: palette.slate[900],
    subtleText: palette.slate[600],
    mutedText: palette.slate[500],
    error: '#dc2626',
    success: '#008236',
    overlay: 'rgba(2, 6, 24, 0.5)',
  },
  dark: {
    primary: palette.primary[400],
    onPrimary: palette.primary[50],
    background: palette.slate[950],
    card: palette.slate[900],
    border: palette.slate[800],
    outline: palette.slate[700],
    text: palette.slate[100],
    subtleText: palette.slate[300],
    mutedText: palette.slate[400],
    error: '#dc2626',
    success: '#00a63e',
    overlay: 'rgba(2, 6, 24, 0.6)',
  },
};

export type Theme = keyof typeof Colors;
export type ThemeColors = (typeof Colors)[Theme];
export type ColorKey = keyof ThemeColors;
