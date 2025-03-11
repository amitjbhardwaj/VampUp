import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert
} from "react-native";
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
            console.log("Projects loaded:", data);
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

    return (
        <View style={styles.screen}>
            <View style={styles.iconContainer}>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerActiveWorkScreen')}>
                            <Ionicons name="briefcase" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>Active Work</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerWorkHistoryScreen')}>
                            <Ionicons name="time" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>Work History</Text>
                    </View>
                </View>
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerFullPaymentHistoryScreen', { project: selectedProject })}>
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
                <View style={styles.iconRow}>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerRequestHistoryScreen')}>
                            <Ionicons name="document-text" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>Request History</Text>
                    </View>
                    <View style={styles.iconItem}>
                        <TouchableOpacity onPress={() => navigation.navigate('WorkerAttendanceScreen')}>
                            <Ionicons name="calendar" size={50} color="#000" />
                        </TouchableOpacity>
                        <Text>My Attendance</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={40} color="white" />
            </TouchableOpacity>
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
});

export default Home;
