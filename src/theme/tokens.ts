/**
 * KINDRED Design Tokens
 * 8pt spacing system, native-first, calm + intelligent aesthetic
 */

export const Colors = {
  bg: '#020202',
  surface: '#0D0D0D',
  surfaceElevated: '#141414',
  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.12)',

  // Brand
  emerald: '#00FFA3',   // success / growth
  cyan: '#00E0FF',      // trust / system activity

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.5)',
  textMuted: 'rgba(255,255,255,0.25)',

  // Status
  positive: '#00FFA3',
  negative: '#FF5C5C',
  warning: '#FFB800',
  neutral: 'rgba(255,255,255,0.4)',
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
  spring: {
    gentle: { mass: 1, damping: 18, stiffness: 120 },
    bouncy: { mass: 1, damping: 12, stiffness: 200 },
    stiff:  { mass: 1, damping: 22, stiffness: 320 },
  },
  timing: {
    fast:   150,
    normal: 220,
    slow:   350,
  },
};

export const Interaction = {
  pressScale: 0.96,
  pressOpacity: 0.85,
};
