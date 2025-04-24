import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define Light and Dark theme structures
const DarkTheme = {
  mode: 'dark',
  background: '#121212',
  text: '#EAEAEA',
  textColor: '#EAEAEA',
  inputBackground: '#1E1E1E',
  primary: '#82B1FF',               // soft blue for better visibility
  secondary: '#A1A1A1',
  success: '#4CAF50',
  danger: '#FF5252',
  errorColor: '#FF6E6E',
  errorText: '#FF8A80',
  buttonBackground: '#3949AB',      // elevated contrast button
  buttonText: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#3949AB',
  card: '#1E1E1E',
  cardBackground: '#1E1E1E',
  border: '#2C2C2C',
  placeholderTextColor: '#777777',
  icon: '#82B1FF',
  iconColor: '#B0BEC5',
  shadow: 'rgba(0, 0, 0, 0.7)',
  okButton: '#66BB6A',
  cancelButton: '#EF5350',
  inactiveDot: '#444444',
};

const LightTheme = {
  mode: 'light',
  background: '#FDFDFD',
  text: '#212121',
  textColor: '#212121',
  inputBackground: '#FFFFFF',
  primary: '#3D5AFE',              // strong indigo for brand consistency
  secondary: '#757575',
  success: '#2E7D32',
  danger: '#C62828',
  errorColor: '#E53935',
  errorText: '#D32F2F',
  buttonBackground: '#3D5AFE',
  buttonText: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#3D5AFE',
  card: '#FFFFFF',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  placeholderTextColor: '#9E9E9E',
  icon: '#3D5AFE',
  iconColor: '#616161',
  shadow: 'rgba(0, 0, 0, 0.1)',
  okButton: '#388E3C',
  cancelButton: '#D32F2F',
  inactiveDot: '#BDBDBD',
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
