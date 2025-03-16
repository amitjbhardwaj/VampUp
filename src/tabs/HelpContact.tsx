import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

const HelpContact = () => {
  const { theme } = useTheme();

  // Define styles based on the current theme
  const dynamicStyles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.mode === "dark" ? "#333" : "#fff", // Dark mode: dark background, Light mode: white background
    },
    text: {
      color: theme.mode === "dark" ? "#fff" : "#000", // Dark mode: white text, Light mode: black text
    },
  });

  return (
    <View style={dynamicStyles.screen}>
      <Text style={dynamicStyles.text}>Help & Contact</Text>
    </View>
  );
};

export default HelpContact;
