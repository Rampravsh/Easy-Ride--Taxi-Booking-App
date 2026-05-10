import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, Colors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';
import { radius, Radius } from './radius';

interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  radius: Radius;
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  mode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');

  const currentMode = mode === 'system' ? systemColorScheme || 'light' : mode;
  const isDark = currentMode === 'dark';

  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    spacing,
    typography,
    radius,
    isDark,
  };

  return (
    <ThemeContext.Provider value={{ theme, setMode, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
