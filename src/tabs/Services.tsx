import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

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
});

export default Services;
