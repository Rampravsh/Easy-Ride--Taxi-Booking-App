import React, { createContext, useContext, ReactNode } from 'react';

const theme = {
  colors: {
    primary: '#000000',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#757575',
    border: '#E0E0E0',
  },
};

const ThemeContext = createContext({ theme });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
