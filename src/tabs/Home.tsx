import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../context/ThemeContext";

type HomeNavigationProp = NavigationProp<RootStackParamList>;

const Home = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const [projectId, setProjectId] = useState("");
    const [subject, setSubject] = useState("");
    const [complaintDescription, setComplaintDescription] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [longProjectDescription, setLongProjectDescription] = useState("");
    const [projectStartDate, setProjectStartDate] = useState("");
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [phone, setPhone] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        try {
            const data = require('../assets/projects.json');
            if (Array.isArray(data)) {
                const filteredProjects = data.filter(project => project.completion_percentage !== 100);
                setProjects(filteredProjects);
            } else {
                console.error("Projects data is not an array");
            }
        } catch (error) {
            console.error("Error loading project:", error);
        }
    };

    const handleProjectChange = (selectedDescription: string) => {
        setProjectDescription(selectedDescription);
        const selected = projects.find(project => project.project_description === selectedDescription);
        setSelectedProject(selected);
        if (selected) {
            setProjectId(selected.project_Id || "");
            setLongProjectDescription(selected.long_project_description || "");
            setProjectStartDate(selected.project_start_date || "");
            setPhone(selected.contractor_phone || "");
        }
    };

    const handleSubmit = async () => {
        if (!subject.trim()) {
            Alert.alert("Validation Error", "Complaint Subject is required.");
            return;
        }

        if (!complaintDescription.trim()) {
            Alert.alert("Validation Error", "Complaint Description is required.");
            return;
        }

        const complaintId = `CMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newRequest = {
            complaintId,
            projectId,
            subject,
            complaintDescription,
            projectDescription,
            longProjectDescription,
            projectStartDate,
            phone,
        };

        const storedRequests = await AsyncStorage.getItem("submittedRequests");
        const parsedRequests = storedRequests ? JSON.parse(storedRequests) : [];

        const isDuplicate = parsedRequests.some(
            (req: any) =>
                req.projectId === newRequest.projectId &&
                req.subject === newRequest.subject &&
                req.complaintDescription === newRequest.complaintDescription
        );

        if (isDuplicate) {
            Alert.alert("Duplicate Request", "Same request has already been submitted!!");
            return;
        }

        const updatedRequests = [...parsedRequests, newRequest];
        await AsyncStorage.setItem("submittedRequests", JSON.stringify(updatedRequests));

        setModalVisible(false);
        navigation.navigate("WorkerComplaintHistoryScreen", { updatedRequests });
    };

    return (
        <View style={[styles.screen, { backgroundColor: theme.background }]}>
            <View style={styles.iconContainer}>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="briefcase" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Active Work</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerClockInScreen')}>
                            <Ionicons name="log-in" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Clock-in</Text>
                    </View>
                </View>
                <View style={styles.iconRow}>
                    <View style={[styles.iconItem, styles.lastRowIcon]}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerClockOutScreen')}>
                            <Ionicons name="log-out" size={50} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>Clock-out</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.floatingButton, { backgroundColor: theme.mode === 'dark' ? "#fff" : "#000" }]}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={40} color={theme.mode === 'dark' ? "#000" : "#fff"} />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <Text style={[styles.modalHeader, { color: theme.text }]}>Complaints</Text>

                        <Picker
                            selectedValue={projectDescription}
                            onValueChange={handleProjectChange}
                            style={[styles.input, { color: theme.text }]}
                            dropdownIconColor={theme.text}
                        >
                            <Picker.Item label="Select Project Description" value="" />
                            {projects.map((project: any) => (
                                <Picker.Item
                                    key={project.project_Id}
                                    label={project.project_description}
                                    value={project.project_description}
                                />
                            ))}
                        </Picker>

                        {selectedProject && (
                            <>
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.text }]}
                                    placeholder="Project ID"
                                    placeholderTextColor={theme.text}
                                    value={projectId}
                                    editable={false}
                                />
                                <TextInput
                                    style={[styles.textArea, { color: theme.text, borderColor: theme.text }]}
                                    placeholder="Long Project Description"
                                    placeholderTextColor={theme.text}
                                    value={longProjectDescription}
                                    editable={false}
                                    multiline
                                />
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.text }]}
                                    placeholder="Phone"
                                    placeholderTextColor={theme.text}
                                    value={phone}
                                    editable={false}
                                    multiline
                                />
                                <TextInput
                                    style={[styles.input, { color: theme.text, borderColor: theme.text }]}
                                    placeholder="Start Date"
                                    placeholderTextColor={theme.text}
                                    value={projectStartDate}
                                    editable={false}
                                />
                            </>
                        )}

                        <TextInput
                            style={[styles.input, { color: theme.text, borderColor: theme.text }]}
                            placeholder="Complaint Subject"
                            placeholderTextColor={theme.text}
                            value={subject}
                            onChangeText={setSubject}
                        />
                        <TextInput
                            style={[styles.textArea, { color: theme.text, borderColor: theme.text }]}
                            placeholder="Complaint Description"
                            placeholderTextColor={theme.text}
                            value={complaintDescription}
                            onChangeText={setComplaintDescription}
                            multiline
                        />

                        <View style={styles.buttonContainer}>
                            <Button title="Submit" onPress={handleSubmit} />
                            <Button title="Back" onPress={() => setModalVisible(false)} color={theme.text} />
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
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    textArea: {
        borderWidth: 1,
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
    lastRowIcon: {
        marginLeft: "-145%",
    },
});

export default Home;
