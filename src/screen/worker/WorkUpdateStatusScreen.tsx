import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Modal, TextInput, ScrollView } from "react-native";
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
    const [status, setStatus] = useState<string>("In-Progress");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        // Retrieve saved status from AsyncStorage
        const fetchStatus = async () => {
            try {
                const savedStatus = await AsyncStorage.getItem(`project_status_${project.project_Id}`);
                if (savedStatus) {
                    setStatus(savedStatus);
                }
            } catch (error) {
                console.error("Error fetching saved status from AsyncStorage", error);
            }
        };

        fetchStatus();
    }, [project.project_Id]);

    const handleCompletionChange = (newCompletion: string) => {
        setCompletion(newCompletion);
        const updatedCompletion = parseInt(newCompletion, 10);
        if (updatedCompletion === 100) {
            setStatus("Completed");
        } else if (status !== "On-Hold") {
            setStatus("In-Progress");
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

        onUpdateCompletion(project.project_Id, updatedCompletion);

        if (updatedCompletion === 100) {
            const completedProject = {
                ...project,
                completion_percentage: 100,
                status: "Completed"
            };

            try {
                const storedActiveProjects = await AsyncStorage.getItem("activeProjects");
                let activeProjects = storedActiveProjects ? JSON.parse(storedActiveProjects) : [];

                activeProjects = activeProjects.filter((p: Project) => p.project_Id !== project.project_Id);
                await AsyncStorage.setItem("activeProjects", JSON.stringify(activeProjects));

                const storedCompletedProjects = await AsyncStorage.getItem("completedProjects");
                let completedProjects = storedCompletedProjects ? JSON.parse(storedCompletedProjects) : [];

                completedProjects.push(completedProject);
                await AsyncStorage.setItem("completedProjects", JSON.stringify(completedProjects));

                await AsyncStorage.setItem(`project_status_${project.project_Id}`, "Completed");
                navigation.navigate("WorkerWorkHistoryScreen");
            } catch (error) {
                console.error("Error updating AsyncStorage", error);
            }
            return;
        }

        if (status === "On-Hold") {
            const updatedProject = {
                ...project,
                status: "On-Hold"
            };

            await onUpdateCompletion(updatedProject.project_Id, 0);

            try {
                const storedActiveProjects = await AsyncStorage.getItem("activeProjects");
                let activeProjects = storedActiveProjects ? JSON.parse(storedActiveProjects) : [];

                activeProjects = activeProjects.map((p: Project) =>
                    p.project_Id === updatedProject.project_Id ? updatedProject : p
                );
                await AsyncStorage.setItem("activeProjects", JSON.stringify(activeProjects));
                await AsyncStorage.setItem(`project_status_${project.project_Id}`, "On-Hold");
            } catch (error) {
                console.error("Error updating AsyncStorage", error);
            }
        }

        navigation.goBack();
    };

    const handleHoldWork = () => {
        setIsModalVisible(true);
    };

    const handleSubmitReason = () => {
        if (reason.trim() === "") {
            ToastAndroid.show("Please provide a reason", ToastAndroid.SHORT);
            return;
        }
        setStatus("On-Hold");
        setIsModalVisible(false);
        ToastAndroid.show("Project marked as On Hold", ToastAndroid.SHORT);

        AsyncStorage.setItem(`project_status_${project.project_Id}`, "On-Hold");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setReason("");
    };

    const handleResumeWork = async () => {
        setStatus("In-Progress");
        ToastAndroid.show("Project marked as In-Progress", ToastAndroid.SHORT);

        await AsyncStorage.setItem(`project_status_${project.project_Id}`, "In-Progress");
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Update Project Status</Text>

                <ScrollView>
                    {projectDetails(project, status).map(({ label, value }) => (
                        <View key={label} style={styles.card}>
                            <Text style={styles.label}>{label}</Text>
                            <Text style={styles.value}>{value}</Text>
                        </View>
                    ))}

                    <Text style={styles.label}>Completion Percentage</Text>
                    <Picker
                        selectedValue={completion}
                        onValueChange={handleCompletionChange}
                        style={styles.picker}
                        enabled={status !== "On-Hold"}  // Disable Picker when status is "On-Hold"
                    >
                        {[...Array(101).keys()].map((i) => (
                            <Picker.Item key={i} label={`${i}%`} value={String(i)} />
                        ))}
                    </Picker>

                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                        <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.onHoldButton, status === "On-Hold" && styles.disabledButton]}
                        onPress={handleHoldWork}
                        disabled={status === "On-Hold"} // Disable if the status is "On-Hold"
                    >
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
                </ScrollView>

                {/* Modal */}
                <Modal visible={isModalVisible} animationType="fade" transparent={true} onRequestClose={handleCancel}>
                    <ScrollView>
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
        { label: "Assigned To", value: project.assigned_to },
        { label: "Start Date", value: project.project_start_date },
        { label: "End Date", value: project.project_end_date },
    ];

    details.push({ label: "Status", value: status });

    return details;
};

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: { flex: 1, padding: 16, backgroundColor: "#f8f8f8" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    label: { fontSize: 16, fontWeight: "600" },
    value: { fontSize: 16, color: "#555", marginBottom: 8 },
    picker: { height: 50, marginVertical: 16 },
    updateButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    updateButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    onHoldButton: {
        backgroundColor: "#FF9800",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    onHoldButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    resumeButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    resumeButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    goBackButton: {
        backgroundColor: "#BDBDBD",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    goBackButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
    modalContent: { backgroundColor: "white", padding: 16, borderRadius: 10, width: "80%" },
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
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 5,
        width: "48%",
        alignItems: "center",
    },
    submitButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    cancelButton: {
        backgroundColor: "#FF5722",
        paddingVertical: 12,
        borderRadius: 5,
        width: "48%",
        alignItems: "center",
    },
    cancelButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

    // Added styles for the card component
    card: {
        backgroundColor: "#fff",
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

});

export default WorkUpdateStatusScreen;
