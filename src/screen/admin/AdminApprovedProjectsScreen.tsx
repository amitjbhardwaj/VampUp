import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../Header";

interface Project {
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
    contractor_name: string;
    worker_name: string;
    project_status: string;
}

const AdminApprovedProjectsScreen = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [funds, setFunds] = useState<Record<string, number>>({});

    const fetchFundsForProjects = async (projects: Project[]) => {
        const fundMap: Record<string, number> = {};

        for (const project of projects) {
            try {
                const response = await fetch(`http://192.168.129.119:5001/get-fund-by-project?project_Id=${project.project_Id}`);
                const data = await response.json();
                if (data.status === "OK") {
                    fundMap[project.project_Id] = data.data.new_amount_allocated || 0;
                } else {
                    fundMap[project.project_Id] = 0;
                }
            } catch (error) {
                console.error(`Error fetching fund for ${project.project_Id}:`, error);
                fundMap[project.project_Id] = 0;
            }
        }

        setFunds(fundMap);
    };

    useEffect(() => {
        const fetchApprovedProjects = async () => {
            try {
                const storedName = await AsyncStorage.getItem("adminName");

                const response = await fetch(
                    `http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=Completed`
                );

                const responseData = await response.json();
                const approvedProjects = (responseData.data as Project[]).filter(
                    (project) => project.project_status === "Approved"
                );

                setProjects(approvedProjects);
                fetchFundsForProjects(approvedProjects); // <-- Fetch funds after projects
            } catch (err) {
                setProjects(null);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedProjects();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />;
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Approved Project" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <FlatList
                    data={projects}
                    keyExtractor={(item) => item.project_Id}
                    renderItem={({ item }) => (
                        <View style={[styles.projectCard, { backgroundColor: theme.card, borderLeftColor: theme.primary }]}>
                            <Text style={[styles.title, { color: theme.text }]}>{item.project_description}</Text>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>📌 Project ID:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>{item.project_Id}</Text>
                            </View>

                            <ScrollView style={styles.descriptionContainer}>
                                <Text style={[styles.label, { color: theme.text }]}>📄 Description:</Text>
                                <Text style={[styles.description, { backgroundColor: theme.background, color: theme.text }]}>
                                    {item.long_project_description}
                                </Text>
                            </ScrollView>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>👤 Created By:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>{item.created_by}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>📅 Start Date:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>{item.project_start_date}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>📅 End Date:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>{item.project_end_date}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>📞 Contractor Phone:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>{item.contractor_phone}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>🏗 Contractor Name:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>{item.contractor_name}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>👷 Worker:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>{item.worker_name}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>⚡ Status:</Text>
                                <Text style={[styles.value, { color: "green", fontWeight: "bold" }]}>
                                    {item.status}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>📊 Completion:</Text>
                                <Text
                                    style={[
                                        styles.value,
                                        { color: item.completion_percentage < 50 ? "#ff9800" : "#28a745", fontWeight: "bold" },
                                    ]}
                                >
                                    {item.completion_percentage} %
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={[styles.label, { color: theme.text }]}>💰 Amount Allocated:</Text>
                                <Text style={[styles.value, { color: theme.text }]}>
                                    ₹ {funds[item.project_Id]?.toLocaleString("en-IN") || "0"}
                                </Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: theme.primary }]}>
                                <Text style={styles.statusText}>{item.project_status}</Text>
                            </View>


                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    projectCard: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        borderLeftWidth: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
    },
    value: {
        fontSize: 14,
        fontWeight: "500",
        flexShrink: 1,
    },
    descriptionContainer: {
        maxHeight: 80,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        padding: 8,
        borderRadius: 8,
    },
    statusBadge: {
        marginTop: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    statusText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 10,
        padding: 8,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default AdminApprovedProjectsScreen;
