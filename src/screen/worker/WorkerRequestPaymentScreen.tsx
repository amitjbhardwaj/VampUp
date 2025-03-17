import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, ToastAndroid,
    ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import projectsData from "../../assets/projects.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../RootNavigator";
import { useTheme } from "../../context/ThemeContext";

interface Project {
    project_Id: string;
    project_description: string;
    long_project_description: string;
    assigned_to: string;
    project_start_date: string;
    project_end_date: string;
    contractor_phone: string;
    completion_percentage: number;
}

const WorkerRequestPaymentScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [selectedProjectDetails, setSelectedProjectDetails] = useState<Project | null>(null);

    useEffect(() => {
        const completedProjects: Project[] = projectsData.filter(
            (project) => project.completion_percentage === 100
        );
        setProjects(completedProjects);
    }, []);

    const handleProjectSelection = (projectId: string) => {
        if (!projectId) return;
        const project = projects.find((proj) => proj.project_Id === projectId) || null;
        setSelectedProject(projectId);
        setSelectedProjectDetails(project);
    };

    const handleSubmit = async () => {
        if (!selectedProject || !amount) {
            ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
            return;
        }

        if (!selectedProjectDetails?.project_Id) {
            ToastAndroid.show("Project ID is missing", ToastAndroid.SHORT);
            return;
        }

        // Check if a request for the selected project already exists
        const existingRequests = await AsyncStorage.getItem("worker_requests");
        const requestList: { project_Id: string; amount: string }[] = existingRequests ? JSON.parse(existingRequests) : [];

        const isDuplicateRequest = requestList.some(
            (request) => request.project_Id === selectedProjectDetails.project_Id && request.amount === amount
        );

        if (isDuplicateRequest) {
            ToastAndroid.show("A request with this amount has already been submitted for this project", ToastAndroid.SHORT);
            return;
        }

        const requestId = `REQ-${Date.now()}`; // Unique Request Id
        const newRequest = {
            requestId,
            project_Id: selectedProjectDetails.project_Id,  // Now this will always be a string
            project_description: selectedProjectDetails.project_description,
            project_start_date: selectedProjectDetails.project_start_date,
            project_end_date: selectedProjectDetails.project_end_date,
            amount,
            request_date: new Date().toISOString(),
        };

        try {
            // Add new request to the list
            requestList.push(newRequest);
            await AsyncStorage.setItem("worker_requests", JSON.stringify(requestList));

            ToastAndroid.show("Payment Request Submitted", ToastAndroid.SHORT);
            navigation.navigate('WorkerRequestHistoryScreen');  // This should work now
        } catch (error) {
            ToastAndroid.show("Failed to save request", ToastAndroid.SHORT);
        }
    };

    const isDarkMode = theme.mode === "dark"; // Check if dark mode is enabled

    return (
        <ScrollView style={{ backgroundColor: isDarkMode ? theme.background : "#f8f8f8" }}>
            <View style={[styles.container, { backgroundColor: isDarkMode ? theme.background : "#f8f8f8" }]}>
                <StatusBar backgroundColor={isDarkMode ? theme.background : "#fff"} barStyle={isDarkMode ? "light-content" : "dark-content"} />

                <View style={[styles.header, { backgroundColor: isDarkMode ? theme.background : "#fff" }]}>
                    <Text style={[styles.headerText, { color: isDarkMode ? "#fff" : "#000" }]}>Request Payment</Text>
                </View>

                <View style={styles.content}>
                    <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Project Name</Text>
                    <View style={[styles.dropdown, { backgroundColor: isDarkMode ? theme.inputBackground : "#fff" }]}>
                        <Picker
                            selectedValue={selectedProject}
                            onValueChange={(itemValue) => handleProjectSelection(itemValue)}
                            style={{ color: isDarkMode ? "#fff" : "#000" }} // <-- Set text color
                        >
                            <Picker.Item label="Select a Project" value="" color={isDarkMode ? "#000" : "#000"} />
                            {projects.map((project) => (
                                <Picker.Item
                                    key={project.project_Id}
                                    label={project.project_description}
                                    value={project.project_Id}
                                    color={isDarkMode ? "#000" : "#000"} // <-- Ensure text is white in dark mode
                                />
                            ))}
                        </Picker>
                    </View>


                    {selectedProjectDetails && (
                        <View>
                            <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Project Id</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: "transparent", color: isDarkMode ? "#fff" : "#000" }]}
                                value={selectedProjectDetails.project_Id}
                                placeholderTextColor={isDarkMode ? "#fff" : "#888"}
                                editable={false}
                            />
                            <TextInput
                                style={[styles.input, { backgroundColor: "transparent", color: isDarkMode ? "#fff" : "#000" }]}
                                value={selectedProjectDetails.long_project_description}
                                placeholderTextColor={isDarkMode ? "#fff" : "#888"}
                                editable={false}
                            />
                            <TextInput
                                style={[styles.input, { backgroundColor: "transparent", color: isDarkMode ? "#fff" : "#000" }]}
                                value={selectedProjectDetails.project_start_date}
                                placeholderTextColor={isDarkMode ? "#fff" : "#888"}
                                editable={false}
                            />
                            <TextInput
                                style={[styles.input, { backgroundColor: "transparent", color: isDarkMode ? "#fff" : "#000" }]}
                                value={selectedProjectDetails.project_end_date}
                                placeholderTextColor={isDarkMode ? "#fff" : "#888"}
                                editable={false}
                            />

                        </View>
                    )}

                    <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Amount</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: 'transparent', color: isDarkMode ? "#fff" : "#000" }]}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter Amount"
                        placeholderTextColor={isDarkMode ? "#fff" : "#888"} // Set placeholder color
                    />


                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: theme.mode === 'dark' ? "#333" : "#000" }]}
                        onPress={handleSubmit}
                    >
                        <Text style={[styles.submitButtonText, { color: isDarkMode ? "#fff" : "#fff" }]}>Submit</Text>
                    </TouchableOpacity>


                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { position: "absolute", top: 0, left: 0, right: 0, height: 90, justifyContent: "center", alignItems: "center", flexDirection: "row", paddingTop: StatusBar.currentHeight },
    headerText: { fontSize: 20, fontWeight: "bold" },
    content: { marginTop: 110, paddingHorizontal: 20 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    dropdown: { borderRadius: 8, elevation: 2, marginBottom: 15 },
    input: {
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1, 
        borderColor: "#666", 
        backgroundColor: "transparent", // <-- Ensure transparency for dark mode
    },

    submitButton: { padding: 13, marginTop: 20, alignItems: "center", borderRadius: 10 },
    submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default WorkerRequestPaymentScreen;
