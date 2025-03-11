import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface AttendanceRecord {
    project_Id: string;
    project_description: string;
    long_project_description: string;
    assigned_to: string;
    project_start_date: string;
    completion_percentage: number;
    date: string;
    login_time: string;
    logout_time: string;
    attendance_type: string;
}

type WorkerAttendanceHistoryScreenNavigationProp = NavigationProp<
    RootStackParamList,
    "WorkerAttendanceHistoryScreen"
>;

const WorkerAttendanceHistoryScreen = () => {
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const navigation = useNavigation<WorkerAttendanceHistoryScreenNavigationProp>();

    useEffect(() => {
        const fetchAttendanceHistory = async () => {
            try {
                const storedRecords = await AsyncStorage.getItem("attendanceHistory");
                if (storedRecords) {
                    setAttendanceRecords(JSON.parse(storedRecords));
                }
            } catch (error) {
                console.error("Failed to load attendance history", error);
            }
        };
        fetchAttendanceHistory();
    }, []);

    useFocusEffect(
      useCallback(() => {
          const fetchAttendanceRecords = async () => {
              try {
                  const storedRecords = await AsyncStorage.getItem("attendanceHistory");
                  setAttendanceRecords(storedRecords ? JSON.parse(storedRecords) : []);
              } catch (error) {
                  console.error("Failed to load attendance records", error);
              }
          };
          fetchAttendanceRecords();
      }, [])
  );
  
    const renderItem = ({ item }: { item: AttendanceRecord }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>Project ID: {item.project_Id}</Text>
            <Text style={styles.itemText}>Description: {item.project_description}</Text>
            <Text style={styles.itemText}>Assigned To: {item.assigned_to}</Text>
            <Text style={styles.itemText}>Start Date: {item.project_start_date}</Text>
            <Text style={styles.itemText}>Completion: {item.completion_percentage}%</Text>
            <Text style={styles.itemText}>Date: {item.date}</Text>
            <Text style={styles.itemText}>Login Time: {item.login_time}</Text>
            <Text style={styles.itemText}>Logout Time: {item.logout_time}</Text>
            <Text style={styles.itemText}>Type: {item.attendance_type}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Attendance History</Text>
            <FlatList
                data={attendanceRecords}
                keyExtractor={(item) => item.project_Id + item.date}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No attendance records found.</Text>}
            />
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    item: {
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
        elevation: 5,
    },
    itemText: { fontSize: 14, color: "#333", marginBottom: 5 },
    emptyText: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 20 },
    backButton: {
        backgroundColor: "#000",
        padding: 13,
        marginTop: 20,
        alignItems: "center",
        borderRadius: 10,
    },
    backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default WorkerAttendanceHistoryScreen;