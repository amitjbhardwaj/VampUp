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
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();  // Updated typing
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



    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Request Payment</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>Project Name</Text>
                    <View style={styles.dropdown}>
                        <Picker
                            selectedValue={selectedProject}
                            onValueChange={(itemValue) => handleProjectSelection(itemValue)}
                        >
                            <Picker.Item label="Select a Project" value="" />
                            {projects.map((project) => (
                                <Picker.Item key={project.project_Id} label={project.project_description} value={project.project_Id} />
                            ))}
                        </Picker>
                    </View>

                    {selectedProjectDetails && (
                        <View>
                            <Text style={styles.label}>Project Id</Text>
                            <TextInput style={styles.input} value={selectedProjectDetails.project_Id} editable={false} />

                            <Text style={styles.label}>Long Description</Text>
                            <TextInput style={styles.input} value={selectedProjectDetails.long_project_description} editable={false} />

                            <Text style={styles.label}>Start Date</Text>
                            <TextInput style={styles.input} value={selectedProjectDetails.project_start_date} editable={false} />

                            <Text style={styles.label}>End Date</Text>
                            <TextInput style={styles.input} value={selectedProjectDetails.project_end_date} editable={false} />
                        </View>
                    )}

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter Amount"
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    header: { position: "absolute", top: 0, left: 0, right: 0, height: 90, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flexDirection: "row", paddingTop: StatusBar.currentHeight },
    backButton: {
        position: "absolute",
        left: 20,
        top: "180%",
        transform: [{ translateY: -12 }],
    },
    headerText: { fontSize: 20, fontWeight: "bold", color: "#000" },
    content: { marginTop: 110, paddingHorizontal: 20 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    dropdown: { backgroundColor: "#fff", borderRadius: 8, elevation: 2, marginBottom: 15 },
    input: { backgroundColor: "#fff", padding: 15, borderRadius: 8, elevation: 2, fontSize: 16, marginBottom: 20 },
    submitButton: { backgroundColor: "#000", padding: 15, borderRadius: 8, alignItems: "center" },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default WorkerRequestPaymentScreen;
