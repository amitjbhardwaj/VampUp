import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    RefreshControl,
    ScrollView
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
    const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for pull-to-refresh


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

    // Fetch ongoing projects count
    const fetchOngoingProjectsCount = async () => {
        try {
            const workerName = await AsyncStorage.getItem("workerName");

            const allProjectsResponse = await fetch(`http://192.168.129.119:5001/get-projects-by-worker?worker_name=${workerName}&status=In-Progress`);
            const allProjectsData = await allProjectsResponse.json();
            if (allProjectsData.status === 'OK') {
                setOngoingProjectsCount(allProjectsData.data.length);
            } else {
                setOngoingProjectsCount(0);
            }
        } catch (error) {
            console.error("Error fetching ongoing projects:", error);
        }
    };

    useEffect(() => {
        fetchOngoingProjectsCount(); // Fetch on initial load
    }, []);

    // Function to handle pull-to-refresh
    const onRefresh = async () => {
        setIsRefreshing(true);
        await fetchOngoingProjectsCount();
        setIsRefreshing(false);
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.screen, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.iconContainer}>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="briefcase" size={50} color={theme.text} />
                            {ongoingProjectsCount !== null && ongoingProjectsCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationText}>{ongoingProjectsCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{ color: theme.text }}>On-going Projects</Text>
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
                    <View style={[styles.modalContent, {
                        backgroundColor: theme.background,
                        borderColor: theme.mode === "dark" ? "#fff" : "#000", // Apply border dynamically
                        borderWidth: 2
                    }]}>
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
                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: theme.primary }]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: theme.secondary }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.submitButtonText]}>Back</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </ScrollView>
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
    redDot: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    redDotText: {
        color: "#fff",
        fontSize: 12,
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
    backButton: {
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        textAlign: "center",
    },
    lastRowIcon: {
        marginLeft: "-145%",
    },
    notificationBadge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    submitButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Home;
