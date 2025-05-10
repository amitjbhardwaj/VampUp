import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext";

type SettingsStackParamList = {
  PersonalDetailsScreen: undefined;
  WorkerPaymentScreen: undefined;
  WorkerSecurityAndPrivacyScreen: undefined;
  WorkerNotificationScreen: undefined;
  AboutAppScreen: undefined;
  LoginScreen: undefined;
};

const Settings = () => {
  const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();
  const { theme, toggleTheme } = useTheme();

  const settingsOptions = [
    { name: "Personal details", icon: "person", screen: "PersonalDetailsScreen" },
    { name: "Payments", icon: "sync-alt", screen: "WorkerPaymentScreen" },
    { name: "Security & Privacy", icon: "shield", screen: "WorkerSecurityAndPrivacyScreen" },
    { name: "Notifications", icon: "notifications", screen: "WorkerNotificationScreen" },
    { name: "About app", icon: "info", screen: "AboutAppScreen" },
    { name: "Dark Mode", icon: "brightness-6", isThemeToggle: true }, // New theme option!
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {settingsOptions.map((option, index) => (
        <View key={index}>
          {option.isThemeToggle ? (
            <View style={[styles.option, { backgroundColor: theme.background }]}>
              <Icon name={option.icon} size={24} color={theme.text} />
              <Text style={[styles.optionText, { color: theme.text }]}>
                {option.name}
              </Text>
              <Switch
                value={theme.mode === "dark"}
                onValueChange={toggleTheme}
                thumbColor={theme.primary}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.option, { backgroundColor: theme.mode === "dark" ? "#444" : "#fff" }]}
              onPress={() =>
                navigation.navigate(option.screen as keyof SettingsStackParamList)
              }
            >
              <Icon name={option.icon} size={24} color={theme.mode === "dark" ? "#fff" : "#000"} />
              <Text style={[styles.optionText, { color: theme.mode === "dark" ? "#fff" : "#000" }]}>
                {option.name}
              </Text>
              <Icon
                name="chevron-right"
                size={24}
                color={theme.text}
                style={styles.chevronIcon}
              />
            </TouchableOpacity>
          )}
        </View>
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
    padding: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  logoutOption: {
    marginTop: 20,
    backgroundColor: "#ffe5e5",
  },
  logoutText: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  chevronIcon: {
    marginLeft: "auto",
  },
});

export default Settings;
