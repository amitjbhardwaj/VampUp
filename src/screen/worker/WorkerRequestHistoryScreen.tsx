import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, SafeAreaView, Platform, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import { useTheme } from "../../context/ThemeContext";
import Header from "../Header";

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
    const { theme } = useTheme();
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
    const [newAmount, setNewAmount] = useState("");
    const navigation = useNavigation<WorkerRequestHistoryScreenNavigationProp>();

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

    const confirmDeleteRequest = (requestId: string) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this request?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteRequest(requestId) }
            ]
        );
    };

    const deleteRequest = async (requestId: string) => {
        const updatedRequests = requests.filter(request => request.requestId !== requestId);
        setRequests(updatedRequests);
        await AsyncStorage.setItem("worker_requests", JSON.stringify(updatedRequests));
    };

    const editRequest = async () => {
        if (selectedRequest) {
            const updatedRequests = requests.map(request =>
                request.requestId === selectedRequest.requestId
                    ? { ...request, amount: newAmount }
                    : request
            );
            setRequests(updatedRequests);
            await AsyncStorage.setItem("worker_requests", JSON.stringify(updatedRequests));
            setModalVisible(false);
        }
    };

    const renderItem = ({ item }: { item: PaymentRequest }) => (
        <View style={[styles.item, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.row}><Icon name="id-badge" size={20} color={theme.text} style={styles.icon} /><Text style={[styles.itemText, { color: theme.text }]}>Request ID: {item.requestId}</Text></View>
            <View style={styles.row}><Icon name="tags" size={20} color={theme.text} style={styles.icon} /><Text style={[styles.itemText, { color: theme.text }]}>Project Id: {item.project_Id}</Text></View>
            <View style={styles.row}><Icon name="info-circle" size={20} color={theme.text} style={styles.icon} /><Text style={[styles.itemText, { color: theme.text }]}>Project Description: {item.project_description}</Text></View>
            <View style={styles.row}><Icon name="calendar" size={20} color={theme.text} style={styles.icon} /><Text style={[styles.itemText, { color: theme.text }]}>Start Date: {item.project_start_date}</Text></View>
            <View style={styles.row}><Icon name="calendar" size={20} color={theme.text} style={styles.icon} /><Text style={[styles.itemText, { color: theme.text }]}>End Date: {item.project_end_date}</Text></View>
            <View style={styles.row}><Icon name="money" size={20} color={theme.text} style={styles.icon} /><Text style={[styles.itemText, { color: theme.text }]}>Amount: ₹{item.amount}</Text></View>
            <View style={styles.row}><Icon name="calendar-check-o" size={20} color={theme.text} style={styles.icon} /><Text style={[styles.itemText, { color: theme.text }]}>Date: {new Date(item.request_date).toLocaleDateString()}</Text></View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.primary }]} onPress={() => { setSelectedRequest(item); setNewAmount(item.amount); setModalVisible(true); }}>
                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteRequest(item.requestId)}>
                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Requests History" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.requestId}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.text }]}>No requests found.</Text>}
                />

                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Amount</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                keyboardType="numeric"
                                value={newAmount}
                                onChangeText={setNewAmount}
                            />
                            <View style={styles.modalButtonRow}>
                                <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={editRequest}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.secondary }]} onPress={() => setModalVisible(false)}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    item: { // Ensure this is included
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
        elevation: 5, // For shadow effect
    },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    icon: { marginRight: 10 },
    itemText: { fontSize: 14, color: "#333", flex: 1 },
    emptyText: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 20 },
    backButton: { backgroundColor: "#000", padding: 13, marginTop: 20, alignItems: "center", borderRadius: 10 },
    backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

    // Buttons for Edit and Delete
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    editButton: { backgroundColor: "#000", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
    deleteButton: { backgroundColor: "#dc3545", padding: 10, borderRadius: 5, flex: 1 },
    buttonText: { textAlign: "center", fontWeight: "bold" },

    // Modal Styles
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginTop: 10, marginBottom: 10, borderRadius: 5 },
    saveButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
    cancelButton: { backgroundColor: "#6c757d", padding: 10, borderRadius: 5, flex: 1 },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    modalButtonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    backIcon: {
        marginRight: 8,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default WorkerRequestHistoryScreen;