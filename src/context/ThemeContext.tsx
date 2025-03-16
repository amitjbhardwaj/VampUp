import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define Light and Dark theme structures
const LightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  text: '#000000',
  inputBackground: '#f0f0f0', // Light mode input field background
  primary: '#1E90FF', // Primary button color
  buttonText: '#FFFFFF', // Button text color
  icon: '#7f8c8d', // Icon color
  errorColor: '#e74c3c', // Error text color
  textColor: '#000000',
  buttonBackgroundColor: '#FFFFFF',
  buttonTextColor: '#000000',
  backgroundColor: '#FFFFFF',
};

const DarkTheme = {
  mode: 'dark',
  background: '#000000',
  text: '#FFFFFF',
  inputBackground: '#34495e', // Dark mode input field background
  primary: '#1E90FF', // Primary button color
  buttonText: '#FFFFFF', // Button text color
  icon: '#bdc3c7', // Icon color
  errorColor: '#c0392b', // Dark mode error color
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  backgroundColor: '#FFFFFF',
};

// Type for theme structure
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
  // Get system color scheme (light or dark)
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? DarkTheme : LightTheme);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === 'light' ? DarkTheme : LightTheme));
  };

  // Optional: Listen to system theme changes
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
