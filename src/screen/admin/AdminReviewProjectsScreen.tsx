import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert,
    Linking, TouchableOpacity,
    Image,
    Modal
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Using vector icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const AdminReviewProjectsScreen = () => {
    const { theme } = useTheme();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchCompletedProjects = async () => {
        try {
            const storedName = await AsyncStorage.getItem("adminName");

            if (storedName) {
                const response = await fetch(`http://192.168.129.119:5001/get-projects-by-admin?created_by=${storedName}&status=Completed`);
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

    const handleCallContractor = (contractorPhone: string) => {
        Linking.openURL(`tel:${contractorPhone}`).catch((err) =>
            console.error("Error calling contractor:", err)
        );
    };

    const handleButtonPress = (action: string, projectId: string) => {
        Alert.alert(`Action: ${action}`, `You selected "${action}" for project ${projectId}`);
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
                    <TouchableOpacity style={[styles.button, styles.approveButton]} onPress={() => handleButtonPress("Approve", project.project_Id)}>
                        <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleButtonPress("Reject", project.project_Id)}>
                        <Text style={styles.buttonText}>Reject</Text>
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
                projects.map((project) => renderProjectDetails(project))
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
    paymentButton: {
        backgroundColor: "#ff9500", // Orange
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
    imageList: {
        marginTop: 5, // Reduced top margin
    },

    imageText: {
        fontSize: 16,
        fontWeight: "500", // Slightly bold for better readability
    }
    ,
    imageRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 5, // Keeps name and icon close
        marginBottom: 6, // Reduced spacing
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        height: "70%",
        alignItems: "center",
        justifyContent: "center",
    },
    fullImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    closeButton: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
    },
    imageContainer: {
        marginVertical: 10,
    },
    projectImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginRight: 10,
    },
    projectTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
});

export default AdminReviewProjectsScreen;
