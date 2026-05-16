import { lightColors, darkColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';

export const theme = {
  light: {
    colors: lightColors,
    typography,
    spacing,
    radius,
  },
  dark: {
    colors: darkColors,
    typography,
    spacing,
    radius,
  },
};

export type AppTheme = typeof theme.light;
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
