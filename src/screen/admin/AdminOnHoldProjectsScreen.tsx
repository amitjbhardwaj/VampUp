import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Linking, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext"; // Import your theme context
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminOnHoldProjectsScreen = () => {
    const { theme } = useTheme(); // Get theme for dark mode handling

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const handleMarkCompleted = (projectId: string) => {
        Alert.alert("Confirm", "Are you sure you want to mark this project as completed?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => updateProjectStatus(projectId, "Completed") },
        ]);
    };

    const handleActive = (projectId: string) => {
        Alert.alert("Confirm", "Are you sure you want to put this project in-progress?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => updateProjectStatus(projectId, "In-Progress") },
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
                fetchOnHoldProjects(); // Reload the project list
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
                fetchOnHoldProjects(); // Reload the project list
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
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Project ID: {project.project_Id}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Description: {project.project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Project full Description: {project.long_project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Worker Name: {project.worker_name}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Start Date: {project.project_start_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>End Date: {project.project_end_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Status: {project.status}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Completion Percentage: {project.completion_percentage}%</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Contractor Name: {project.contractor_name}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Contractor Phone: {project.contractor_phone}</Text>

                {/* Buttons with custom padding */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleActive(project.project_Id)}>
                        <Text style={styles.buttonText}>Active</Text>
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
        <ScrollView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
            <Text style={[styles.header, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>OnHold Projects</Text>
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

        </ScrollView>
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
});

export default AdminOnHoldProjectsScreen;
