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
  cardBackground: "#ffffff",  // Pure white cards
  border: "#dddddd",      // Light gray for borders
  secondary: "#6c757d",   // Grayish for secondary buttons
  success: "#28a745",     // Green for success actions
  danger: "#dc3545",       // Red for delete actions
  errorText: "#D8000C",  // Bright red for errors
  buttonBackground: "#4C9F70",  // Green button background
  placeholderTextColor: "#B0B0B0",  // Light gray for placeholder text
  iconColor: "#707070",  // Medium gray for icons
};

const DarkTheme = {
  mode: 'dark',
  background: '#000000',
  text: '#FFFFFF',
  inputBackground: '#34495e', // Dark mode input field background
  buttonText: '#FFFFFF', // Button text color
  icon: '#bdc3c7', // Icon color
  errorColor: '#c0392b', // Dark mode error color
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#FFFFFF',
  buttonTextColor: '#FFFFFF',
  backgroundColor: '#FFFFFF',
  cardBackground: "#1e1e1e",  // Dark gray for cards
  border: "#333333",      // Slightly lighter gray for borders
  primary: "#bb86fc",     // Purple accent for primary buttons (Material Design style)
  secondary: "#8d8d8d",   // Grayish for secondary buttons
  success: "#4caf50",     // Brighter green for success actions
  danger: "#cf6679",       // Soft red for delete actions
  errorText: "#FF4C4C",  // Bright red for errors
  buttonBackground: "#3A8E4A",  // Dark green button background
  placeholderTextColor: "#B0B0B0",  // Light gray for placeholder text
  iconColor: "#A0A0A0",  // Lighter gray for icons
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
