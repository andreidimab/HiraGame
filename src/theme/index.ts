export type ColorTheme = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  success: string;
  error: string;
  warning: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  hiragana: string;
  katakana: string;
  locked: string;
  gradientBg: string;
  resultsGradient: string;
};

export const DarkColors: ColorTheme = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',
  secondary: '#F5A623',
  accent: '#E84393',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  background: '#0A0F1E',
  surface: '#0F1729',
  surfaceAlt: '#162135',
  card: '#111B2E',
  border: '#1E3A5F',
  text: '#F0F4FF',
  textSecondary: '#94AACF',
  textMuted: '#4A6080',
  hiragana: '#38BDF8',
  katakana: '#34D399',
  locked: '#1A2E45',
  gradientBg: '#050A14',
  resultsGradient: '#0A1428',
};

export const LightColors: ColorTheme = {
  primary: '#6C3FCF',
  primaryLight: '#9B72E8',
  primaryDark: '#4A2A9E',
  secondary: '#D97706',
  accent: '#DB2777',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
  background: '#F8F5FF',
  surface: '#FFFFFF',
  surfaceAlt: '#F0EBFF',
  card: '#FFFFFF',
  border: '#DDD5F5',
  text: '#1A0A3E',
  textSecondary: '#5B4A8A',
  textMuted: '#9B90B8',
  hiragana: '#0284C7',
  katakana: '#059669',
  locked: '#C4B5D4',
  gradientBg: '#EDE9FF',
  resultsGradient: '#F0EBFF',
};

// Kept for components not yet migrated to useTheme()
export const Colors = DarkColors;

export const Fonts = {
  regular: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 16,
    lg: 20,
    xl: 26,
    xxl: 34,
    kana: 48,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
