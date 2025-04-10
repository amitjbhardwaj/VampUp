import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

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
  const [complaintCount, setComplaintCount] = useState<number>(0);
  const [completedProjectsCount, setCompletedProjectsCount] = useState<number>(0);
  const isFocused = useIsFocused(); // Hook to check if the screen is focused

  const fetchComplaintCount = async () => {
    try {
      const workerName = await AsyncStorage.getItem("workerName");
      if (workerName) {
        const response = await axios.get(`http://192.168.129.119:5001/get-complaints-by-worker/${workerName}`);
        if (response.data.status === "OK") {
          setComplaintCount(response.data.data.length);
        } else {
          setComplaintCount(0); // In case of no complaints or error in response
        }
      }
    } catch (error) {
      console.error("Error fetching complaint count:", error);
      setComplaintCount(0); // Default to 0 if there's an error
    }
  };

  const fetchCompletedProjectsCount = async () => {
    try {
      const workerName = await AsyncStorage.getItem("workerName");
      if (workerName) {
        const response = await axios.get(`http://192.168.129.119:5001/get-completed-projects?workerName=${workerName}`);
        if (response.data.status === "OK") {
          setCompletedProjectsCount(response.data.data.length);
        } else {
          setCompletedProjectsCount(0); // Default to 0 if there's no data
        }
      }
    } catch (error) {
      console.error("Error fetching completed projects count:", error);
      setCompletedProjectsCount(0); // Default to 0 if there's an error
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchComplaintCount(); // Fetch complaint count when the screen is focused
      fetchCompletedProjectsCount(); // Fetch completed projects count when the screen is focused
    }
  }, [isFocused]); // Re-run when the screen is focused

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, { backgroundColor: theme.mode === "dark" ? "#333" : "#fff" }]}
          onPress={() => navigation.navigate(option.screen as keyof SettingsStackParamList)}
        >
          <Icon name={option.icon} size={24} color={theme.text} />
          <Text style={[styles.optionText, { color: theme.text }]}>{option.name}</Text>
          {option.name === "Complaint History" && complaintCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{complaintCount}</Text>
            </View>
          )}
          {option.name === "Work History" && completedProjectsCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{completedProjectsCount}</Text>
            </View>
          )}
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
    position: "relative",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  notificationBadge: {
    position: "absolute",
    top: 16,  // Adjusted top to position it slightly down
    right: 20,  // Adjusted left to position it slightly to the left
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Services;
