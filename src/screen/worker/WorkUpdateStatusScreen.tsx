import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    ScrollView
} from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import axios from 'axios';

type WorkUpdateStatusScreenRouteProp = RouteProp<RootStackParamList, "WorkUpdateStatusScreen">;
type WorkUpdateStatusScreenNavigationProp = NavigationProp<RootStackParamList, "WorkUpdateStatusScreen">;

export interface Project {
    _id: string;
    project_Id: string;
    project_description: string;
    worker_name: string;
    project_start_date: string;
    project_end_date: string;
    contractor_phone: string;
    completion_percentage: number;
}

const WorkUpdateStatusScreen = () => {
    const { theme } = useTheme();
    const route = useRoute<WorkUpdateStatusScreenRouteProp>();
    const navigation = useNavigation<WorkUpdateStatusScreenNavigationProp>();
    const { project, onUpdateCompletion } = route.params || {};

    const [completion, setCompletion] = useState<string>(String(project?.completion_percentage || 0));
    const [status, setStatus] = useState<string>("In-Progress");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reason, setReason] = useState("");
    const [editableEndDate, setEditableEndDate] = useState(project?.project_end_date || "");
    const [loading, setLoading] = useState(false); // This is already defined

    // If no project is found, show a message and go back
    if (!project) {
        return (
            <View style={styles.container}>
                <Text style={[styles.title, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                    No Project Found
                </Text>
                <TouchableOpacity
                    style={[styles.goBackButton, { backgroundColor: theme.mode === 'dark' ? '#444' : '#000' }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.goBackButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleCompletionChange = (newCompletion: string) => {
        setCompletion(newCompletion);
        const updatedCompletion = parseInt(newCompletion, 10);
        if (updatedCompletion === 100) {
            setStatus("Completed");
            setEditableEndDate(new Date().toISOString().split('T')[0]); // Set end date to today
        } else if (status !== "On-Hold") {
            setStatus("In-Progress");
        }
    };

    const handleUpdate = async () => {
        if (loading) return; // Prevent multiple clicks
        setLoading(true);

        if (!onUpdateCompletion) {
            console.error("onUpdateCompletion is not provided.");
            setLoading(false);
            return;
        }

        const updatedCompletion = parseInt(completion, 10);
        if (isNaN(updatedCompletion) || updatedCompletion < 0 || updatedCompletion > 100) {
            Alert.alert("Please select a valid percentage (0-100)");
            setLoading(false);
            return;
        }

        try {
            const updatedStatus = updatedCompletion === 100 ? "Completed" : "In-Progress";

            const response = await axios.put(
                `http://192.168.129.119:5001/update-project-completion/${project._id}`,
                { 
                    completion_percentage: updatedCompletion,
                    status: updatedStatus 
                }
            );

            if (response.status === 200) {
                Alert.alert("Project updated successfully");

                if (updatedCompletion === 100) {
                    // Move project to completed projects list in AsyncStorage
                    const storedCompletedProjects = await AsyncStorage.getItem("completedProjects");
                    let completedProjects = storedCompletedProjects ? JSON.parse(storedCompletedProjects) : [];

                    completedProjects.push({ ...project, completion_percentage: 100, status: "Completed" });
                    await AsyncStorage.setItem("completedProjects", JSON.stringify(completedProjects));

                    // Remove from active projects
                    const storedActiveProjects = await AsyncStorage.getItem("activeProjects");
                    let activeProjects = storedActiveProjects ? JSON.parse(storedActiveProjects) : [];
                    activeProjects = activeProjects.filter((p: Project) => p._id !== project._id);
                    await AsyncStorage.setItem("activeProjects", JSON.stringify(activeProjects));
                }
            } else {
                Alert.alert("Failed to update project. Please try again.");
            }
        } catch (error) {
            console.error("Error updating project:", error);
            Alert.alert("An error occurred while updating. Please try again.");
        }

        setLoading(false);
        onUpdateCompletion(project._id, updatedCompletion);

        if (updatedCompletion === 100) {
            navigation.navigate("WorkerWorkHistoryScreen");
        } else {
            navigation.goBack();
        }
    };

    const handleSubmitReason = async () => {
        if (reason.trim() === "") {
            Alert.alert("Please provide a reason");
            return;
        }

        setStatus("On-Hold");
        setIsModalVisible(false);

        const updatedProject = {
            ...project,
            status: "On-Hold",
        };

        try {
            // Save status in AsyncStorage
            await AsyncStorage.setItem(`project_status_${project.project_Id}`, "On-Hold");

            // Retrieve current on-hold projects
            const storedOnHoldProjects = await AsyncStorage.getItem("onHoldProjects");
            let onHoldProjects = storedOnHoldProjects ? JSON.parse(storedOnHoldProjects) : [];

            // Check if the project already exists in storage
            const existingIndex = onHoldProjects.findIndex((p: Project) => p.project_Id === updatedProject.project_Id);
            if (existingIndex === -1) {
                onHoldProjects.push(updatedProject);
                await AsyncStorage.setItem("onHoldProjects", JSON.stringify(onHoldProjects));
            }
        } catch (error) {
            console.error("Error updating on-hold projects:", error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setReason("");
    };

    const isDarkMode = theme.mode === "dark";


    return (
        <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
            <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#1c1c1c' : '#fff' }]}>
                <Text style={[styles.title, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Update Project Status</Text>

                {projectDetails(project, status).map(({ label, value }) => (
                    <View key={label} style={[styles.card, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}>
                        <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{label}</Text>
                        <Text style={[styles.value, { color: theme.mode === 'dark' ? '#ccc' : '#555' }]}>{value}</Text>
                    </View>
                ))}
                <View>
                    <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>End Date</Text>
                    <TextInput
                        style={[styles.input, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}
                        value={editableEndDate}
                        onChangeText={setEditableEndDate}
                        placeholder="Enter End Date"
                        placeholderTextColor={theme.mode === 'dark' ? '#bbb' : '#888'}
                    />
                </View>


                <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Completion Percentage</Text>
                <Picker
                    selectedValue={completion}
                    onValueChange={handleCompletionChange}
                    style={{ color: theme.mode === 'dark' ? "#fff" : "#000" }}
                >
                    {[...Array(101).keys()].map((i) => (
                        <Picker.Item key={i} label={`${i}%`} value={String(i)} />
                    ))}
                </Picker>

                <TouchableOpacity 
                    style={[styles.updateButton, { backgroundColor: theme.mode === 'dark' ? '#444' : '#000' }]} 
                    onPress={handleUpdate} 
                    disabled={loading} // Disable when loading is true
                >
                    <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.onHoldButton, { backgroundColor: theme.mode === 'dark' ? '#444' : '#000' }]} 
                    onPress={() => setIsModalVisible(true)}
                    disabled={loading} // Disable when loading is true
                >
                    <Text style={styles.onHoldButtonText}>Hold Work</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.goBackButton, { backgroundColor: theme.mode === 'dark' ? '#444' : '#000' }]} onPress={() => navigation.goBack()}>
                    <Text style={styles.goBackButtonText}>Go Back</Text>
                </TouchableOpacity>

                {/* Modal */}
                <Modal visible={isModalVisible} animationType="fade" transparent={true} onRequestClose={handleCancel}>
                    <ScrollView>
                        <View style={styles.modalOverlay}>
                            <View style={[styles.modalContent, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}>
                                <Text style={[styles.modalTitle, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Project On Hold</Text>

                                {projectDetails(project, status).map(({ label, value }) => (
                                    <View key={label} style={[styles.card, { backgroundColor: theme.mode === 'dark' ? '#444' : '#fff' }]}>
                                        <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{label}</Text>
                                        <Text style={[styles.value, { color: theme.mode === 'dark' ? '#ccc' : '#555' }]}>{value}</Text>
                                    </View>
                                ))}

                                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Reason for Hold</Text>
                                <TextInput
                                    style={[styles.reasonInput, { backgroundColor: theme.mode === 'dark' ? '#444' : '#fff' }]}
                                    value={reason}
                                    onChangeText={setReason}
                                    placeholder="Enter reason"
                                    placeholderTextColor={theme.mode === 'dark' ? '#aaa' : '#888'}
                                    multiline
                                    numberOfLines={4}
                                />

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.mode === 'dark' ? '#4CAF50' : '#4CAF50' }]} onPress={handleSubmitReason}>
                                        <Text style={styles.submitButtonText}>Submit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.mode === 'dark' ? '#000' : '#000' }]} onPress={handleCancel}>
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </View>
        </ScrollView>
    );
};


const projectDetails = (project: Project, status: string) => {
    const details = [
        { label: "Project ID", value: project.project_Id },
        { label: "Description", value: project.project_description },
        { label: "Assigned To", value: project.worker_name },
        { label: "Start Date", value: project.project_start_date },
    ];

    details.push({ label: "Status", value: status });

    return details;
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: 'center' },
    label: { fontSize: 16, fontWeight: "600" },
    value: { fontSize: 16, color: "#555", marginBottom: 8 },
    picker: { height: 50, marginVertical: 16 },
    updateButton: {
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    updateButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    onHoldButton: {
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    onHoldButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    goBackButton: {
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    goBackButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
    modalContent: { padding: 16, borderRadius: 10, width: "80%" },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    reasonInput: {
        borderColor: "#ccc",
        borderWidth: 2,
        padding: 8,
        borderRadius: 8,
        marginVertical: 8,
    },
    modalButtons: { flexDirection: "row", justifyContent: "space-between" },
    submitButton: {
        paddingVertical: 12,
        borderRadius: 5,
        width: "48%",
        alignItems: "center",
    },
    submitButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 5,
        width: "48%",
        alignItems: "center",
    },
    cancelButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

    card: {
        padding: 3,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    disabledButton: {
        backgroundColor: "#BDBDBD", // Gray out the button when it's disabled
        opacity: 0.6, // Add opacity for disabled effect
    },
    input: {
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 8,
        borderRadius: 5,
        marginVertical: 10,
        color: "#000",
    },
});

export default WorkUpdateStatusScreen;
