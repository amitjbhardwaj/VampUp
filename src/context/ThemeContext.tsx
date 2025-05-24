import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define Light and Dark theme structures
const LightTheme = {
  mode: 'light',
  background: '#F8F9FA',
  text: '#1F1F1F',
  textColor: '#1F1F1F',
  inputBackground: '#FFFFFF',
  primary: '#5C6BC0', // Soft Indigo
  secondary: '#6D6D6D',
  success: '#43A047',
  danger: '#D32F2F',
  errorColor: '#E53935',
  errorText: '#C62828',
  buttonBackground: '#5C6BC0',
  buttonText: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#5C6BC0',
  card: '#FFFFFF',
  cardBackground: '#FFFFFF',
  border: '#DDDDDD',
  placeholderTextColor: '#999',
  icon: '#5C6BC0',
  iconColor: '#5C6BC0',
  shadow: 'rgba(0, 0, 0, 0.08)',
  okButton: '#388E3C',
  cancelButton: '#D32F2F',
  inactiveDot: '#C4C4C4',
};

const DarkTheme = {
  mode: 'dark',
  background: '#0F1115',
  text: '#E0E0E0',
  textColor: '#E0E0E0',
  inputBackground: '#1E1E1E',
  primary: '#9FA8DA', // Light Indigo
  secondary: '#B0BEC5',
  success: '#66BB6A',
  danger: '#EF5350',
  errorColor: '#FF8A80',
  errorText: '#FFAB91',
  buttonBackground: '#9FA8DA',
  buttonText: '#000000',
  buttonTextColor: '#000000',
  buttonBackgroundColor: '#9FA8DA',
  card: '#1C1C1C',
  cardBackground: '#1C1C1C',
  border: '#2C2C2C',
  placeholderTextColor: '#999',
  icon: '#9FA8DA',
  iconColor: '#CFD8DC',
  shadow: 'rgba(0, 0, 0, 0.7)',
  okButton: '#81C784',
  cancelButton: '#EF5350',
  inactiveDot: '#555555',
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
