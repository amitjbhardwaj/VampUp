import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

const LightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  text: '#000000',
  primary: '#1E90FF',
};

const DarkTheme = {
  mode: 'dark',
  background: '#000000',
  text: '#FFFFFF',
  primary: '#1E90FF',
};

type ThemeType = typeof LightTheme;

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  toggleTheme: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? DarkTheme : LightTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === 'light' ? DarkTheme : LightTheme));
  };

  // Optional: Listen to system theme change
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? DarkTheme : LightTheme);
    });
    return () => listener.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
