import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Easing } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { RootStackParamList } from "../../RootNavigator"; // Adjust the path as needed
import { useFocusEffect } from "@react-navigation/native";

// Correctly type the navigation prop using RootStackParamList
type WorkerWorkHistoryScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerWorkHistoryScreen'>;

const WorkerWorkHistoryScreen = () => {
    const navigation = useNavigation<WorkerWorkHistoryScreenNavigationProp>();
    const [completedProjects, setCompletedProjects] = useState<any[]>([]);
    const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for fade-in effect

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

    // Fade-in effect for the content
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, []);

    const projectDetails = (project: any) => [
        { label: 'Project ID', value: project.project_Id, icon: 'id-badge' },
        { label: 'Description', value: project.project_description, icon: 'info-circle' },
        { label: 'Assigned To', value: project.assigned_to, icon: 'user' },
        { label: 'Start Date', value: project.project_start_date, icon: 'calendar' },
        { label: 'End Date', value: project.project_end_date, icon: 'calendar' },
        { label: 'Completion', value: `${project.completion_percentage}%`, icon: 'check-circle' }
    ];

    const renderProjectCard = ({ item: project }: { item: any }) => (
        <Animated.View style={[styles.projectCard, { opacity: fadeAnim }]}>
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
        </Animated.View>
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
                contentContainerStyle={styles.listContent}  // Add padding to the list
            />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}  // Make button feedback smoother
            >
                <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    emptyText: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 20 },
    listContent: { paddingBottom: 20 },  // Add padding to bottom for smoother scrolling
    projectCard: {
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",  // Subtle shadow effect
        shadowOpacity: 0.2,   // Softer shadow
        shadowRadius: 8,     // Increased shadow blur
        shadowOffset: { width: 0, height: 3 },
    },
    card: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    icon: { marginRight: 15 },
    label: { fontWeight: 'bold', fontSize: 16, color: '#333' },
    value: { fontSize: 14, color: '#555', flexWrap: 'wrap', flex: 1 },
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
        backgroundColor: '#28a745',
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
