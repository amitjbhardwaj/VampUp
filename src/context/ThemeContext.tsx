import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define Light and Dark theme structures
const LightTheme = {
  mode: 'light',
  background: '#F5F7FA',  // Light, soft background
  text: '#1A1A1A',         // Dark charcoal for better readability
  inputBackground: '#FFFFFF', // Pure white inputs
  primary: '#0066FF',     // Bright and accessible blue
  secondary: '#6c757d',   // Subtle gray for secondary elements
  success: '#2ECC71',     // Vibrant green
  danger: '#E74C3C',      // Vibrant red for danger
  errorColor: '#D32F2F',
  errorText: '#C62828',   // Rich red for error text
  buttonBackground: '#0066FF', // Match primary
  buttonText: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#0066FF',
  card: '#FFFFFF',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  placeholderTextColor: '#9E9E9E',
  iconColor: '#606060',
  shadow: 'rgba(0, 0, 0, 0.1)',
  okButton: '#4CAF50',
  cancelButton: '#F44336',
  inactiveDot: '#D0D0D0',
};


const DarkTheme = {
  mode: 'dark',
  background: '#121212',     // Deep dark background
  text: '#EDEDED',           // Light gray for better contrast
  inputBackground: '#1F1F1F', // Dark inputs
  primary: '#82B1FF',        // Soft Material Blue
  secondary: '#A9A9A9',      // Medium-light gray
  success: '#4CAF50',
  danger: '#F44336',
  errorColor: '#EF5350',
  errorText: '#FF6B6B',
  buttonBackground: '#2E7D32',
  buttonText: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  buttonBackgroundColor: '#2E7D32',
  card: '#1E1E1E',
  cardBackground: '#1E1E1E',
  border: '#2C2C2C',
  placeholderTextColor: '#9E9E9E',
  iconColor: '#B0B0B0',
  shadow: 'rgba(0, 0, 0, 0.5)',
  okButton: '#66BB6A',
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
