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
import { useTheme } from "../../context/ThemeContext";

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
    const { theme } = useTheme(); // Get current theme
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
        <View style={[styles.item, { backgroundColor: theme.background }]}>
            <View style={styles.row}>
                <Icon name="id-badge" size={20} color={theme.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: theme.text }]}>{`Complaint ID: ${item.complaintId}`}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="tags" size={20} color={theme.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: theme.text }]}>{`Project ID: ${item.projectId}`}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="info-circle" size={20} color={theme.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: theme.text }]}>{`Project Description: ${item.projectDescription}`}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="info-circle" size={20} color={theme.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: theme.text }]}>{`Project Long Description: ${item.longProjectDescription}`}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="calendar" size={20} color={theme.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: theme.text }]}>{`Start Date: ${item.projectStartDate}`}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="edit" size={20} color={theme.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: theme.text }]}>{`Complaint Subject: ${item.subject}`}</Text>
            </View>
            <View style={styles.row}>
                <Icon name="pencil" size={20} color={theme.text} style={styles.icon} />
                <Text style={[styles.itemText, { color: theme.text }]}>{`Complaint: ${item.complaintDescription}`}</Text>
            </View>

            {/* Buttons */}
            {/* Buttons */}
            <View style={styles.buttonContainer}>
                {/* First Row: Edit, Delete */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleEdit(item)}>
                        <Icon name="edit" size={18} color={theme.buttonText} />
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonDelete]} onPress={() => handleDelete(item.complaintId)}>
                        <Icon name="trash" size={18} color={theme.buttonText} />
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Delete</Text>
                    </TouchableOpacity>
                </View>

                {/* Second Row: Call, Message, Share */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleCall(item.phone)}>
                        <Icon name="phone" size={18} color={theme.buttonText} />
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleMessage(item.phone)}>
                        <Icon name="comment" size={18} color={theme.buttonText} />
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleShare(item)}>
                        <Icon name="share" size={18} color={theme.buttonText} />
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>



        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.text }]}>Complaint History</Text>
            <FlatList
                data={complaints}
                keyExtractor={(item) => item.complaintId}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.text }]}>No complaints found.</Text>}
            />

            <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.mode === 'dark' ? '#444' : '#000' }]} onPress={() => navigation.goBack()}>
                <Text style={[styles.backButtonText, { color: theme.mode === 'dark' ? '#fff' : '#fff' }]}>Go Back</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalHeader, { color: theme.text }]}>Edit Complaint</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
                            value={updatedSubject}
                            onChangeText={setUpdatedSubject}
                            placeholder="Update Subject"
                        />
                        <TextInput
                            style={[styles.input, styles.textArea, { backgroundColor: theme.inputBackground, color: theme.text }]}
                            value={updatedComplaint}
                            onChangeText={setUpdatedComplaint}
                            placeholder="Update Complaint Description"
                            multiline
                        />
                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSaveEdit}>
                                <Text style={[styles.buttonText, { color: theme.buttonText }]}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonDelete, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: 'center',
    },
    item: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16, // Increased spacing between cards
        borderWidth: 1, // Adds a border
        borderColor: "#ddd", // Light grey border for separation
        shadowColor: "#000", // Shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // Elevation for Android shadow
        backgroundColor: "#fff", // Ensures visibility
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
    },
    itemText: {
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: "center",
    },
    buttonRow: {
        flexDirection: "row",
        flexWrap: "wrap", // Allows buttons to wrap to a new row
        justifyContent: "center", // Centers the buttons
        alignItems: "center",
        gap: 10, // Adds spacing between buttons
        width: "100%", 
        paddingHorizontal: 10, // Ensures buttons don’t touch the screen edges
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 8,
        justifyContent: "center",
        width: "45%", // Ensures two buttons fit per row
        minWidth: 120, // Avoids buttons shrinking too much
        marginBottom: 10, // Adds space between button rows
    },
    
    buttonDelete: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 8,
        backgroundColor: "#dc3545",
        justifyContent: "center",
        minWidth: 120,
        width: "45%",
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 18, // Increased font size for better readability
        fontWeight: "bold", // Bold text for emphasis
    },
    emptyText: {
        textAlign: "center",
        fontSize: 18,
        color: "gray",
    },
    backButton: {
        padding: 13,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    backButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 8,
        width: "80%",
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    input: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    textArea: {
        height: 100,
    },
    modalButtonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

});

export default WorkerComplaintHistoryScreen;
