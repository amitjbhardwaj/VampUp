import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Share,
    Alert, TextInput, Modal, SafeAreaView, Platform, StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import { useTheme } from "../../context/ThemeContext";
import Header from "../Header";

interface Complaint {
    complaint_Id: string;
    project_Id: string;
    project_Description: string;
    long_Project_Description: string;
    subject: string;
    complaint_Description: string;
    project_Start_Date: string;
    complaint_Date: string;
    created_by: string;
    phone: string;
}

const WorkerComplaintHistoryScreen = () => {
    const { theme } = useTheme();
    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [updatedSubject, setUpdatedSubject] = useState("");
    const [updatedComplaint, setUpdatedComplaint] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const workerName = await AsyncStorage.getItem("workerName"); // store this during login or onboarding

                if (!workerName) {
                    Alert.alert("Error", "Worker name not found");
                    return;
                }

                const response = await fetch(`http://192.168.129.119:5001/get-complaints-by-worker/${workerName}`);
                const data = await response.json();

                if (data.status === "OK") {
                    setComplaints(data.data);
                    await AsyncStorage.setItem("submittedRequests", JSON.stringify(data.data)); // optional caching
                } else {
                    Alert.alert("Error", data.message || "Could not fetch complaints");
                }

            } catch (error) {
                console.error("Failed to load complaints", error);
            }
        };

        fetchComplaints();
    }, []);


    const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);
    const handleMessage = (phone: string) => Linking.openURL(`sms:${phone}`);

    const handleShare = async (item: Complaint) => {
        const message = `Complaint Details:\nComplaint ID: ${item.complaint_Id}\nProject ID: ${item.project_Id}\nDescription: ${item.project_Description}\nStart Date: ${item.project_Start_Date}\nSubject: ${item.subject}\nComplaint: ${item.complaint_Description}\nDate: ${item.complaint_Date}\nPhone: ${item.phone}`;
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
        setUpdatedComplaint(item.complaint_Description);
        setModalVisible(true);
    };


    const handleSaveEdit = async () => {
        if (!selectedComplaint) return;

        try {
            const response = await fetch(`http://192.168.129.119:5001/update-complaint/${selectedComplaint.project_Id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subject: updatedSubject,
                    complaint_Description: updatedComplaint
                })
            });

            const data = await response.json();

            if (data.status === "OK") {
                const updatedComplaints = complaints.map(c =>
                    c.project_Id === selectedComplaint.project_Id
                        ? { ...c, subject: updatedSubject, complaint_Description: updatedComplaint }
                        : c
                );
                await saveComplaints(updatedComplaints);
                setModalVisible(false);
            } else {
                Alert.alert("Update failed", data.data || "Something went wrong");
            }
        } catch (error) {
            console.error("Error updating complaint:", error);
            Alert.alert("Error", "Could not update complaint");
        }
    };


    const handleDelete = (complaint_Id: string) => {
        Alert.alert("Confirm Delete", "Are you sure you want to delete this complaint?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                onPress: async () => {
                    try {
                        const response = await fetch(`http://192.168.129.119:5001/delete-complaint/${complaint_Id}`, {
                            method: "DELETE",
                        });

                        const data = await response.json();

                        if (data.status === "OK") {
                            const updatedComplaints = complaints.filter(c => c.complaint_Id !== complaint_Id);
                            saveComplaints(updatedComplaints);
                        } else {
                            Alert.alert("Delete Failed", data.message || "Could not delete the complaint.");
                        }
                    } catch (error) {
                        console.error("Error deleting complaint:", error);
                        Alert.alert("Error", "Failed to delete the complaint.");
                    }
                },
                style: "destructive"
            }
        ]);
    };


    const renderRow = (icon: string, label: string) => (
        <View style={styles.row}>
            <Icon name={icon} size={18} color={theme.text} style={styles.icon} />
            <Text style={[styles.itemText, { color: theme.text }]}>{label}</Text>
        </View>
    );

    const renderItem = ({ item }: { item: Complaint }) => (
        <View style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {renderRow("id-badge", `Complaint ID: ${item.complaint_Id}`)}
            {renderRow("tags", `Project ID: ${item.project_Id}`)}
            {renderRow("info-circle", `Project: ${item.project_Description}`)}
            {renderRow("info-circle", `Details: ${item.long_Project_Description}`)}
            {renderRow("calendar", `Start: ${item.project_Start_Date}`)}
            {renderRow("edit", `Subject: ${item.subject}`)}
            {renderRow("pencil", `Description: ${item.complaint_Description}`)}
            {renderRow("calendar", `Complaint Date: ${item.complaint_Date}`)}
            {renderRow("user", `Created by: ${item.created_by}`)}

            <View style={styles.buttonContainer}>
                {/* First Row: Edit, Delete */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleEdit(item)}>
                        <Icon name="edit" size={18} color={theme.buttonText} />
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.complaint_Id)}>
                        <Icon name="trash" size={18} color="#fff" />
                        <Text style={styles.buttonText}>Delete</Text>
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
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Complaint History" />
            <FlatList
                data={complaints}
                keyExtractor={(item) => item.complaint_Id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.text }]}>No complaints found.</Text>}
            />

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Complaint</Text>
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
                            placeholder="Update Description"
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: theme.primary }]}
                                    onPress={handleSaveEdit}
                                >
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Save</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    listContainer: {
        padding: 16,
    },
    itemCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
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
        fontSize: 15,
        flex: 1,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 8,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        minWidth: 100,
        flex: 1,
        marginHorizontal: 4,
    },
    deleteButton: {
        backgroundColor: "#dc3545",
    },
    buttonText: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    buttonGroup: {
        marginTop: 12,
    },

    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 18,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '85%',
        borderRadius: 12,
        padding: 20,
        minHeight: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    buttonContainer: {
        marginTop: 16,
        gap: 12,
    },

    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
        width: '100%',
    },

    saveButton: {
        flex: 0, // Prevent it from stretching too much
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '48%', // Adjust width to fit both buttons
    },

    cancelButton: {
        flex: 0, // Prevent it from stretching too much
        backgroundColor: '#6c757d', // muted grey
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '48%', // Adjust width to fit both buttons
    },

});

export default WorkerComplaintHistoryScreen;
