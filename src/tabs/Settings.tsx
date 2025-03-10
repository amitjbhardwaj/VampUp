import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type SettingsStackParamList = {
  WorkerPersonalDetailsScreen: undefined;
  WorkerPaymentScreen: undefined;
  WorkerSecurityAndPrivacyScreen: undefined;
  WorkerNotificationScreen: undefined;
  AboutAppScreen: undefined;
  LoginScreen: undefined;
};

const settingsOptions = [
  { name: "Personal details", icon: "person", screen: "WorkerPersonalDetailsScreen" },
  { name: "Payments", icon: "sync-alt", screen: "WorkerPaymentScreen" },
  { name: "Security & Privacy", icon: "shield", screen: "WorkerSecurityAndPrivacyScreen" },
  { name: "Notifications", icon: "notifications", screen: "WorkerNotificationScreen" },
  { name: "About app", icon: "info", screen: "AboutAppScreen" },
];

const Settings = () => {
  const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();

  return (
    <View style={styles.container}>
      {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => navigation.navigate(option.screen as keyof SettingsStackParamList)}
        >
          <Icon name={option.icon} size={24} color="#000" />
          <Text style={styles.optionText}>{option.name}</Text>
        </TouchableOpacity>
      ))}

      {/* Logout Option */}
      <TouchableOpacity
        style={[styles.option, styles.logoutOption]}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        }}
      >
        <Icon name="logout" size={24} color="#d32f2f" />
        <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutOption: {
    marginTop: 20, // Push logout button down
    backgroundColor: "#ffe5e5", // Light red background
  },
  logoutText: {
    color: "#d32f2f", // Red color for logout text
    fontWeight: "bold",
  },
});

export default Settings;
