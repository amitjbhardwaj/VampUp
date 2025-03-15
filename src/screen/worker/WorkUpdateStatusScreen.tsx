import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Modal, TextInput } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

type WorkUpdateStatusScreenRouteProp = RouteProp<
    RootStackParamList,
    "WorkUpdateStatusScreen"
>;
type WorkUpdateStatusScreenNavigationProp = NavigationProp<RootStackParamList, "WorkUpdateStatusScreen">;


export interface Project {
    project_Id: string;
    project_description: string;
    assigned_to: string;
    project_start_date: string;
    project_end_date: string;
    contractor_phone: string;
    completion_percentage: number;
}

const WorkUpdateStatusScreen = () => {
    const route = useRoute<WorkUpdateStatusScreenRouteProp>();
    const navigation = useNavigation<WorkUpdateStatusScreenNavigationProp>();
    const { project, onUpdateCompletion } = route.params;

    const [completion, setCompletion] = useState<string>(String(project.completion_percentage));
    const [status, setStatus] = useState<string>("In-Progress"); // Track project status
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
    const [reason, setReason] = useState(""); // Reason for holding work

    // Handle Completion percentage change
    const handleCompletionChange = (newCompletion: string) => {
        setCompletion(newCompletion);
    
        const updatedCompletion = parseInt(newCompletion, 10);
        if (updatedCompletion === 100) {
            setStatus("Completed"); // Immediately set status to "Completed" if 100% selected
        } else if (updatedCompletion < 100 && status !== "On-Hold") {
            setStatus("On-Hold"); // Set status to "On-Hold" if less than 100% and not already On-Hold
        } else if (status !== "On-Hold") {
            setStatus("In-Progress"); // Set status to "In-Progress" if not on hold
        }
    };
    

    const handleUpdate = async () => {
        if (!onUpdateCompletion) {
            console.error("onUpdateCompletion is not provided.");
            return;
        }
    
        const updatedCompletion = parseInt(completion, 10);
        if (isNaN(updatedCompletion) || updatedCompletion < 0 || updatedCompletion > 100) {
            ToastAndroid.show("Please select a valid percentage (0-100)", ToastAndroid.SHORT);
            return;
        }
    
        // Set the status to On-Hold if the completion percentage is less than 100
        if (updatedCompletion < 100 && status !== "On-Hold") {
            setStatus("On-Hold");
        }
    
        onUpdateCompletion(project.project_Id, updatedCompletion);
    
        if (updatedCompletion === 100) {
            const completedProject = { 
                ...project, 
                completion_percentage: 100,  
                status: "Completed" 
            };
    
            try {
                // Get stored active projects
                const storedActiveProjects = await AsyncStorage.getItem("activeProjects");
                let activeProjects = storedActiveProjects ? JSON.parse(storedActiveProjects) : [];
    
                // Remove the completed project from active projects
                activeProjects = activeProjects.filter((p: Project) => p.project_Id !== project.project_Id);
                await AsyncStorage.setItem("activeProjects", JSON.stringify(activeProjects));
    
                // Add to completed projects
                const storedCompletedProjects = await AsyncStorage.getItem("completedProjects");
                let completedProjects = storedCompletedProjects ? JSON.parse(storedCompletedProjects) : [];
    
                completedProjects.push(completedProject);
                await AsyncStorage.setItem("completedProjects", JSON.stringify(completedProjects));
    
                // Navigate to WorkerWorkHistoryScreen
                navigation.navigate("WorkerWorkHistoryScreen");
    
            } catch (error) {
                console.error("Error updating AsyncStorage", error);
            }
            return;
        }
    
        // If completion is not 100, go back
        navigation.goBack();
    };
    

    const handleHoldWork = () => {
        setIsModalVisible(true); // Show modal when Hold Work is pressed
    };

    const handleSubmitReason = () => {
        if (reason.trim() === "") {
            ToastAndroid.show("Please provide a reason", ToastAndroid.SHORT);
            return;
        }
        // Set project status to "On-Hold"
        setStatus("On-Hold");
        console.log("Work is on hold. Reason:", reason);
        setIsModalVisible(false); // Close modal
        setReason(""); // Reset the reason
        ToastAndroid.show("Project marked as On Hold", ToastAndroid.SHORT);
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close modal without taking action
        setReason(""); // Reset the reason
    };

    const handleResumeWork = () => {
        setStatus("In-Progress"); // Change status to "In-Progress"
        ToastAndroid.show("Project marked as In-Progress", ToastAndroid.SHORT);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Project Status</Text>

            {projectDetails(project, status).map(({ label, value }) => (
                <View key={label} style={styles.card}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>{value}</Text>
                </View>
            ))}

            <Text style={styles.label}>Completion Percentage</Text>
            <Picker
                selectedValue={completion}
                onValueChange={handleCompletionChange} // Use the new handler
                style={styles.picker}
            >
                {[...Array(101).keys()].map((i) => (
                    <Picker.Item key={i} label={`${i}%`} value={String(i)} />
                ))}
            </Picker>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.onHoldButton} onPress={handleHoldWork}>
                <Text style={styles.onHoldButtonText}>Hold Work</Text>
            </TouchableOpacity>

            {status === "On-Hold" && (
                <TouchableOpacity style={styles.resumeButton} onPress={handleResumeWork}>
                    <Text style={styles.resumeButtonText}>Resume Work</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                <Text style={styles.goBackButtonText}>Go Back</Text>
            </TouchableOpacity>

            {/* Modal for holding work */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Project On Hold</Text>

                        {projectDetails(project, status).map(({ label, value }) => (
                            <View key={label} style={styles.card}>
                                <Text style={styles.label}>{label}</Text>
                                <Text style={styles.value}>{value}</Text>
                            </View>
                        ))}

                        <Text style={styles.label}>Reason for Hold</Text>
                        <TextInput
                            style={styles.reasonInput}
                            value={reason}
                            onChangeText={setReason}
                            placeholder="Enter reason"
                            multiline
                            numberOfLines={4}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReason}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const projectDetails = (project: Project, status: string) => {
    const details = [
        { label: "Project ID", value: project.project_Id },
        { label: "Description", value: project.project_description },
        { label: "Assigned To", value: project.assigned_to },
        { label: "Start Date", value: project.project_start_date },
        { label: "End Date", value: project.project_end_date },
    ];

    details.push({ label: "Status", value: status });

    return details;
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    card: { backgroundColor: "#fff", padding: 10, marginBottom: 10, borderRadius: 8 },
    label: { fontWeight: "bold", fontSize: 16 },
    value: { fontSize: 14, color: "#333" },
    picker: { height: 50, width: "100%", borderColor: "#ccc", borderWidth: 1, marginBottom: 20, borderRadius: 5 },
    updateButton: { backgroundColor: "#007BFF", padding: 10, alignItems: "center", borderRadius: 10, marginBottom: 10 },
    updateButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    onHoldButton: { backgroundColor: "#FF8C00", padding: 10, alignItems: "center", borderRadius: 10, marginBottom: 10 },
    onHoldButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    resumeButton: { backgroundColor: "#28A745", padding: 10, alignItems: "center", borderRadius: 10, marginBottom: 10 },
    resumeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    goBackButton: { backgroundColor: "#D3D3D3", padding: 10, alignItems: "center", borderRadius: 10 },
    goBackButtonText: { color: "#000", fontWeight: "bold", fontSize: 16 },

    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center"
    },
    reasonInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        height: 100,
        textAlignVertical: "top",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    submitButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        width: "45%",
        alignItems: "center"
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    cancelButton: {
        backgroundColor: "#D3D3D3",
        padding: 10,
        borderRadius: 5,
        width: "45%",
        alignItems: "center"
    },
    cancelButtonText: {
        color: "#000",
        fontWeight: "bold"
    },
});

export default WorkUpdateStatusScreen;
