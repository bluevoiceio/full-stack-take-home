const palette = {
  primary: {
    50: '#e6f0fe',
    100: '#b8cce7',
    300: '#5e82b7',
    400: '#315d9f',
    500: '#043887',
    700: '#04255b',
    800: '#031c45',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    900: '#7f1d1d',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#00c950',
    600: '#00a63e',
    700: '#008236',
    900: '#0d542b',
  },
  sky: {
    50: '#f0f9ff',
    100: '#dff2fe',
    300: '#74d4ff',
    400: '#00bcff',
    500: '#00a6f4',
    600: '#0084d1',
    900: '#024a70',
  },
  yellow: {
    100: '#fef9c2',
    500: '#f0b100',
    600: '#d08700',
    800: '#894b00',
    900: '#733e0a',
    950: '#432004',
  },
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
  neutral: { 200: '#e5e5e5', 400: '#a1a1a1', 800: '#262626' },
};

export type ThemeColors = {
  background: string;
  subtleBackground: string;
  mutedBackground: string;
  card: string;
  disabledBackground: string;

  primaryBackground: string;
  successBackground: string;
  errorBackground: string;
  warningBackground: string;
  infoBackground: string;

  text: string;
  subtleText: string;
  mutedText: string;
  linkText: string;
  disabledText: string;

  primary: string;
  onPrimary: string;
  primaryActive: string;
  focus: string;

  success: string;
  successActive: string;
  onSuccess: string;
  error: string;
  errorActive: string;
  onError: string;
  warning: string;
  warningActive: string;
  onWarning: string;
  warningText: string;
  info: string;
  infoActive: string;
  onInfo: string;

  border: string;
  outline: string;
  shadow: string;
  overlay: string;
};

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: palette.slate[100],
    subtleBackground: palette.slate[300],
    mutedBackground: palette.slate[400],
    card: palette.slate[50],
    disabledBackground: palette.neutral[200],

    primaryBackground: palette.primary[100],
    successBackground: palette.green[100],
    errorBackground: palette.red[100],
    warningBackground: palette.yellow[100],
    infoBackground: palette.sky[100],

    text: palette.slate[900],
    subtleText: palette.slate[600],
    mutedText: palette.slate[500],
    linkText: palette.primary[500],
    disabledText: palette.neutral[400],

    primary: palette.primary[500],
    onPrimary: palette.primary[50],
    primaryActive: palette.primary[400],
    focus: palette.primary[700],

    success: palette.green[700],
    successActive: palette.green[500],
    onSuccess: palette.green[50],
    error: palette.red[600],
    errorActive: palette.red[500],
    onError: palette.red[50],
    warning: palette.yellow[600],
    warningActive: palette.yellow[500],
    onWarning: palette.yellow[950],
    warningText: palette.yellow[800],
    info: palette.sky[600],
    infoActive: palette.sky[500],
    onInfo: palette.sky[50],

    border: palette.slate[200],
    outline: palette.slate[300],
    shadow: palette.slate[950],
    overlay: 'rgba(2, 6, 24, 0.5)',
  },
  dark: {
    background: palette.slate[950],
    subtleBackground: palette.slate[800],
    mutedBackground: palette.slate[900],
    card: palette.slate[900],
    disabledBackground: palette.neutral[800],

    primaryBackground: palette.primary[800],
    successBackground: palette.green[900],
    errorBackground: palette.red[900],
    warningBackground: palette.yellow[900],
    infoBackground: palette.sky[900],

    text: palette.slate[100],
    subtleText: palette.slate[300],
    mutedText: palette.slate[400],
    linkText: palette.sky[300],
    disabledText: palette.neutral[400],

    primary: palette.primary[400],
    onPrimary: palette.primary[50],
    primaryActive: palette.primary[300],
    focus: palette.primary[300],

    success: palette.green[600],
    successActive: palette.green[500],
    onSuccess: palette.green[50],
    error: palette.red[600],
    errorActive: palette.red[500],
    onError: palette.red[50],
    warning: palette.yellow[600],
    warningActive: palette.yellow[500],
    onWarning: palette.yellow[950],
    warningText: palette.yellow[600],
    info: palette.sky[500],
    infoActive: palette.sky[400],
    onInfo: palette.sky[50],

    border: palette.slate[800],
    outline: palette.slate[700],
    shadow: palette.slate[900],
    overlay: 'rgba(2, 6, 24, 0.6)',
  },
};

export type Theme = keyof typeof Colors;
export type ColorKey = keyof ThemeColors;
