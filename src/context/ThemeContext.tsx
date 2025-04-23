import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define Light and Dark theme structures
const DarkTheme = {
  mode: 'dark',
  background: '#181818',
  text: '#F5F5F5',
  textColor: '#F5F5F5',          // ✅ Added
  inputBackground: '#2A2A2A',
  primary: '#7986CB',
  secondary: '#BDBDBD',
  success: '#66BB6A',
  danger: '#EF5350',
  errorColor: '#FF5252',
  errorText: '#FF6B6B',
  buttonBackground: '#5C6BC0',
  buttonText: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#5C6BC0',
  card: '#232323',
  cardBackground: '#232323',
  border: '#333333',
  placeholderTextColor: '#AAAAAA',
  icon: '#7986CB',               // ✅ Added
  iconColor: '#C2C2C2',
  shadow: 'rgba(0, 0, 0, 0.6)',
  okButton: '#43A047',
  cancelButton: '#E53935',
  inactiveDot: '#5A5A5A',
};

const LightTheme = {
  mode: 'light',
  background: '#FAFAFA',
  text: '#1E1E1E',
  textColor: '#1E1E1E',          // ✅ Added
  inputBackground: '#FFFFFF',
  primary: '#3D5AFE',
  secondary: '#9E9E9E',
  success: '#43A047',
  danger: '#E53935',
  errorColor: '#E53935',
  errorText: '#C62828',
  buttonBackground: '#3D5AFE',
  buttonText: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#3D5AFE',
  card: '#FFFFFF',
  cardBackground: '#FFFFFF',
  border: '#DDDDDD',
  placeholderTextColor: '#A0A0A0',
  icon: '#3D5AFE',               // ✅ Added
  iconColor: '#7B7B7B',
  shadow: 'rgba(0, 0, 0, 0.08)',
  okButton: '#2E7D32',
  cancelButton: '#D32F2F',
  inactiveDot: '#C0C0C0',
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
