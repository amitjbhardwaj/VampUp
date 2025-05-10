import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Linking, TouchableOpacity, SafeAreaView, Platform, StatusBar, Modal } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Import your theme context
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import Header from "../Header";
import axios from "axios";
import DatePicker from "react-native-date-picker";

const AdminOnHoldProjectsScreen = () => {
    const { theme } = useTheme(); // Get theme for dark mode handling
    const navigation = useNavigation();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [funds, setFunds] = useState<Record<string, number>>({});
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [activateModalVisible, setActivateModalVisible] = useState<boolean>(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [endDate, setEndDate] = useState<Date>(new Date()); // Store as Date object

    const fetchFundsForProjects = async (projects: any[]) => {
        const fundMap: Record<string, number> = {};

        for (const project of projects) {
            try {
                const response = await fetch(`http://192.168.129.119:5001/get-fund-by-project?project_Id=${project.project_Id}`);
                const data = await response.json();
                if (data.status === "OK") {
                    fundMap[project.project_Id] = data.data.new_amount_allocated || 0;
                } else {
                    fundMap[project.project_Id] = 0;
                }
            } catch (error) {
                console.error(`Error fetching fund for ${project.project_Id}:`, error);
                fundMap[project.project_Id] = 0;
            }
        }

        setFunds(fundMap);
    };

    const fetchOnHoldProjects = async () => {
        try {
            // Get admin name from AsyncStorage
            const storedName = await AsyncStorage.getItem("adminName");

            if (storedName) {
                // Fetch the OnHold projects for the admin
                const response = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=On-Hold`);
                const data = await response.json();
                if (data.status === "OK") {
                    setProjects(data.data); // Set the list of OnHold projects
                    fetchFundsForProjects(data.data); // Fetch funds after projects load
                } else {
                    setProjects([]); // No projects found
                }
            } else {
                setProjects([]); // No admin name found
            }
        } catch (error) {
            console.error("Error fetching OnHold projects:", error);
            setError("Failed to load OnHold projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOnHoldProjects();
    }, []);

    const handleActive = (projectId: string) => {
        setSelectedProjectId(projectId);
        setActivateModalVisible(true);
        setOpenEndDate(true);
    };

    const handleDelete = (projectId: string) => {
        Alert.alert("Confirm", "Are you sure you want to delete this project?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => deleteProject(projectId) },
        ]);
    };

    const handleCallContractor = (contractorPhone: string) => {
        Linking.openURL(`tel:${contractorPhone}`).catch((err) =>
            console.error("Error calling contractor:", err)
        );
    };

    const handleConfirmActivate = async () => {
        if (!selectedProjectId || !endDate) {
            Alert.alert("Please enter a valid end date.");
            return;
        }

        // Format the date to yyyy-mm-dd format
        const formattedEndDate = endDate.toISOString().split('T')[0]; // "yyyy-mm-dd"

        try {
            const response = await axios.put(
                `http://192.168.129.119:5001/update-project-active/${selectedProjectId}`,
                {
                    project_end_date: formattedEndDate,
                    status: "In-Progress",
                    reason_on_hold: "N/A",
                }
            );

            if (response.data.status === "OK") {
                console.log(`Project ${selectedProjectId} activated!`);
                fetchOnHoldProjects();
            } else {
                console.log("Error updating project:", response.data);
            }
        } catch (error) {
            console.error("Error activating project:", error);
        } finally {
            setActivateModalVisible(false);
        }
    };

    const deleteProject = async (projectId: string) => {
        try {
            const response = await axios.delete(`http://192.168.129.119:5001/delete-project/${projectId}`);
            if (response.data.status === "OK") {
                Alert.alert(`Project ${projectId} deleted successfully`);
            } else {
                console.log("Error deleting project", response.data);
            }
        } catch (error) {
            console.log("Error deleting project:", error);
        }
    };

    const renderProjectDetails = (project: any) => {
        return (
            <View style={[styles.card, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}>
                <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_Id}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="info-circle" size={20} /> Description: {project.project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="info-circle" size={20} /> Project full Description: {project.long_project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="user" size={20} /> Worker Name: {project.worker_name}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="calendar" size={20} /> Start Date: {project.project_start_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="calendar-check-o" size={20} /> End Date: {project.project_end_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="info-circle" size={20} /> Status: {project.status}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="percent" size={20} /> Completion Percentage: {project.completion_percentage}%</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="user" size={20} /> Contractor Name: {project.contractor_name}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="phone" size={20} /> Contractor Phone: {project.contractor_phone}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                    <FontAwesome name="money" size={20} /> Fund Allocated: ₹{funds[project.project_Id] ?? 0}
                </Text>
                {/* Buttons with custom padding */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity  style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleActive(project._id)}>
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleDelete(project._id)}>
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => handleCallContractor(project.contractor_phone)}>
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Call Contractor</Text>
                    </TouchableOpacity>
                </View>


            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="On Hold Projects" />
            <ScrollView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
                {projects.length > 0 ? (
                    projects.map((project: any) => (
                        <View key={project.project_Id}>
                            {renderProjectDetails(project)}
                        </View>
                    ))
                ) : (
                    <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                        No on-hold projects found.
                    </Text>
                )}

                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={activateModalVisible}
                    onRequestClose={() => setActivateModalVisible(false)}
                >
                    {/* Show DatePicker when openEndDate is true */}
                    <DatePicker
                        modal
                        open={openEndDate}
                        date={endDate}
                        mode="date"
                        onConfirm={(date) => {
                            setEndDate(date);
                            setOpenEndDate(false); // Close the DatePicker when a date is selected
                        }}
                        onCancel={() => setOpenEndDate(false)} // Close DatePicker if canceled
                    />
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalView, { backgroundColor: theme.card }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Confirm Activation</Text>
                            {/* Display End Date in yyyy-mm-dd format */}
                            <Text style={[styles.dateText, { color: theme.text }]}>End Date: {endDate.toISOString().split('T')[0]}</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.primary }]} onPress={handleConfirmActivate}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Confirm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.secondary }]} onPress={() => setActivateModalVisible(false)}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        padding: 16,
        borderRadius: 8,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "column", // Arrange buttons vertically
        justifyContent: "space-between",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#007bff",
        borderRadius: 5,
        marginVertical: 8,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    errorText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
    },
    projectTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 10,
        padding: 8,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10, textAlign: 'center' },
    modalButton: { flex: 1, padding: 12, borderRadius: 5, marginHorizontal: 5, alignItems: 'center' },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginVertical: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
});

export default AdminOnHoldProjectsScreen;
