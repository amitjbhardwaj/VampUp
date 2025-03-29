import React, { useEffect, useState } from "react";
import { 
    View, Text, StyleSheet, ScrollView, ActivityIndicator, 
    Alert, Linking, TouchableOpacity 
} from "react-native";
import { useTheme } from "../../context/ThemeContext"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const ContractorCompletedProjectsScreen = () => {
    const { theme } = useTheme(); 

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompletedProjects = async () => {
        try {
            const storedName = await AsyncStorage.getItem("contractorName");

            if (storedName) {
                const response = await fetch(`http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${storedName}&status=Completed`);
                const data = await response.json();
                if (data.status === "OK") {
                    setProjects(data.data);
                } else {
                    setProjects([]);
                }
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error("Error fetching completed projects:", error);
            setError("Failed to load completed projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedProjects();
    }, []);

    const handleCallWorker = (workerPhone: string) => {
        Linking.openURL(`tel:${workerPhone}`).catch((err) =>
            console.error("Error calling worker:", err)
        );
    };

    const handleButtonPress = (action: string, projectId: string) => {
        Alert.alert(`Action: ${action}`, `You selected "${action}" for project ${projectId}`);
    };

    const renderProjectDetails = (project: any) => {
        return (
            <View style={[styles.card, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]} key={project.project_Id}>
                 <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Project ID: {project.project_Id}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Description: {project.project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Project full Description: {project.long_project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Worker Name: {project.worker_name}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Worker Phone: {project.worker_phone}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Start Date: {project.project_start_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>End Date: {project.project_end_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Status: {project.status}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Completion Percentage: {project.completion_percentage}%</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Contractor Name: {project.contractor_name}</Text>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleCallWorker(project.worker_phone)}>
                        <Text style={styles.buttonText}>Call Worker</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Add Evidence", project.project_Id)}>
                        <Text style={styles.buttonText}>Add Evidence</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Need More Work", project.project_Id)}>
                        <Text style={styles.buttonText}>Need More Work</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Send for Review", project.project_Id)}>
                        <Text style={styles.buttonText}>Send for Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.paymentButton]} onPress={() => handleButtonPress("Make Payment", project.project_Id)}>
                        <Text style={styles.buttonText}>Make Payment</Text>
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
            <Text style={[styles.header, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Completed Projects</Text>
            {projects.length > 0 ? (
                projects.map((project: any) => renderProjectDetails(project))
            ) : (
                <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                    No completed projects found.
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
        flexDirection: "column",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#007bff",
        borderRadius: 5,
        marginVertical: 8,
        alignItems: "center",
    },
    paymentButton: {
        backgroundColor: "#28a745",
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

export default ContractorCompletedProjectsScreen;
