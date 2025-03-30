import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator,
    Alert, Linking, TouchableOpacity, TouchableWithoutFeedback, Image,
    FlatList
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker"; // Import image picker
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon component from react-native-vector-icons

type Project = {
    project_Id: string;
    project_description: string;
    worker_phone: string;
    images?: string[];
};

const ContractorCompletedProjectsScreen = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const IMAGE_BASE_URL = 'http://192.168.129.119:5001'; // Adjust this base URL to your image server base URL.

    useEffect(() => {
        fetchCompletedProjects();
    }, []);

    const fetchCompletedProjects = async () => {
        try {
            const storedName = await AsyncStorage.getItem("contractorName");
            if (storedName) {
                const response = await fetch(`http://192.168.129.119:5001/get-projects-by-contractor?contractor_name=${storedName}&status=Completed`);
                const data = await response.json();
                setProjects(data.status === "OK" ? data.data : []);
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

    const handleCallWorker = (workerPhone: string) => {
        Linking.openURL(`tel:${workerPhone}`).catch((err) => console.error("Error calling worker:", err));
    };

    const handleLongPress = (projectId: string) => {
        setSelectedProjectId(selectedProjectId === projectId ? null : projectId);
    };

    const dismissButtons = () => {
        setSelectedProjectId(null);
    };

    const handleSendForReview = async (projectId: string) => {
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
        const formData = new FormData();
        formData.append("project_Id", projectId);

        // Add images to form data
        images.forEach((imageUri, index) => {
            formData.append("images", {
                uri: imageUri,
                name: `image_${index}.jpg`,
                type: "image/jpeg",
            });
        });

        try {
            const response = await fetch("http://192.168.129.119:5001/upload-images", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data", // This is typically handled automatically with FormData
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                Alert.alert("Upload Failed", "Error: " + errorText);
            } else {
                const result = await response.json();
                if (result.status === "OK") {
                    Alert.alert("Success", "Images uploaded successfully.");
                    setSelectedImages([]); // Clear selected images
                    fetchCompletedProjects(); // Refresh the project list
                } else {
                    Alert.alert("Error", result.message);
                }
            }
        } catch (error) {
            console.error("Error uploading images:", error);
            Alert.alert("Upload Failed", "Could not upload images. Please check your network or try again later.");
        }
    };



    const deleteImage = async (projectId: string, imageUrl: string) => {
        try {
            const response = await fetch("http://192.168.129.119:5001/delete-image", {
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
        <ScrollView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
            <Text style={[styles.header, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Completed Projects</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{error}</Text>
            ) : projects.length > 0 ? (
                projects.map((project) => (
                    <TouchableWithoutFeedback key={project.project_Id} onPress={dismissButtons}>
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}
                            onLongPress={() => handleLongPress(project.project_Id)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Project ID: {project.project_Id}</Text>
                            <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Description: {project.project_description}</Text>

                            {/* Display Uploaded Images with Trash Icon */}
                            {project.images && project.images.length > 0 && (
                                <FlatList
                                    horizontal
                                    data={project.images}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => {
                                        // Extract image name from the URL (if needed, or use custom logic for names)
                                        const imageName = item.split('/').pop(); // This assumes the last part of the URL is the image name

                                        return (
                                            <View style={styles.imageContainer}>
                                                {/* Only show the image name */}
                                                <Text style={styles.imageName}>{imageName}</Text>
                                                {/* Delete button */}
                                                <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    onPress={() => deleteImage(project.project_Id, item)}
                                                >
                                                    <Icon name="trash" size={20} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    }}
                                />


                            )}
                            {selectedProjectId === project.project_Id && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => handleCallWorker(project.worker_phone)}>
                                        <Text style={styles.buttonText}>Call Worker</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => handleSendForReview(project.project_Id)}>
                                        <Text style={styles.buttonText}>Upload Evidence</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Need More Work", `Requesting more work for ${project.project_Id}`)}>
                                        <Text style={styles.buttonText}>Need More Work</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.button, styles.paymentButton]} onPress={() => Alert.alert("Make Payment", `Processing payment for ${project.project_Id}`)}>
                                        <Text style={styles.buttonText}>Make Payment</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    </TouchableWithoutFeedback>
                ))
            ) : (
                <Text style={[styles.errorText, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>
                    No completed projects found.
                </Text>
            )}

            {selectedImages.length > 0 && (
                <View style={styles.imagePreview}>
                    <Text style={{ color: theme.mode === 'dark' ? '#fff' : '#000' }}>Selected Images:</Text>
                    {selectedImages.map((uri, index) => (
                        <Image key={index} source={{ uri }} style={styles.image} />
                    ))}
                </View>
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
        backgroundColor: "#007bff",
        borderRadius: 5,
        marginVertical: 8,
        alignItems: "center",
    },
    paymentButton: {
        backgroundColor: "#28a745",
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
    imageContainer: {
        position: "relative",
        marginRight: 15,  // Increased margin between items in the list
        flexDirection: 'row',  // To align name and delete button horizontally
        alignItems: 'center',  // Center align the text and icon
    },
    imageName: {
        fontSize: 14,
        color: '#fff',  // Or adapt based on theme
        textAlign: 'center',
        marginRight: 10,  // Space between the image name and the delete icon
    },
    deleteButton: {
        backgroundColor: "rgba(255, 0, 0, 0.6)",
        borderRadius: 20,
        padding: 5,
    },
    imagePreview: {
        alignItems: "center",
        marginTop: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    deleteText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ContractorCompletedProjectsScreen;
