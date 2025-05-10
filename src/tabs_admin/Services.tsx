import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

type SettingsStackParamList = {
  WorkerWorkHistoryScreen: undefined;
  WorkerFullPaymentHistoryScreen: undefined;
  WorkerAttendanceHistoryScreen: undefined;
  WorkerComplaintHistoryScreen: undefined;
  WorkerRequestHistoryScreen: undefined;
};

const settingsOptions = [
  { name: "Work History", icon: "work", screen: "WorkerWorkHistoryScreen" },
  { name: "Payment History", icon: "payment", screen: "WorkerFullPaymentHistoryScreen" },
  { name: "Attendance History", icon: "event", screen: "WorkerAttendanceHistoryScreen" },
  { name: "Complaint History", icon: "report-problem", screen: "WorkerComplaintHistoryScreen" },
  { name: "Request History", icon: "note", screen: "WorkerRequestHistoryScreen" },
];

const Services = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            { backgroundColor: theme.mode === 'dark' ? "#333" : "#fff" },
          ]}
          onPress={() => navigation.navigate(option.screen as keyof SettingsStackParamList)}
        >
          <Icon name={option.icon} size={24} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>
            {option.name}
          </Text>
          <Icon
            name="chevron-right"
            size={24}
            color={theme.text}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      ))}

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
  chevronIcon: {
    marginLeft: "auto",
  },

});

export default Services;
