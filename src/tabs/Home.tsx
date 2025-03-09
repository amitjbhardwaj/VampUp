import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

type HomeNavigationProp = NavigationProp<RootStackParamList>;

const Home = () => {
    const navigation = useNavigation<HomeNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [projectDescription, setProjectDescription] = useState("");  // New state for project description
    const [longProjectDescription, setLongProjectDescription] = useState("");  // New state for long project description
    const [projectStartDate, setProjectStartDate] = useState("");  // New state for project start date
    const [projects, setProjects] = useState<any[]>([]);  // State to hold filtered project data
    const [selectedProject, setSelectedProject] = useState<any>(null); // New state for selected project

    // Step 1: Load filtered projects from projects.json
    const loadProjects = () => {
        try {
            const data = require('../assets/projects.json');
            console.log("Projects loaded:", data);
            if (Array.isArray(data)) {
                // Filter out projects where completion_percentage is 100
                const filteredProjects = data.filter(project => project.completion_percentage !== 100);
                setProjects(filteredProjects);
            } else {
                console.error("Projects data is not an array");
            }
        } catch (error) {
            console.error("Error loading project:", error);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleProjectChange = (selectedId: string) => {
        setProjectId(selectedId);

        // Find the selected project from the list of projects
        const selected = projects.find(project => project.project_Id === selectedId);
        setSelectedProject(selected);

        // Set the values of the new fields from the selected project
        if (selected) {
            setProjectDescription(selected.project_description || "");
            setLongProjectDescription(selected.long_project_description || "");
            setProjectStartDate(selected.project_start_date || "");
        }
    };

    const handleSubmit = async () => {
        const newRequest = { projectId, subject, description, projectDescription, longProjectDescription, projectStartDate };

        // Load existing requests from AsyncStorage
        const storedRequests = await AsyncStorage.getItem("submittedRequests");
        const parsedRequests = storedRequests ? JSON.parse(storedRequests) : [];

        // Check if the request already exists
        const isDuplicate = parsedRequests.some(
            (req: any) =>
                req.projectId === newRequest.projectId &&
                req.subject === newRequest.subject &&
                req.description === newRequest.description
        );

        if (isDuplicate) {
            Alert.alert("Duplicate Request", "Same request has already been submitted!!");
            return;
        }

        // Save the new request list
        const updatedRequests = [...parsedRequests, newRequest];
        await AsyncStorage.setItem("submittedRequests", JSON.stringify(updatedRequests));

        // Close the modal and navigate
        setModalVisible(false);
        navigation.navigate("WorkerComplaintHistoryScreen", { updatedRequests });
    };

    return (
        <View style={styles.screen}>
            <View style={styles.iconContainer}>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate({ name: 'WorkerActiveWorkScreen' } as never)}
                        >
                            <Ionicons name="briefcase" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>Active Work</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate({ name: 'WorkerWorkHistoryScreen' } as never)}>
                            <Ionicons name="time" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>Work History</Text>
                    </View>
                </View>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate({ name: 'WorkerFullPaymentHistoryScreen' } as never)}>
                            <Ionicons name="card" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>Payment History</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate({ name: 'WorkerComplaintHistoryScreen' } as never)}>
                            <Ionicons name="chatbox" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>Complaint History</Text>
                    </View>
                </View>
            </View>

            {/* Floating Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setModalVisible(true)}  // To show modal on button press
            >
                <Ionicons name="add" size={40} color="white" />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Request/Complaint</Text>

                        {/* ProjectId Dropdown */}
                        <Picker
                            selectedValue={projectId}
                            onValueChange={handleProjectChange}  // Update on project selection
                            style={styles.input}
                        >
                            <Picker.Item label="Select Project ID" value="" />
                            {projects.map((project: any) => (
                                <Picker.Item
                                    key={project.project_Id}
                                    label={project.project_Id}
                                    value={project.project_Id}
                                />
                            ))}
                        </Picker>

                        {/* Render dynamic inputs only if a project is selected */}
                        {selectedProject && (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Project Description"
                                    value={projectDescription}
                                    onChangeText={setProjectDescription}
                                />
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Long Project Description"
                                    value={longProjectDescription}
                                    onChangeText={setLongProjectDescription}
                                    multiline
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Start Date"
                                    value={projectStartDate}
                                    onChangeText={setProjectStartDate}
                                />
                            </>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Subject"
                            value={subject}
                            onChangeText={setSubject}
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />

                        <View style={styles.buttonContainer}>
                            <Button title="Submit" onPress={handleSubmit} />
                            <Button title="Back" onPress={() => setModalVisible(false)} color="black" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20,
    },
    iconItem: {
        alignItems: "center",
        width: "45%",
    },
    floatingButton: {
        position: "absolute",
        bottom: 80,
        right: 20,
        backgroundColor: "#000",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    textArea: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        height: 100,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
});

export default Home;
