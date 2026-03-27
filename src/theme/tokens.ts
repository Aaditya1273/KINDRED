import { useUniwind } from 'uniwind';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';

/**
 * KINDRED Design Tokens
 * 8pt spacing system, dynamic theme support
 */

const ColorsTokens = {
  // Light Theme (Orange-White)
  light: {
    bg: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    border: 'rgba(0,0,0,0.06)',
    borderStrong: 'rgba(0,0,0,0.12)',
    primary: '#FF7B1A', // Kindred Orange
    textPrimary: '#000000', // Deep Black for text
    textSecondary: '#4D4D4D',
    textMuted: '#808080',
    positive: '#00C853',
    negative: '#FF5252',
  },
  // Dark Theme (Black-Orange)
  dark: {
    bg: '#000000', // Deep Black
    surface: '#0A0A0A',
    surfaceElevated: '#121212',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.15)',
    primary: '#FF8933', // Lighter orange for dark mode
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.7)',
    textMuted: 'rgba(255,255,255,0.4)',
    positive: '#00FFA3',
    negative: '#FF5C5C',
  }
};

// Legacy Export for backward compatibility (matches Light Mode by default)
export const Colors = {
  ...ColorsTokens.light,
  light: ColorsTokens.light,
  dark: ColorsTokens.dark,
};

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Motion = {
  timing: {
    fast: 200,
    normal: 400,
    slow: 600,
  },
  spring: {
    stiff: { damping: 20, stiffness: 200 },
    normal: { damping: 25, stiffness: 150 },
  }
};

export const Interaction = {
  pressScale: 0.98,
  pressOpacity: 0.8,
};

export const useAppTheme = () => {
  const { selectedTheme } = useSelectedTheme();
  const isDark = selectedTheme === 'dark';
  const tokens = ColorsTokens[isDark ? 'dark' : 'light'];

  return {
    isDark,
    theme: selectedTheme,
    ...tokens,
    // Legacy compatibility alias
    cyan: tokens.primary,
    emerald: tokens.positive,
  };
}
