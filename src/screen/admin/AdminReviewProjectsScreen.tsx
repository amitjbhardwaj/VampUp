import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert,
    Linking, TouchableOpacity,
    Image,
    Modal,
    SafeAreaView,
    Platform,
    StatusBar
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Using vector icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import BackIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

interface Project {
    _id: string;
    project_status: string,
}


const AdminReviewProjectsScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [projectStatus, setProjectStatus] = useState<{ [key: string]: { success: boolean, reject: boolean } }>({});
    const [projects, setProjects] = useState<Project[]>([]);


    const fetchCompletedProjects = async () => {
        try {
            const storedName = await AsyncStorage.getItem("adminName");

            if (storedName) {
                const response = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=Completed`);
                const data = await response.json();
                if (data.status === "OK") {
                    // Filter out projects that have status 'Approved' or 'Rejected'
                    const filteredProjects = data.data.filter((project: Project) =>
                        project.project_status !== 'Approved' && project.project_status !== 'Rejected'
                    );
                    setProjects(filteredProjects);
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

    const handleCallContractor = (contractorPhone: string) => {
        Linking.openURL(`tel:${contractorPhone}`).catch((err) =>
            console.error("Error calling contractor:", err)
        );
    };

    const handleApprove = async (projectId: string) => {
        if (!projectId) {
            Alert.alert("Error", "Project ID is missing.");
            return;
        }

        try {
            const response = await axios.put(`http://192.168.129.119:5001/update-project-status/${projectId}`, {
                project_status: 'Approved',
            });

            if (response.data.status === "OK") {
                // Update the state to reflect the project approval
                setProjectStatus(prevState => ({
                    ...prevState,
                    [projectId]: { success: true, reject: false },
                }));

                // Remove the approved project from the list
                setProjects((prevProjects) =>
                    prevProjects.filter(project => project._id !== projectId)
                );

                // Hide the animation after 2 seconds
                setTimeout(() => {
                    setProjectStatus(prevState => ({
                        ...prevState,
                        [projectId]: { success: false, reject: false },
                    }));
                }, 2000);
            } else {
                console.log("Error updating project:", response.data);
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };


    const handleReject = async (projectId: string) => {
        if (!projectId) {
            Alert.alert("Error", "Project ID is missing.");
            return;
        }

        try {
            const response = await axios.put(`http://192.168.129.119:5001/update-project-status/${projectId}`, {
                project_status: 'Rejected',
            });

            if (response.data.status === "OK") {
                setProjectStatus(prevState => ({
                    ...prevState,
                    [projectId]: { success: false, reject: true },
                }));

                // Remove the approved project from the list
                setProjects((prevProjects) =>
                    prevProjects.filter(project => project._id !== projectId)
                );

                // Hide the animation after 2 seconds
                setTimeout(() => {
                    setProjectStatus(prevState => ({
                        ...prevState,
                        [projectId]: { success: false, reject: false },
                    }));
                }, 2000);
            } else {
                console.log("Error updating project:", response.data);
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(`http://192.168.129.119:5001${imageUrl}`);
        setModalVisible(true);
    };

    const closeImageModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    const renderProjectDetails = (project: any) => {
        const status = projectStatus[project._id] || { success: false, reject: false };

        return (
            <View key={project.project_Id} style={[styles.card, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}>
                <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="id-card" size={20} /> Project ID: {project.project_Id}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="info-circle" size={20} /> Project Description: {project.long_project_description}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="user" size={20} /> Worker Name: {project.worker_name}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="calendar" size={20} /> Start Date: {project.project_start_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="calendar-check-o" size={20} /> End Date: {project.project_end_date}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="info-circle" size={20} /> Status: {project.status}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="percent" size={20} /> Completion Percentage: {project.completion_percentage}%</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="user" size={20} /> Contractor Name: {project.contractor_name}</Text>
                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}><FontAwesome name="phone" size={20} /> Contractor Phone: {project.contractor_phone}</Text>

                {/* Success animation without background */}
                {status.success && (
                    <Text style={[styles.successMessage, { color: 'green' }]}>Approved!</Text>
                )}

                {/* Reject animation without background */}
                {status.reject && (
                    <Text style={[styles.rejectMessage, { color: 'red' }]}>Rejected!</Text>
                )}

                {/* Image List with View Icons */}
                {project.images && project.images.length > 0 && (
                    <View style={styles.imageList}>
                        {project.images.map((imgUrl: string, index: number) => {
                            const imageName = imgUrl.split("/").pop(); // Extract image file name
                            return (
                                <View key={index} style={styles.imageRow}>
                                    <Text style={[styles.imageText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{imageName}</Text>
                                    <TouchableOpacity onPress={() => openImageModal(imgUrl)}>
                                        <Icon name="visibility" size={30} color={theme.mode === 'dark' ? '#fff' : '#007bff'} />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* Modal for Viewing Image */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={closeImageModal} style={styles.closeButton}>
                                <Icon name="close" size={30} color="white" />
                            </TouchableOpacity>
                            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} />}
                        </View>
                    </View>
                </Modal>

                {/* Buttons Section */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.callButton]} onPress={() => handleCallContractor(project.contractor_phone)}>
                        <Text style={styles.buttonText}>Call Contractor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => handleApprove(project._id)}>
                        <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(project._id)}>
                        <Text style={styles.buttonText}>Reject</Text>
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
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <BackIcon name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.screenTitle, { color: theme.text }]}>Completed Projects</Text>
            </View>
            <ScrollView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
                {projects.length > 0 ? (
                    projects.map((project) => renderProjectDetails(project))
                ) : (
                    <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                        No completed projects found.
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
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
        borderRadius: 5,
        marginVertical: 8,
        alignItems: "center",
    },
    callButton: {
        backgroundColor: "#007bff", // Blue
    },
    approveButton: {
        backgroundColor: "#28a745", // Green
    },
    rejectButton: {
        backgroundColor: "#ff3b30", // Red
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
        color: "red",
        textAlign: "center",     
    },
    successMessageContainer: {
        backgroundColor: "green",
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
    },
    successMessage: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    rejectMessageContainer: {
        backgroundColor: "red",
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
    },
    rejectMessage: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    imageList: {
        marginTop: 10,
    },
    imageRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    imageText: {
        color: "#007bff",
        fontWeight: "500",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    fullImage: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
    projectTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
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

export default AdminReviewProjectsScreen;
