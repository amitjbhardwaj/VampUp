import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";

interface AttendanceRecord {
    project_Id: string;
    project_description: string;
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
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
    const navigation = useNavigation<WorkerAttendanceHistoryScreenNavigationProp>();

    const fetchAttendanceHistory = async () => {
        try {
            const storedRecords = await AsyncStorage.getItem("attendanceHistory");
            const records = storedRecords ? JSON.parse(storedRecords) : [];
            setAttendanceRecords(records);
            setFilteredRecords(records);
        } catch (error) {
            console.error("Failed to load attendance history", error);
        }
    };

    useEffect(() => {
        fetchAttendanceHistory();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAttendanceHistory();
        }, [])
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredRecords(attendanceRecords);
            return;
        }
        const filtered = attendanceRecords.filter((record) =>
            record.project_description.toLowerCase().includes(query.toLowerCase()) ||
            record.assigned_to.toLowerCase().includes(query.toLowerCase()) ||
            record.date.includes(query)
        );
        setFilteredRecords(filtered);
    };

    const renderItem = ({ item }: { item: AttendanceRecord }) => (
        <View style={styles.card}>
            <Text style={styles.projectTitle}>{item.project_description}</Text>
            <Text style={styles.itemText}>Project ID: <Text style={styles.boldText}>{item.project_Id}</Text></Text>
            <Text style={styles.itemText}>Assigned To: <Text style={styles.boldText}>{item.assigned_to}</Text></Text>
            <Text style={styles.itemText}>Start Date: <Text style={styles.boldText}>{item.project_start_date}</Text></Text>
            <Text style={styles.itemText}>Completion: 
                <Text style={[styles.completion, item.completion_percentage === 100 ? styles.complete : styles.inProgress]}>
                    {` ${item.completion_percentage}%`}
                </Text>
            </Text>
            <Text style={styles.itemText}>Date: <Text style={styles.boldText}>{item.date}</Text></Text>
            <Text style={styles.itemText}>Login Time: <Text style={styles.loginTime}>{item.login_time}</Text></Text>
            <Text style={styles.itemText}>Logout Time: 
                <Text style={[styles.logoutTime, item.logout_time ? styles.loggedOut : styles.pending]}>
                    {item.logout_time || "Pending"}
                </Text>
            </Text>
            <Text style={styles.itemText}>Attendance Type: <Text style={styles.boldText}>{item.attendance_type}</Text></Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Attendance History</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by project, name, or date..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                        <Icon name="close" size={20} color="#888" style={styles.clearIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* List of Attendance Records */}
            {filteredRecords.length > 0 ? (
                <FlatList
                    data={filteredRecords}
                    keyExtractor={(item) => item.project_Id + item.date}
                    renderItem={renderItem}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Icon name="history" size={60} color="#bbb" />
                    <Text style={styles.emptyText}>No matching records found.</Text>
                </View>
            )}

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={22} color="#fff" style={styles.backIcon} />
                <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f4f4f4",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        color: "#333",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 2,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    clearIcon: {
        marginLeft: 8,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2a2a2a",
        marginBottom: 8,
    },
    itemText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 3,
    },
    boldText: {
        fontWeight: "bold",
        color: "#000",
    },
    completion: {
        fontWeight: "bold",
    },
    complete: {
        color: "green",
    },
    inProgress: {
        color: "#e67e22",
    },
    loginTime: {
        fontWeight: "bold",
        color: "#2980b9",
    },
    logoutTime: {
        fontWeight: "bold",
    },
    loggedOut: {
        color: "green",
    },
    pending: {
        color: "#e74c3c",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: "#777",
        marginTop: 10,
    },
    backButton: {
        flexDirection: "row",
        backgroundColor: "#000",
        paddingVertical: 13,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    backIcon: {
        marginRight: 8,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default WorkerAttendanceHistoryScreen;
