import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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
    assign_to?: string;
};

const ContractorAllWorkScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [contractorName, setContractorName] = useState<string | null>(null);

    useEffect(() => {
        getContractorInfo();
    }, []);

    useEffect(() => {
        if (contractorName) {
            fetchProjects();
        }
    }, [contractorName]);

    const getContractorInfo = async () => {
        try {
            const storedName = await AsyncStorage.getItem("contractorName");
            if (storedName) {
                setContractorName(storedName);
            }
        } catch (error) {
            console.error("Error retrieving contractor info:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://192.168.129.119:5001/get-all-projects');
            if (response.data.status === "OK") {
                const allProjects = response.data.data;

                // Filter projects assigned to the contractor
                const assignedProjects = allProjects.filter((project: Project) => project.assign_to === contractorName);
                setProjects(assignedProjects);
            } else {
                console.log("Error fetching projects", response.data);
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (projectId: string) => {
        // Get current date in yyyy-mm-dd format
        const currentDate = new Date().toISOString().split('T')[0]; // "yyyy-mm-dd" format
    
        try {
            // Send API request to update the status and end date
            const response = await axios.put(
                `http://192.168.129.119:5001/update-project-status-enddate/${projectId}`,
                {
                    project_end_date: currentDate,
                    status: "In-Progress",
                }
            );
    
            if (response.data.status === "OK") {
                console.log(`Project ${projectId} activated!`);
                // Optionally, fetch the projects again or update the local state
                fetchProjects(); // Re-fetch to reflect updated project info
            } else {
                console.log("Error updating project:", response.data);
            }
        } catch (error) {
            console.error("Error activating project:", error);
        }
    };
    
    const handleOnHold = async (projectId: string) => {
        // Get current date in yyyy-mm-dd format
        const currentDate = new Date().toISOString().split('T')[0]; // "yyyy-mm-dd" format
    
        try {
            // Send API request to update the status and end date
            const response = await axios.put(
                `http://192.168.129.119:5001/update-project-status-enddate/${projectId}`,
                {
                    project_end_date: currentDate,
                    status: "On-Hold",
                }
            );
    
            if (response.data.status === "OK") {
                console.log(`Project ${projectId} activated!`);
                // Optionally, fetch the projects again or update the local state
                fetchProjects(); // Re-fetch to reflect updated project info
            } else {
                console.log("Error updating project:", response.data);
            }
        } catch (error) {
            console.error("Error activating project:", error);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>My Projects</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} />
                ) : projects.length === 0 ? (
                    <Text style={[styles.noProjectsText, { color: theme.text }]}>No projects assigned to you.</Text>
                ) : (
                    projects.map((project) => (
                        <View key={project._id} style={[styles.projectCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                            <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_description}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>ID: {project.project_Id}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Start Date: {project.project_start_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>End Date: {project.project_end_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Status: {project.status}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Completion: {project.completion_percentage}%</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Assigned To: {project.assign_to}</Text>
                            
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                                    onPress={() => handleActivate(project._id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Activate Project</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.secondary }]}
                                    onPress={() => handleOnHold(project._id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>On-Hold</Text>
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
        paddingTop: 40,
        paddingBottom: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100,
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
    noProjectsText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures buttons are spaced evenly
        marginTop: 15,
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        width: '48%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    backButton: {
        position: 'absolute',
        bottom: 30,
        left: 10, // Align to the left side
        right: 10, // Align to the right side
        paddingVertical: 16, // Increase the padding for more height
        paddingHorizontal: 0, // Remove horizontal padding since the width will stretch
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%', // Stretch button across the entire width
    },
});

export default ContractorAllWorkScreen;
