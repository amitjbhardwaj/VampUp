import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import axios from 'axios';

type AdminAllocateProjectScreenNavigationProp = NavigationProp<RootStackParamList, "AdminAllocateProjectScreen">;

type Project = {
    _id: string;
    project_Id: string;
    project_description: string;
    long_project_description: string;
    assigned_to: string;
    project_start_date: string;
    project_end_date: string;
    contractor_phone: string;
    completion_percentage: number;
    status: string;
};

const AdminAllocateProjectScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<AdminAllocateProjectScreenNavigationProp>();

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

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
            <Text style={[styles.title, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>All Projects</Text>

            {loading ? (
                <ActivityIndicator size="large" color={theme.mode === 'dark' ? '#4CAF50' : '#000'} />
            ) : (
                projects.map((project) => (
                    <View key={project._id} style={[styles.projectCard, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff', borderColor: theme.mode === 'dark' ? '#555' : '#ccc' }]}>
                        <Text style={[styles.projectTitle, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{project.project_description}</Text>
                        <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#ccc' : '#333' }]}>ID: {project.project_Id}</Text>
                        <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#ccc' : '#333' }]}>Assigned To: {project.assigned_to || "Unassigned"}</Text>
                        <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#ccc' : '#333' }]}>Start Date: {project.project_start_date}</Text>
                        <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#ccc' : '#333' }]}>End Date: {project.project_end_date}</Text>
                        <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#ccc' : '#333' }]}>Status: {project.status}</Text>
                        <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#ccc' : '#333' }]}>Completion: {project.completion_percentage}%</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center',
    },
    projectCard: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    projectDetail: {
        fontSize: 14,
        marginBottom: 3,
    },
});

export default AdminAllocateProjectScreen;
