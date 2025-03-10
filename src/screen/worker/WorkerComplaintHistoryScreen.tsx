import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";

interface Complaint {
    complaintId: string;
    projectId: string;
    projectDescription: string;
    subject: string;
    complaintDescription: string;
    projectStartDate: string;
    phoneNumber: string;
}

type WorkerComplaintHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerComplaintHistoryScreen'>;

const WorkerComplaintHistoryScreen = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const navigation = useNavigation<WorkerComplaintHistoryScreenNavigationProp>();

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const storedComplaints = await AsyncStorage.getItem("submittedRequests");
                if (storedComplaints) {
                    setComplaints(JSON.parse(storedComplaints) as Complaint[]);
                }
            } catch (error) {
                console.error("Failed to load complaints", error);
            }
        };
        fetchComplaints();
    }, []);

    const renderItem = ({ item }: { item: Complaint }) => (
        <View style={styles.item}>
            <View style={styles.row}>
                <Icon name="id-badge" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Complaint ID: {item.complaintId}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="tags" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Project ID: {item.projectId}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="info-circle" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Project Description: {item.projectDescription}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="calendar" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Start Date: {item.projectStartDate}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="edit" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Complaint Subject: {item.subject}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="pencil" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Complaint: {item.complaintDescription}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Complaint History</Text>
            <FlatList
                data={complaints}
                keyExtractor={(item) => item.complaintId}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No complaints found.</Text>}
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
        elevation: 5, // For shadow effect
    },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    icon: { marginRight: 10 },
    itemText: {
        fontSize: 14,
        color: "#333",
        flex: 1,
    },
    emptyText: {
        fontSize: 16,
        color: "#777",
        textAlign: "center",
        marginTop: 20,
    },
    backButton: {
        backgroundColor: "#000",
        padding: 13,
        marginTop: 20,
        alignItems: "center",
        borderRadius: 10,
      },
      backButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
      },
});


export default WorkerComplaintHistoryScreen;
