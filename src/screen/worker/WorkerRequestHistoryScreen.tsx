import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome"; // You can choose another icon library if needed
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";

interface PaymentRequest {
    requestId: string;
    project_Id: string;
    project_description: string;
    long_project_description: string;
    amount: string;
    request_date: string;
    project_start_date: string;
    project_end_date: string;
}

type WorkerRequestHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerRequestHistoryScreen'>;


const WorkerRequestHistoryScreen = () => {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
        const navigation = useNavigation<WorkerRequestHistoryScreenNavigationProp>(); // Explicitly set the type here
    

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const storedRequests = await AsyncStorage.getItem("worker_requests");
                if (storedRequests) {
                    setRequests(JSON.parse(storedRequests) as PaymentRequest[]);
                }
            } catch (error) {
                console.error("Failed to load requests", error);
            }
        };
        fetchRequests();
    }, []);

    const renderItem = ({ item }: { item: PaymentRequest }) => (
        <View style={styles.item}>
            <View style={styles.row}>
                <Icon name="id-badge" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Request ID: {item.requestId}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="tags" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Project Id: {item.project_Id}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="info-circle" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Project Description: {item.project_description}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="calendar" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Start Date: {item.project_start_date}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="calendar" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>End Date: {item.project_end_date}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="money" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Amount: ₹{item.amount}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="calendar-check-o" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Date: {new Date(item.request_date).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Payment Requests</Text>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.requestId}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No payment requests found.</Text>}
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
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#000",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default WorkerRequestHistoryScreen;
