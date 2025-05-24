import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Animated, Easing, ActivityIndicator, SafeAreaView, Platform, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import Header from "../Header";

interface Project {
    project_status: string;
    first_level_payment_status: string,
    second_level_payment_status: string,
}

const WorkerWorkHistoryScreen = () => {
    const { theme } = useTheme();
    const [completedProjects, setCompletedProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for fade-in effect
    const [workerName, setWorkerName] = useState<string | null>(null);

    useEffect(() => {
    const fetchCompletedProjects = async () => {
        try {
            const storedWorkerName = await AsyncStorage.getItem("workerName");
            if (!storedWorkerName) {
                console.error("No worker name found in AsyncStorage.");
                return;
            }

            //console.log(`Retrieved Worker Name: ${storedWorkerName}`);
            setWorkerName(storedWorkerName);

            const response = await axios.get(
                `http://192.168.129.119:5001/get-completed-projects?workerName=${storedWorkerName}`
            );

            ////console.log("API Response:", response.data);

            if (
                response.data.status === "OK" &&
                Array.isArray(response.data.data) &&
                response.data.data.length > 0
            ) {
                // Apply filter to include only approved projects
                const filteredProjects = (response.data.data as Project[]).filter(
                    (project) =>
                        project.project_status === "Approved" &&
                        project.first_level_payment_status === "Approved" &&
                        project.second_level_payment_status === "Approved"
                );

                setCompletedProjects(filteredProjects);

                // Trigger the fade-in animation when the data is loaded
                Animated.timing(fadeAnim, {
                    toValue: 1, // Make it fully opaque
                    duration: 500, // Adjust the duration of the fade-in effect
                    easing: Easing.ease,
                    useNativeDriver: true,
                }).start();
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
        </View>
    );

    if (error) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: theme.mode === 'dark' ? '#000' : '#fff' }]}>
                <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Completed Projects" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <FlatList
                    data={completedProjects}
                    keyExtractor={(item, index) => item.project_Id || index.toString()}
                    renderItem={renderProjectCard}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: theme.mode === 'dark' ? '#fff' : '#777' }]}>
                            No completed projects yet.
                        </Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    emptyText: { fontSize: 16, textAlign: "center", marginTop: 20 },
    listContent: { paddingBottom: 20 }, // Add padding to bottom for smoother scrolling
    projectCard: {
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000", // Subtle shadow effect
        shadowOpacity: 0.2, // Softer shadow
        shadowRadius: 8, // Increased shadow blur
        shadowOffset: { width: 0, height: 3 },
    },
    card: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    icon: { marginRight: 15 },
    label: { fontWeight: 'bold', fontSize: 16 },
    value: { fontSize: 14, flexWrap: 'wrap', flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { fontSize: 18, marginTop: 10 },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default WorkerWorkHistoryScreen;
