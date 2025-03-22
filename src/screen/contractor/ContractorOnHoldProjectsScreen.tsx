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

const ContractorOnHoldProjectsScreen = () => {
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

                // Filter only On-Hold projects assigned to the contractor
                const onHoldProjects = allProjects.filter((project: Project) => 
                    (project.assign_to === contractorName && 
                    project.status === "On-Hold")
                );
                setProjects(onHoldProjects);
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

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>On-Hold Projects</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : projects.length === 0 ? (
                    <Text style={[styles.noProjectsText, { color: theme.text }]}>No on-hold projects assigned to you.</Text>
                ) : (
                    projects.map((project) => (
                        <View key={project._id} style={[styles.projectCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                            <View style={styles.statusContainer}>
                                <Text style={[styles.statusText, { color: 'orange' }]}>On-Hold</Text>
                            </View>
                            <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_description}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>ID: {project.project_Id}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Start Date: {project.project_start_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>End Date: {project.project_end_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Completion: {project.completion_percentage}%</Text>

                            {/* Action Buttons */}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.resumeButton, { backgroundColor: theme.primary }]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>View Details</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.resumeButton, { backgroundColor: theme.secondary }]}
                                    onPress={() => console.log("Resume project clicked")}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buttonText}>Resume Project</Text>
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
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: '#ccc',
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
        backgroundColor: 'rgba(255, 165, 0, 0.2)', // Orange background for on-hold status
        borderRadius: 5,
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    resumeButton: {
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
        fontSize: 16,
    },
    noProjectsText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        color: '#888',
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
});

export default ContractorOnHoldProjectsScreen;
