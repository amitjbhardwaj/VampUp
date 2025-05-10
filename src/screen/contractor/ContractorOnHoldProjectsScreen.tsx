import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Alert, Platform, StatusBar, SafeAreaView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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

const ContractorOnHoldProjectsScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [contractorName, setContractorName] = useState<string | null>(null);
    const [activateModalVisible, setActivateModalVisible] = useState<boolean>(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [endDate, setEndDate] = useState<Date>(new Date()); // Store as Date object
    const [funds, setFunds] = useState<Record<string, number>>({});


    useEffect(() => {
        getContractorInfo();
    }, []);

    useEffect(() => {
        if (contractorName) {
            fetchProjects();
        }
    }, [contractorName]);

    const fetchFundsForProjects = async (projects: any[]) => {
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

    const openActivateModal = (projectId: string) => {
        setSelectedProjectId(projectId);
        setActivateModalVisible(true);
        setOpenEndDate(true);
    };


    const handleConfirmActivate = async () => {
        if (!selectedProjectId || !endDate) {
            Alert.alert("Please enter a valid end date.");
            return;
        }

        // Format the date to yyyy-mm-dd format
        const formattedEndDate = endDate.toISOString().split('T')[0]; // "yyyy-mm-dd"

        try {
            const response = await axios.put(
                `http://192.168.129.119:5001/update-project-active/${selectedProjectId}`,
                {
                    project_end_date: formattedEndDate,
                    status: "In-Progress",
                    reason_on_hold: "N/A",
                }
            );

            if (response.data.status === "OK") {
                console.log(`Project ${selectedProjectId} activated!`);
                fetchProjects();
            } else {
                console.log("Error updating project:", response.data);
            }
        } catch (error) {
            console.error("Error activating project:", error);
        } finally {
            setActivateModalVisible(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://192.168.129.119:5001/get-all-projects');
            if (response.data.status === "OK") {
                const allProjects = response.data.data;

                // Filter only On-Hold projects assigned to the contractor
                const onHoldProjects = allProjects.filter((project: Project) =>
                (project.contractor_name === contractorName &&
                    project.status === "On-Hold")
                );
                setProjects(onHoldProjects);
                fetchFundsForProjects(onHoldProjects);

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
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton1}>
                    <Icon name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.screenTitle, { color: theme.text }]}>On-Hold Projects</Text>
            </View>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
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
                                <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="hashtag" size={20} /> ID: {project.project_Id}</Text>
                                <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="calendar" size={20} /> Start Date: {project.project_start_date}</Text>
                                <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="calendar-check-o" size={20} /> End Date: {project.project_end_date}</Text>
                                <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="info-circle" size={20} /> Status: {project.status}</Text>
                                <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="percent" size={20} /> Completion: {project.completion_percentage}%</Text>
                                <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="user" size={20} /> Assigned To: {project.contractor_name}</Text>
                                <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                                    <FontAwesome name="money" size={20} /> Fund Allocated: ₹{funds[project.project_Id] ?? 0}
                                </Text>
                                {/* Action Buttons */}
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[styles.resumeButton, { backgroundColor: theme.primary }]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>View Details</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.resumeButton, { backgroundColor: theme.secondary }]}
                                        onPress={() => openActivateModal(project._id)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Resume Project</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={activateModalVisible}
                    onRequestClose={() => setActivateModalVisible(false)}
                >
                    {/* Show DatePicker when openEndDate is true */}
                    <DatePicker
                        modal
                        open={openEndDate}
                        date={endDate}
                        mode="date"
                        onConfirm={(date) => {
                            setEndDate(date);
                            setOpenEndDate(false); // Close the DatePicker when a date is selected
                        }}
                        onCancel={() => setOpenEndDate(false)} // Close DatePicker if canceled
                    />
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalView, { backgroundColor: theme.card }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Confirm Activation</Text>
                            {/* Display End Date in yyyy-mm-dd format */}
                            <Text style={[styles.dateText, { color: theme.text }]}>End Date: {endDate.toISOString().split('T')[0]}</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.primary }]} onPress={handleConfirmActivate}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Confirm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.secondary }]} onPress={() => setActivateModalVisible(false)}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
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
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10, textAlign: 'center' },
    modalButton: { flex: 1, padding: 12, borderRadius: 5, marginHorizontal: 5, alignItems: 'center' },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
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
    backButton1: {
        marginRight: 10,
        padding: 8,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default ContractorOnHoldProjectsScreen;
