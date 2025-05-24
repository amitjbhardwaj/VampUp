import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import axios from "axios";
import Header from "../Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const storedName = await AsyncStorage.getItem("adminName");
        try {
            const response = await axios.get(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}`);
            if (response.data.status === "OK") {
                const filteredProjects = response.data.data.filter((project: Project) => project.status !== "Completed");
                setProjects(filteredProjects);
            } else {
                //console.log("Error fetching projects", response.data);
            }
        } catch (error) {
            //console.log("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFindContractor = (projectId: string) => {
        navigation.navigate("AdminFindContractorScreen", { projectId });
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
                                setProjects(prevProjects => prevProjects.filter(p => p._id !== projectId));
                                //console.log(`Project ${projectId} deleted successfully`);
                            } else {
                                //console.log("Error deleting project", response.data);
                            }
                        } catch (error) {
                            //console.log("Error deleting project:", error);
                        }
                    }
                },
            ]
        );
    };

    const filteredProjects = projects.filter((project) =>
        project.project_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.project_Id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Allocate Project" />
    
            <View style={{ paddingHorizontal: 20 }}>
                <TextInput
                    style={[
                        styles.searchInput,
                        {
                            backgroundColor: theme.card,
                            color: theme.text,
                            borderColor: theme.text,
                        },
                    ]}
                    placeholder="Search by description or ID..."
                    placeholderTextColor={theme.mode === "dark" ? "#aaa" : "#666"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
    
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.primary} />
                ) : (
                    filteredProjects.map((project) => (
                        <View key={project._id} style={[styles.projectCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                            <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_description}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>ID: {project.project_Id}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Created By: {project.created_by || "Unassigned"}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Start Date: {project.project_start_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>End Date: {project.project_end_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Status: {project.status}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}>Completion: {project.completion_percentage}%</Text>
                            {project.contractor_name && (
                                <Text style={[styles.projectDetail, { color: theme.text }]}>Assigned To: {project.contractor_name}</Text>
                            )}
    
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                                    onPress={() => handleFindContractor(project._id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                                        {project.contractor_name ? "Re-Allocate Project" : "Allocate Project"}
                                    </Text>
                                </TouchableOpacity>
    
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: theme.secondary }]}
                                    onPress={() => handleDeleteProject(project._id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
    
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    searchInput: {
        height: 45,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 14,
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
        justifyContent: 'space-between',
        marginTop: 15,
    },
    actionButton: {
        flex: 0.45,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        marginHorizontal: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default AdminAllocateProjectScreen;
