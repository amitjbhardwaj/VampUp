import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator,
    Alert, Linking, TouchableOpacity, TouchableWithoutFeedback, Image,
    FlatList,
    SafeAreaView,
    Platform,
    StatusBar
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker"; // Import image picker
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import Icon component from react-native-vector-icons
import { RootStackParamList } from "../../RootNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Header from "../Header";
import axios from "axios";

type Admin = {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    mobile: Number,
};

type Project = {
    project_Id: string;
    project_description: string;
    long_project_description: string,
    worker_name: string;
    worker_phone: string;
    project_start_date: string,
    project_end_date: string
    status: string,
    completion_percentage: number;
    contractor_name: string,
    images?: string[];
};

type NavigationProps = StackNavigationProp<RootStackParamList, "ContractorCompletedProjectsScreen">;


const ContractorCompletedProjectsScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProps>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [funds, setFunds] = useState<Record<string, number>>({});
    const [admin, setAdmin] = useState<string>('');
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);


    const IMAGE_BASE_URL = 'http://192.168.129.119:5001'; // Adjust this base URL to your image server base URL.

    const fetchFundsForProjects = async (projects: any[]) => {
        const fundMap: Record<string, number> = {};

        for (const project of projects) {
            try {
                const response = await fetch(IMAGE_BASE_URL + `/get-fund-by-project?project_Id=${project.project_Id}`);
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
        let isMounted = true;
        const fetchData = async () => {
            if (isMounted) {
                await fetchCompletedProjects();
            }
        };
        fetchData();
        return () => { isMounted = false };
    }, []);


    const fetchCompletedProjects = async () => {
        try {
            const storedName = await AsyncStorage.getItem("contractorName");
            if (storedName) {
                const response = await fetch(IMAGE_BASE_URL + `/get-projects-by-contractor?contractor_name=${storedName}&status=Completed`);
                const data = await response.json();
                setProjects(data.status === "OK" ? data.data : []);
                fetchFundsForProjects(data.data); // Fetch funds after projects load

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

    const fetchAdmins = async (projectId: string) => {
        if (!projectId) {
            console.error("Invalid project ID");
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.get(IMAGE_BASE_URL + `/get-project/${projectId}`);
            if (response.data.status === "OK") {
                const createdBy = response.data.data.created_by;    
                setAdmin(createdBy);
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };
    



    const handleSecondLevelApproval = async (projectId: string) => {
        setSelectedProjectId(projectId);
        await fetchAdmins(projectId);
        setShowAdminModal(true);
    };

    const handleUpdateApprovers = async (adminFullName: string) => {
        console.log("Selected project ", selectedProjectId)
        if (!selectedProjectId) return;

        try {
            const contractorName = await AsyncStorage.getItem("contractorName");
            const response = await axios.put(IMAGE_BASE_URL + `/update-approvers/${selectedProjectId}`,
                {
                    first_level_approver: contractorName,
                    second_level_approver: adminFullName,
                }
            );

            if (response.data.status === "OK") {
                Alert.alert("Success", "Approvers updated successfully.");
                setShowAdminModal(false);
                setSelectedProjectId(null);
                fetchCompletedProjects(); // Refresh project data
            } else {
                Alert.alert("Error", response.data.message);
            }
        } catch (error) {
            console.error("Error updating approvers:", error);
            Alert.alert("Error", "Failed to update approvers.");
        }
    };

    const handleCallWorker = (workerPhone: string) => {
        Linking.openURL(`tel:${workerPhone}`).catch((err) => console.error("Error calling worker:", err));
    };

    const handleUploadEvidence = async (projectId: string) => {
        setSelectedImages([]); // Reset previously selected images

        Alert.alert(
            "Upload Evidence",
            "Choose an option",
            [
                { text: "Gallery", onPress: () => pickImage(projectId) },
                { text: "Camera", onPress: () => takePhoto(projectId) },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const pickImage = (projectId: string) => {
        launchImageLibrary({ mediaType: "photo", quality: 1, selectionLimit: 5 }, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
                return;
            }
            if (response.errorMessage) {
                console.error("Image Picker Error: ", response.errorMessage);
                Alert.alert("Error", response.errorMessage);
                return;
            }

            const uris = response.assets?.map(asset => asset.uri).filter(uri => uri !== undefined) as string[];
            if (uris.length > 0) {
                setSelectedImages(uris);
                uploadImages(projectId, uris); // Upload after selection
            }
        });
    };

    const takePhoto = (projectId: string) => {
        launchCamera({ mediaType: "photo", quality: 1 }, (response) => {
            if (response.didCancel) {
                console.log("User cancelled camera");
                return;
            }
            if (response.errorMessage) {
                console.error("Camera Error: ", response.errorMessage);
                Alert.alert("Error", response.errorMessage);
                return;
            }

            const uri = response.assets?.[0]?.uri;
            if (uri) {
                setSelectedImages([uri]);
                uploadImages(projectId, [uri]); // Upload after capture
            }
        });
    };

    const uploadImages = async (projectId: string, images: string[]) => {
        try {
            const formData = new FormData();
            formData.append("project_Id", projectId);

            images.forEach((imageUri, index) => {
                formData.append("images", {
                    uri: imageUri,
                    name: `image_${index}.jpg`,
                    type: "image/jpeg",
                });
            });

            const response = await fetch(IMAGE_BASE_URL + "/upload-images", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === "OK") {
                Alert.alert("Success", "Images uploaded successfully.");
                fetchCompletedProjects();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            //console.error("Error uploading images:", error.message);
            Alert.alert("Upload Failed", "Network request failed. Please try again.");
        }
    };


    const deleteImage = async (projectId: string, imageUrl: string) => {
        try {
            const response = await fetch(IMAGE_BASE_URL + "/delete-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ project_Id: projectId, image_url: imageUrl })
            });

            // Log the response status and text for debugging
            console.log("Response Status:", response.status);
            const responseText = await response.text();
            console.log("Response Body:", responseText);

            // Parse as JSON if valid, else handle error
            if (response.ok) {
                const result = JSON.parse(responseText); // Safely parse the response
                if (result.status === "OK") {
                    Alert.alert("Success", "Image deleted successfully.");
                    fetchCompletedProjects(); // Refresh project list
                } else {
                    Alert.alert("Error", result.message);
                }
            } else {
                Alert.alert("Error", "Failed to delete image.");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            Alert.alert("Delete Failed", "Could not delete image.");
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="Completed Projects" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <FlatList
                    contentContainerStyle={styles.scrollContainer}
                    data={projects}
                    keyExtractor={(item) => item.project_Id}
                    ListEmptyComponent={() => (
                        loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={theme.primary} />
                            </View>
                        ) : (
                            <Text style={[styles.noProjectsText, { color: theme.text }]}>No completed projects found.</Text>
                        )
                    )}
                    renderItem={({ item: project }) => (
                        <View style={[styles.projectCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                            <Text style={[styles.projectTitle, { color: theme.text }]}>{project.project_description}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="id-card" size={20} /> ID: {project.project_Id}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="info-circle" size={20} /> Project Description: {project.long_project_description}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="calendar" size={20} /> Start Date: {project.project_start_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="calendar-check-o" size={20} /> End Date: {project.project_end_date}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="info-circle" size={20} /> Status: {project.status}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="percent" size={20} /> Completion: {project.completion_percentage}%</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="user" size={20} /> Contractor Name: {project.contractor_name}</Text>
                            <Text style={[styles.projectDetail, { color: theme.text }]}><FontAwesome name="user" size={20} /> Worker Name: {project.worker_name}</Text>
                            <Text style={[styles.projectDetail, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                                <FontAwesome name="money" size={20} /> Fund Allocated: ₹{funds[project.project_Id] ?? 0}
                            </Text>
                            {project.images && project.images.length > 0 && (
                                <FlatList
                                    data={project.images}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.imageContainer}>
                                            <Text style={[styles.imageName, { color: theme.text }]}>{item.split('/').pop()}</Text>
                                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(project.project_Id, item)}>
                                                <FontAwesome name="trash" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    numColumns={2}
                                    style={{ marginTop: 10 }}
                                />
                            )}

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={[styles.viewDetailsButton, { backgroundColor: theme.primary }]} onPress={() => handleCallWorker(project.worker_phone)}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Call Worker</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.onHoldButton, { backgroundColor: theme.primary }]} onPress={() => Alert.alert("Need More Work", `Requesting more work for ${project.project_Id}`)}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Need More Work</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.viewDetailsButton, { backgroundColor: theme.primary }]} onPress={() => handleUploadEvidence(project.project_Id)}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Upload Evidence</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.onHoldButton, { backgroundColor: theme.primary }]} onPress={() => handleSecondLevelApproval(project.project_Id)}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Second Level Approval</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.onHoldButton, { backgroundColor: '#28a745' }]} onPress={() => navigation.navigate("PaymentModeScreen", { projectId: project.project_Id })}>
                                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Make Payment</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>

            {showAdminModal && (
                <View style={[StyleSheet.absoluteFillObject, styles.modalOverlay]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select an Admin</Text>
                        <ScrollView>
                            <TouchableOpacity onPress={() => handleUpdateApprovers(admin)}>
                                <Text style={[styles.adminName, { color: theme.text }]}>{admin}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity style={[styles.modalCloseButton, { backgroundColor: theme.primary }]} onPress={() => setShowAdminModal(false)}>
                            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

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
    projectTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    projectDetail: {
        fontSize: 16,
        marginBottom: 6,
    },
    noProjectsText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        color: '#888',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        flexWrap: 'wrap',
        gap: 10,
    },
    viewDetailsButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        width: '48%',
        marginBottom: 10,
    },
    onHoldButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        width: '48%',
        marginBottom: 10,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    imageName: {
        fontSize: 14,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: "rgba(255, 0, 0, 0.6)",
        borderRadius: 20,
        padding: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
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
    modalOverlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: 'center',
    },
    adminName: {
        fontSize: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default ContractorCompletedProjectsScreen;

