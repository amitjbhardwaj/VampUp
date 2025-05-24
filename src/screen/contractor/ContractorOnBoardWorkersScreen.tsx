import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Platform, StatusBar } from "react-native";
import axios from 'axios';
import { useTheme } from "../../context/ThemeContext";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootNavigator";
import Header from "../Header";

// Define the type for the worker
type Worker = {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    mobile: Number,
};

// Define the type for the project
type Project = {
    project_Id: string;
    project_description: string;
};

type ContractorOnBoardWorkersScreenNavigationProp = NavigationProp<RootStackParamList, "ContractorOnBoardWorkersScreen">;


const ContractorOnBoardWorkersScreen = () => {
    const { theme } = useTheme();
    const [form, setForm] = useState({
        contractor_name: "",
        worker_name: "",
        project_description: "",
        project_Id: "",
    });
    const navigation = useNavigation<ContractorOnBoardWorkersScreenNavigationProp>();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [projects, setProjects] = useState<{ label: string, value: string }[]>([]); // Updated type for projects
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch workers data
    const fetchWorkers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.129.119:5001/get-all-user');
            if (response.data.status === "OK") {
                const filtered = response.data.data.filter((user: any) => user.role.toLowerCase() === "worker");
                setWorkers(filtered);
            }
        } catch (error) {
            console.error("Error fetching workers:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch logged-in user (contractor) data
    const fetchUserData = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            try {
                const response = await axios.post('http://192.168.129.119:5001/userdata', { token });
                if (response.data.status === "OK") {
                    const user = response.data.data;
                    const fullName = `${user.firstName} ${user.lastName}`;
                    setForm(prev => ({ ...prev, contractor_name: fullName }));
                } else {
                    Alert.alert('Failed to fetch user data');
                }
            } catch (error) {
                Alert.alert('Error fetching user data');
            }
        }
    };

    // Fetch all project descriptions
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://192.168.129.119:5001/get-all-projects');
            if (response.data.status === "OK") {
                // Map the project data to the correct format
                const projectList = response.data.data.map((project: Project) => ({
                    label: project.project_description, // Displayed in the UI
                    value: JSON.stringify({ id: project.project_Id, description: project.project_description }) // Store full object
                }));
                setProjects(projectList);

            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData(); // Fetch logged-in contractor data
        fetchWorkers(); // Fetch workers data
        fetchProjects(); // Fetch project descriptions
    }, []);

    const handleChange = (field: string, value: string) => {
        if (field === "worker_name") {
            const selectedWorker = workers.find(worker => worker._id === value);

            if (selectedWorker) {
                ////console.log("Selected Worker:", selectedWorker.firstName, selectedWorker.lastName); // Debugging
                setForm(prev => ({
                    ...prev,
                    worker_name: `${selectedWorker.firstName} ${selectedWorker.lastName}`, // Store actual name
                }));
            }
        } else if (field === "project_description") {
            const parsedValue = JSON.parse(value);
            //console.log("Selected Project:", parsedValue); // Debugging
            setForm(prev => ({
                ...prev,
                project_description: parsedValue.description
            }));
        } else {
            setForm(prev => ({ ...prev, [field]: value }));
        }
    };



    const handleSubmit = async () => {
        const selectedWorker = workers.find(worker => worker.firstName + " " + worker.lastName === form.worker_name);

        if (!selectedWorker || !form.project_description.trim()) {
            Alert.alert('Please select a worker and a project');
            return;
        }

        const projectData = {
            worker_id: selectedWorker._id, // Send worker ID
            worker_name: form.worker_name.trim(), // Send worker Name
            contractor_name: form.contractor_name.trim(),
            project_description: form.project_description.trim(),
            worker_phone: selectedWorker.mobile,
        };

        //console.log("Submitting Data:", projectData); // Debugging

        setLoading(true);
        try {
            const response = await axios.put(
                `http://192.168.129.119:5001/update-worker-name`,
                projectData
            );

            if (response.data.status === "OK") {
                Alert.alert('Worker updated successfully');
                //navigation.navigate("AdminAllocateProjectScreen");
            } else {
                Alert.alert('Error updating worker');
            }
        } catch (error) {
            console.error("Error updating worker:", error);
            Alert.alert('Error updating worker');
        } finally {
            setLoading(false);
        }
    };

    return (

        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="On-board Worker" />
            <View style={[styles.container, { backgroundColor: theme.background }]}>

                {/* Contractor Name Field */}
                <View style={styles.fieldWrapper}>
                    <Text style={[styles.label, { color: theme.text }]}>Contractor Name</Text>
                    <View style={[styles.inputContainer, errors.contractor_name && styles.inputError, { backgroundColor: theme.inputBackground }]}>
                        <TextInput
                            placeholder="Contractor name"
                            placeholderTextColor={theme.mode === "dark" ? "#fff" : "#999"}
                            style={[styles.input, { color: theme.text }]}
                            onChangeText={(value) => handleChange("contractor_name", value)}
                            value={form.contractor_name} // Display the fetched contractor name
                            editable={false} // Make the contractor name field non-editable
                        />
                    </View>
                </View>

                {/* Worker Selection Field */}
                <View style={styles.fieldWrapper}>
                    <Text style={[styles.label, { color: theme.text }]}>Select Worker</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                        <Picker
                            selectedValue={workers.find(worker => worker.firstName + " " + worker.lastName === form.worker_name)?._id || ""}
                            onValueChange={(itemValue) => handleChange("worker_name", itemValue)}
                            style={{ color: theme.text }}
                        >
                            <Picker.Item label="Select a worker..." value="" />
                            {workers.map((worker) => (
                                <Picker.Item
                                    key={worker._id}
                                    label={`${worker.firstName} ${worker.lastName}`}
                                    value={worker._id} // Stores worker ID
                                />
                            ))}
                        </Picker>

                    </View>
                </View>

                {/* Project Description Field */}
                <View style={styles.fieldWrapper}>
                    <Text style={[styles.label, { color: theme.text }]}>Select Project Description</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
                        <Picker
                            selectedValue={JSON.stringify({ id: form.project_Id, description: form.project_description })}
                            onValueChange={(itemValue) => handleChange("project_description", itemValue)}
                            style={{ color: theme.text }}
                        >
                            <Picker.Item label="Select a project..." value="" />
                            {projects.map((project) => (
                                <Picker.Item
                                    key={project.value}
                                    label={project.label}
                                    value={project.value} // Contains JSON string with both Id and Description
                                />
                            ))}
                        </Picker>

                    </View>
                </View>

                {/* Submit Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary }]}
                        onPress={handleSubmit}
                    >
                        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Submit</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    fieldWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    inputContainer: {
        borderRadius: 12,
        paddingHorizontal: 18,
        height: 50,
        borderWidth: 1.5,
        justifyContent: 'center',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    input: {
        fontSize: 16,
        fontFamily: 'Roboto',
    },
    inputError: {
        borderColor: "#e74c3c", // Error color
    },
    buttonContainer: {
        marginTop: 30,
        alignItems: 'center', // centers child horizontally
    },
    button: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        width: '100%', // optional: controls button width
    },

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});

export default ContractorOnBoardWorkersScreen;
