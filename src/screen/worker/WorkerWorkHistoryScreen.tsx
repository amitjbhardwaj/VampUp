import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator"; // Adjust the path as needed
import { useFocusEffect } from "@react-navigation/native";


// Correctly type the navigation prop using RootStackParamList
type WorkerWorkHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerWorkHistoryScreen'>;

const WorkerWorkHistoryScreen = () => {
    const navigation = useNavigation<WorkerWorkHistoryScreenNavigationProp>(); // Explicitly set the type here
    const [completedProjects, setCompletedProjects] = useState<any[]>([]);

    useEffect(() => {
        const loadCompletedProjects = async () => {
            try {
                const storedProjects = await AsyncStorage.getItem("completedProjects");
                if (storedProjects) {
                    setCompletedProjects(JSON.parse(storedProjects));
                }
            } catch (error) {
                console.error("Error loading completed projects", error);
            }
        };

        loadCompletedProjects();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const loadCompletedProjects = async () => {
                try {
                    const storedProjects = await AsyncStorage.getItem("completedProjects");
                    if (storedProjects) {
                        setCompletedProjects(JSON.parse(storedProjects));
                    }
                } catch (error) {
                    console.error("Error loading completed projects", error);
                }
            };
    
            loadCompletedProjects();
        }, [])
    );

    const projectDetails = (project: any) => [
        { label: 'Project ID', value: project.project_Id, icon: 'id-badge' },
        { label: 'Description', value: project.project_description, icon: 'info-circle' },
        { label: 'Assigned To', value: project.assigned_to, icon: 'user' },
        { label: 'Start Date', value: project.project_start_date, icon: 'calendar' },
        { label: 'End Date', value: project.project_end_date, icon: 'calendar' },
        { label: 'Completion', value: `${project.completion_percentage}%`, icon: 'check-circle' }
    ];

    const renderProjectCard = ({ item: project }: { item: any }) => (
        <View style={styles.projectCard}>
            <FlatList
                data={projectDetails(project)}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Icon name={item.icon} size={20} color="#28a745" style={styles.icon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.value}>{item.value}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Completed Projects</Text>

            {/* FlatList handles the scrolling of the project list */}
            <FlatList
                data={completedProjects}
                keyExtractor={(item, index) => item.project_Id || index.toString()}
                renderItem={renderProjectCard}
                ListEmptyComponent={<Text style={styles.emptyText}>No completed projects yet.</Text>}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    emptyText: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 20 },
    projectCard: {
        backgroundColor: "#fff",
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
        backgroundColor: '#007BFF',
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
        backgroundColor: '#000',
        padding: 13,
        marginTop: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default WorkerWorkHistoryScreen;
