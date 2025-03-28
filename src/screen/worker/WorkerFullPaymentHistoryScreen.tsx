import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator"; // Adjust the path as needed
import { useTheme } from "../../context/ThemeContext"; // Assuming you have this context for theme management
import axios from "axios";

// Correctly type the navigation prop using RootStackParamList
type WorkerFullPaymentHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerFullPaymentHistoryScreen'>;

const WorkerFullPaymentHistoryScreen = () => {
    const { theme } = useTheme(); // Get the current theme (light or dark)
    const navigation = useNavigation<WorkerFullPaymentHistoryScreenNavigationProp>(); // Explicitly set the type here
    const [completedProjects, setCompletedProjects] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null); // Error state
    const [workerName, setWorkerName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);  // Loading state


    useEffect(() => {
        const fetchCompletedProjects = async () => {
            try {
                const storedWorkerName = await AsyncStorage.getItem("workerName");
                if (!storedWorkerName) {
                    console.error("No worker name found in AsyncStorage.");
                    return;
                }

                console.log(`Retrieved Worker Name: ${storedWorkerName}`);
                setWorkerName(storedWorkerName);

                const response = await axios.get(
                    `http://192.168.129.119:5001/get-completed-projects?workerName=${storedWorkerName}`
                );

                console.log("API Response:", response.data);

                if (response.data.status === "OK" && Array.isArray(response.data.data) && response.data.data.length > 0) {
                    setCompletedProjects(response.data.data);

                } else {
                    setError("No completed projects found.");
                }
            } catch (error) {
                console.error("Error fetching completed projects", error);
                setError("Failed to fetch completed projects. Please try again.");
            } finally {
                setIsLoading(false); // Hide the loading indicator after the fetch completes
            }
        };

        fetchCompletedProjects();
    }, []);


    const projectDetails = (project: any) => [
        { label: 'Project ID', value: project.project_Id, icon: 'id-badge' },
        { label: 'Description', value: project.project_description, icon: 'info-circle' },
        { label: 'Assigned To', value: project.worker_name, icon: 'user' },
        { label: 'Start Date', value: project.project_start_date, icon: 'calendar' },
        { label: 'End Date', value: project.project_end_date, icon: 'calendar' },
        { label: 'Completion', value: `${project.completion_percentage}%`, icon: 'check-circle' }
    ];

    const renderProjectCard = ({ item: project }: { item: any }) => (
        <View style={[styles.projectCard, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}>
            <FlatList
                data={projectDetails(project)}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Icon name={item.icon} size={20} color={theme.mode === 'dark' ? '#fff' : '#000'} style={styles.icon} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{item.label}</Text>
                            <Text style={[styles.value, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{item.value}</Text>
                        </View>
                    </View>
                )}
            />
            <TouchableOpacity
                style={[styles.paymentButton, { backgroundColor: theme.mode === 'dark' ? '#555' : '#000' }]}
                onPress={() => navigation.navigate("WorkerPaymentDetailsScreen", { project })}
            >
                <Text style={styles.paymentButtonText}>View Payment</Text>
            </TouchableOpacity>
        </View>
    );

        if (error) {
            return (
                <View style={[styles.errorContainer, { backgroundColor: theme.mode === 'dark' ? '#000' : '#fff' }]}>
                    <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                        {error}
                    </Text>
                </View>
            );
        }
    

    return (
        <View style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f9f9f9' }]}>
            <Text style={[styles.title, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Payment History</Text>

            {/* FlatList handles the scrolling of the project list */}
            <FlatList
                data={completedProjects}
                keyExtractor={(item, index) => item.project_Id || index.toString()}
                renderItem={renderProjectCard}
                ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.mode === 'dark' ? '#fff' : '#777' }]}>No completed projects yet.</Text>}
            />

            {/* <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.mode === 'dark' ? '#444' : '#000' }]} onPress={() => navigation.goBack()}>
                <Text style={[styles.backButtonText, { color: theme.mode === 'dark' ? '#fff' : '#fff' }]}>Go Back</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    emptyText: { fontSize: 16, textAlign: "center", marginTop: 20 },
    projectCard: {
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 5,
    },
    card: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    icon: { marginRight: 15 },
    label: { fontWeight: 'bold', fontSize: 16 },
    value: { fontSize: 14, flexWrap: 'wrap', flex: 1 },
    paymentButton: {
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    paymentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    backButton: {
        padding: 13,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    backButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 18, marginTop: 10 },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
});

export default WorkerFullPaymentHistoryScreen;
