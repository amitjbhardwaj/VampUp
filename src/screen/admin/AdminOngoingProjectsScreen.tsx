import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Linking, TouchableOpacity, SafeAreaView, Platform, StatusBar } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Import your theme context
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import Icon component from react-native-vector-icons
import { useNavigation } from "@react-navigation/native";
import Header from "../Header";


const AdminOngoingProjectsScreen = () => {
    const { theme } = useTheme(); // Get theme for dark mode handling
    const navigation = useNavigation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOngoingProjects = async () => {
        try {
            // Get admin name from AsyncStorage
            const storedName = await AsyncStorage.getItem("adminName");

            if (storedName) {
                // Fetch the ongoing projects for the admin
                const response = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=In-Progress`);
                const data = await response.json();
                if (data.status === "OK") {
                    setProjects(data.data); // Set the list of ongoing projects
                } else {
                    setProjects([]); // No projects found
                }
            } else {
                setProjects([]); // No admin name found
            }
        } catch (error) {
            console.error("Error fetching ongoing projects:", error);
            setError("Failed to load ongoing projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOngoingProjects();
    }, []);

    const handleMarkCompleted = (projectId: string) => {
        Alert.alert("Confirm", "Are you sure you want to mark this project as completed?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => updateProjectStatus(projectId, "Completed") },
        ]);
    };

    const handleOnHold = (projectId: string) => {
        Alert.alert("Confirm", "Are you sure you want to put this project on hold?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => updateProjectStatus(projectId, "On-Hold") },
        ]);
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

    const updateProjectStatus = async (projectId: string, newStatus: string) => {
        try {
            // Make API call to update the project status
            const response = await fetch(`http://192.168.129.119:5001/update-project-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_Id: projectId, status: newStatus }),
            });
            const data = await response.json();
            if (data.status === "OK") {
                fetchOngoingProjects(); // Reload the project list
            } else {
                setError("Failed to update project status.");
            }
        } catch (error) {
            console.error("Error updating project status:", error);
            setError("Failed to update project status.");
        }
    };

    const deleteProject = async (projectId: string) => {
        try {
            // Make API call to delete the project
            const response = await fetch(`http://192.168.129.119:5001/delete-project`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ project_Id: projectId }),
            });
            const data = await response.json();
            if (data.status === "OK") {
                fetchOngoingProjects(); // Reload the project list
            } else {
                setError("Failed to delete project.");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            setError("Failed to delete project.");
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
                {/* Buttons with custom padding */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleMarkCompleted(project.project_Id)}>
                        <Text style={styles.buttonText}>Mark Completed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleOnHold(project.project_Id)}>
                        <Text style={styles.buttonText}>On-Hold</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleDelete(project.project_Id)}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleCallContractor(project.contractor_phone)}>
                        <Text style={styles.buttonText}>Call Contractor</Text>
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
            <Header title="Ongoing Projects" />
            <ScrollView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
                {projects.length > 0 ? (
                    projects.map((project: any) => (
                        <View key={project.project_Id}>
                            {renderProjectDetails(project)}
                        </View>
                    ))
                ) : (
                    <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                        No ongoing projects found.
                    </Text>
                )}

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
        color: "#fff",
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

});

export default AdminOngoingProjectsScreen;
