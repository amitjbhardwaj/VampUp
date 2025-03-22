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

const ContractorActiveWorkScreen = () => {
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

                // Filter only active or in-progress projects assigned to the contractor
                const activeProjects = allProjects.filter((project: Project) => 
                    (project.assign_to === contractorName && 
                    (project.status === "In-Progress" || project.status === "Active"))
                );
                setProjects(activeProjects);
            } else {
                console.log("Error fetching projects", response.data);
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleOnHold = (projectId: string) => {
        // Add logic to handle the "On-Hold" action here
        console.log(`Project ${projectId} is now On-Hold`);
        // Here you would send a request to your server to update the project's status
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>Active Projects</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : projects.length === 0 ? (
                    <Text style={[styles.noProjectsText, { color: theme.text }]}>No active projects assigned to you.</Text>
                ) : (
                    projects.map((project) => (
                        <View key={project._id} style={[styles.projectCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                            <View style={styles.statusContainer}>
                                <Text style={[styles.statusText, { color: 'green' }]}>In-Progress</Text>
                            </View>
                            <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_description}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>ID: {project.project_Id}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Start Date: {project.project_start_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>End Date: {project.project_end_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Status: {project.status}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Completion: {project.completion_percentage}%</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Assigned To: {project.assign_to}</Text>

                            {/* View Details Button and On-Hold Button */}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.viewDetailsButton, { backgroundColor: theme.primary }]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>View Details</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.onHoldButton, { backgroundColor: theme.secondary }]}
                                    activeOpacity={0.8}
                                    onPress={() => handleOnHold(project._id)}
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
        marginBottom: 20,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: 'center',
    },
    projectCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        backgroundColor: "#fff", // background color for the card
        borderWidth: 1,
        borderColor: '#ccc', // subtle border to separate cards
    },
    projectTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    projectDetail: {
        fontSize: 16,
        marginBottom: 6,
    },
    noProjectsText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        color: '#888',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures buttons are spaced evenly
        marginTop: 15,
    },
    viewDetailsButton: {
        marginTop: 15,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        width: '48%', // Adjust width to ensure buttons are aligned
    },
    onHoldButton: {
        marginTop: 15,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        width: '48%', // Adjust width to ensure buttons are aligned
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
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
    statusContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(27, 234, 78, 0.2)',
        borderRadius: 5,
    },
});

export default ContractorActiveWorkScreen;
