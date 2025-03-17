import { useNavigation } from "@react-navigation/native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useTheme } from "../context/ThemeContext";

const callContractor = () => {
  const phoneNumber = "tel:+1234567890"; // Replace with actual contractor's number
  Linking.openURL(phoneNumber);
};

const HelpContact = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.option, { backgroundColor: theme.mode === "dark" ? "#333" : "#fff" }]}
        onPress={callContractor}
      >
        <Icon name="call" size={24} color={theme.text} />
        <Text style={[styles.optionText, { color: theme.text }]}>Call Contractor</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HelpContact;
