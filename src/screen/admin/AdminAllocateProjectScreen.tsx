import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import axios from 'axios';

type AdminAllocateProjectScreenNavigationProp = NavigationProp<RootStackParamList, "AdminAllocateProjectScreen">;

type Project = {
    _id: string;
    project_Id: string;
    project_description: string;
    long_project_description: string;
    created_by: string;
    project_start_date: string;
    project_end_date: string;
    contractor_phone: string;
    completion_percentage: number;
    status: string;
    contractor_name?: string;
};

const AdminAllocateProjectScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<AdminAllocateProjectScreenNavigationProp>();
    const route = useRoute();

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://192.168.129.119:5001/get-all-projects');
            if (response.data.status === "OK") {
                setProjects(response.data.data);
            } else {
                console.log("Error fetching projects", response.data);
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFindContractor = (projectId: string) => {
        navigation.navigate("AdminFindContractorScreen", { projectId });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleDeleteProject = async (projectId: string) => {
        Alert.alert(
            "Delete Project",
            "Are you sure you want to delete this project?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        try {
                            const response = await axios.delete(`http://192.168.129.119:5001/delete-project/${projectId}`);
                            if (response.data.status === "OK") {
                                // Remove deleted project from state
                                setProjects(prevProjects => prevProjects.filter(p => p._id !== projectId));
                                console.log(`Project ${projectId} deleted successfully`);
                            } else {
                                console.log("Error deleting project", response.data);
                            }
                        } catch (error) {
                            console.log("Error deleting project:", error);
                        }
                    }
                },
            ]
        );

    };


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Fixed Header */}
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>All Projects</Text>
            </View>

            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} />
                ) : (
                    projects.map((project) => (
                        <View key={project._id} style={[styles.projectCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                            <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_description}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>ID: {project.project_Id}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Created By: {project.created_by || "Unassigned"}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Start Date: {project.project_start_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>End Date: {project.project_end_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Status: {project.status}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Completion: {project.completion_percentage}%</Text>
                            {/* Displaying "Assign To" field */}
                            {project.contractor_name && (
                                <Text style={[styles.projectDetail, { color: theme.text }]}>Assigned To: {project.contractor_name}</Text>
                            )}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.mode === 'dark' ? "#333" : "#000" }]}
                                    onPress={() => handleFindContractor(project._id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Allocate Project</Text>
                                </TouchableOpacity>
                                

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: "#e74c3c" }]} // Red color for delete
                                    onPress={() => handleDeleteProject(project._id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: theme.mode === 'dark' ? "#333" : "#000" }]}
                onPress={handleBack}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 40, // For status bar
        paddingBottom: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100, // Leave space for Back button
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    projectCard: {
        padding: 18,
        borderRadius: 12,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    projectTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    projectDetail: {
        fontSize: 14,
        marginBottom: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures buttons are spaced evenly
        marginTop: 15,
    },
    actionButton: {
        flex: 0.45, // Adjusted for better button width balance
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        marginHorizontal: 5, // Add some space between the buttons
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    backButton: {
        padding: 14,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
});


export default AdminAllocateProjectScreen;
