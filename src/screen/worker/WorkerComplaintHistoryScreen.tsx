import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Share,
    Alert,
    TextInput,
    Modal,
    ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";

interface Complaint {
    complaintId: string;
    projectId: string;
    projectDescription: string;
    longProjectDescription: string;
    subject: string;
    complaintDescription: string;
    projectStartDate: string;
    phone: string;  // Added phone number for calling & messaging
}

type WorkerComplaintHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerComplaintHistoryScreen'>;
type WorkerComplaintHistoryScreenRouteProp = RouteProp<RootStackParamList, "WorkerComplaintHistoryScreen">;

const WorkerComplaintHistoryScreen = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const navigation = useNavigation<WorkerComplaintHistoryScreenNavigationProp>();
    const route = useRoute<WorkerComplaintHistoryScreenRouteProp>();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [updatedSubject, setUpdatedSubject] = useState("");
    const [updatedComplaint, setUpdatedComplaint] = useState("");

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

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleMessage = (phone: string) => {
        Linking.openURL(`sms:${phone}`);
    };

    const handleShare = async (item: Complaint) => {
        const message = `Complaint Details:
        📌 Complaint ID: ${item.complaintId}
        🏗 Project ID: ${item.projectId}
        📋 Description: ${item.projectDescription}
        📆 Start Date: ${item.projectStartDate}
        📣 Subject: ${item.subject}
        📝 Complaint: ${item.complaintDescription}
        📞 Contact: ${item.phone}`;

        try {
            await Share.share({ message });
        } catch (error) {
            console.error("Error sharing complaint:", error);
        }
    };

    const saveComplaints = async (updatedComplaints: Complaint[]) => {
        await AsyncStorage.setItem("submittedRequests", JSON.stringify(updatedComplaints));
        setComplaints(updatedComplaints);
    };

    const handleEdit = (item: Complaint) => {
        setSelectedComplaint(item);
        setUpdatedSubject(item.subject);
        setUpdatedComplaint(item.complaintDescription);
        setModalVisible(true);
    };

    const handleSaveEdit = () => {
        const updatedComplaints = complaints.map(c =>
            c.complaintId === selectedComplaint?.complaintId ? { ...c, subject: updatedSubject, complaintDescription: updatedComplaint } : c
        );
        saveComplaints(updatedComplaints);
        setModalVisible(false);
    };

    const handleDelete = (complaintId: string) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this complaint?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", onPress: () => {
                    const updatedComplaints = complaints.filter(c => c.complaintId !== complaintId);
                    saveComplaints(updatedComplaints);
                }
            }
        ]);
    };

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
                <Icon name="info-circle" size={20} color="#28a745" style={styles.icon} />
                <Text style={styles.itemText}>Project Long Description: {item.longProjectDescription}</Text>
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

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                {/* First row: Call, Message, Share */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={() => handleCall(item.phone)}>
                        <Icon name="phone" size={15} color="white" />
                        <Text style={styles.buttonText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => handleMessage(item.phone)}>
                        <Icon name="comment" size={15} color="white" />
                        <Text style={styles.buttonText}>Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => handleShare(item)}>
                        <Icon name="share" size={15} color="white" />
                        <Text style={styles.buttonText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Second row: Edit, Delete */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={() => handleEdit(item)}>
                        <Icon name="edit" size={15} color="white" />
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonDelete} onPress={() => handleDelete(item.complaintId)}>
                        <Icon name="trash" size={15} color="white" />
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
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

            <Modal visible={modalVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Edit Complaint</Text>
                        <TextInput
                            style={styles.input}
                            value={updatedSubject}
                            onChangeText={setUpdatedSubject}
                            placeholder="Update Subject"
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={updatedComplaint}
                            onChangeText={setUpdatedComplaint}
                            placeholder="Update Complaint Description"
                            multiline
                        />
                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDelete} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        elevation: 5, // Shadow effect
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",  // Ensures proper text alignment
        marginBottom: 5
    },
    icon: { marginRight: 10, marginTop: 2 }, // Adjusted for alignment
    itemText: {
        fontSize: 14,
        color: "#333",
        flexShrink: 1, // Prevents text from overflowing
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
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#28a745",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        justifyContent: "center",
        flex: 1,
        marginHorizontal: 1,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 5,
    },
    buttonDelete: {
        backgroundColor: "#dc3545",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginHorizontal: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignSelf: "center" // Ensures modal is centered properly
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        width: "100%",
    },
    textArea: {
        height: 100,
    },
    modalButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    buttonContainer: {
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5, // Adds spacing between button rows
    },
});

export default WorkerComplaintHistoryScreen;
