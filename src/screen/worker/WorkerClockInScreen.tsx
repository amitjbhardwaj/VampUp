import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ToastAndroid,
    ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RootStackParamList } from "../../RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TouchID from 'react-native-touch-id';
import { useTheme } from "../../context/ThemeContext";
import axios from 'axios';


interface Project {
    project_Id: string;
    project_description: string;
    long_project_description: string;
    assigned_to: string;
    project_start_date: string;
    contractor_phone: string;
    completion_percentage: number;
    status: string;
}

type WorkerClockInScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerClockInScreen'>;


const WorkerClockInScreen: React.FC = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<WorkerClockInScreenNavigationProp>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [projectDetails, setProjectDetails] = useState<Project | null>(null);
    const [attendanceType, setAttendanceType] = useState<string>("");
    const [isAttendanceEnabled, setIsAttendanceEnabled] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [formattedDate, setFormattedDate] = useState<string>(""); // Displayed date
    const [currentTime, setCurrentTime] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [workerName, setWorkerName] = useState<string>("");


    // Fetch worker's name from AsyncStorage or context
    useEffect(() => {
        const fetchWorkerName = async () => {
            const name = await AsyncStorage.getItem('workerName'); // Get worker name from AsyncStorage
            if (name) {
                setWorkerName(name);
            }
        };
        fetchWorkerName();
    }, []);

    // Fetch projects for the worker from the API
    const fetchProjects = useCallback(async () => {
        try {
            if (workerName) {
                const response = await axios.get(`http://192.168.129.119:5001/get-projects-by-worker`, {
                    params: {
                        worker_name: workerName,
                        status: "In-Progress",  // You can modify the status based on your requirements
                    }
                });

                // Check if the response is valid and contains data
                if (response.data && response.data.data) {
                    const fetchedProjects = response.data.data.map((p: Project) => ({
                        ...p,
                        status: p.status || "In-Progress",
                    }));

                    // Filter out projects that are already completed
                    setProjects(fetchedProjects.filter((p: Project) => p.completion_percentage < 100));
                } else {
                    // Handle the case where no projects are returned
                    setProjects([]);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // You can handle specific status codes here
                if (error.response?.status === 404) {
                    // If 404 occurs, just set an empty list of projects without logging an error
                    setProjects([]);
                    console.log("No projects found for this worker.");
                } else {
                    console.error("Error fetching projects:", error.message);
                }
            } else {
                console.error("Error fetching projects:", error);
            }
        }
    }, [workerName]);


    useFocusEffect(
        useCallback(() => {
            fetchProjects();
        }, [fetchProjects])
    );

    const handleProjectChange = (projectId: string | null) => {
        if (!projectId) return;
        setSelectedProject(projectId);
        const project = projects.find((p) => p.project_Id === projectId) || null;
        setProjectDetails(project);
        setIsAttendanceEnabled(!!project);

        setAttendanceType("");
        setSelectedDate(null);
        setFormattedDate("");
        setCurrentTime("");
    };

    const handleAttendanceTypeChange = (type: string) => {
        setAttendanceType(type);
        if (type === "Manually") {
            setShowDatePicker(true);
        } else if (type === "Biometrics") {
            // Trigger the biometric authentication
            handleBiometricAuthentication();
        } else {
            setShowDatePicker(false);
            setSelectedDate(null);
            setFormattedDate(""); // Clear date field
        }
    };

    const handleBiometricAuthentication = () => {
        // Check if biometric authentication is available
        TouchID.isSupported()
            .then(() => {
                TouchID.authenticate('Authenticate using fingerprint')
                    .then(() => {
                        // On successful authentication, set the current date and time
                        const today = new Date();
                        setSelectedDate(today);
                        setFormattedDate(today.toLocaleDateString("en-GB"));
                        const formattedTime = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                        setCurrentTime(formattedTime);
                    })
                    .catch((error: any) => {
                        console.log("Biometric authentication failed:", error);
                        ToastAndroid.show("Authentication failed. Try again.", ToastAndroid.SHORT);
                    });
            })
            .catch(() => {
                ToastAndroid.show("Biometric authentication is not supported on this device.", ToastAndroid.SHORT);
            });
    };

    const handleDateChange = (event: any, date?: Date) => {
        if (event.type === "set" && date) { // Only proceed if "OK" is clicked
            setSelectedDate(date);
            setFormattedDate(date.toLocaleDateString("en-GB")); // Format as DD/MM/YYYY
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                const formattedTime = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                setCurrentTime(formattedTime);
            }
        }
        setShowDatePicker(false);
    };

    const handleSubmit = async () => {
        if (!selectedProject || !projectDetails || !attendanceType || (attendanceType === "Manually" && !selectedDate)) {
            return;
        }

        try {
            const storedRecords = await AsyncStorage.getItem("attendanceHistory");
            const attendanceRecords = storedRecords ? JSON.parse(storedRecords) : [];

            // Check if attendance already exists for today
            const todayFormatted = new Date().toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
            const existingRecord = attendanceRecords.find(
                (record: any) => record.project_Id === selectedProject && record.date === todayFormatted
            );

            if (existingRecord) {
                ToastAndroid.show("You have already submitted attendance for this project today.", ToastAndroid.SHORT);
                return;
            }

            // Create new record
            const newRecord = {
                project_Id: projectDetails.project_Id,
                project_description: projectDetails.project_description,
                long_project_description: projectDetails.long_project_description,
                assigned_to: projectDetails.assigned_to,
                project_start_date: projectDetails.project_start_date,
                completion_percentage: projectDetails.completion_percentage,
                date: formattedDate || todayFormatted,
                login_time: currentTime,
                logout_time: "--",
                attendance_type: attendanceType,
            };

            // Append and save
            attendanceRecords.push(newRecord);
            await AsyncStorage.setItem("attendanceHistory", JSON.stringify(attendanceRecords));

            // Navigate to Attendance History Screen
            navigation.navigate("WorkerAttendanceHistoryScreen", newRecord);
        } catch (error) {
            console.error("Failed to save attendance record", error);
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />

                <View style={styles.header}>
                    <Text style={styles.headerText}>Clock In</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.label}>Select Project</Text>
                    <Picker
                        selectedValue={selectedProject}
                        onValueChange={(itemValue) => handleProjectChange(itemValue ?? "")}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a Project" value={null} />
                        {projects.map((project) => (
                            <Picker.Item key={project.project_Id} label={project.project_description} value={project.project_Id} />
                        ))}
                    </Picker>

                    {projectDetails && (
                        <View>
                            <TextInput style={styles.input} value={projectDetails.project_Id} editable={false} placeholder="Project ID" />
                            <TextInput style={styles.input} value={projectDetails.long_project_description} editable={false} placeholder="Long Description" />
                            <TextInput style={styles.input} value={projectDetails.assigned_to} editable={false} placeholder="Assigned To" />
                            <TextInput style={styles.input} value={projectDetails.project_start_date} editable={false} placeholder="Start Date" />
                            <TextInput style={styles.input} value={`${projectDetails.completion_percentage}%`} editable={false} placeholder="Completion %" />
                        </View>
                    )}

                    <Text style={styles.label}>Attendance Type</Text>
                    <Picker
                        selectedValue={attendanceType}
                        onValueChange={handleAttendanceTypeChange}
                        style={styles.picker}
                        enabled={isAttendanceEnabled}
                    >
                        <Picker.Item label="Select Attendance Type" value="" />
                        <Picker.Item label="Manually" value="Manually" />
                        <Picker.Item label="Biometrics" value="Biometrics" />
                    </Picker>

                    {/* Date Picker Trigger Input */}
                    {attendanceType === "Manually" && (
                        <View>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                                <Text style={{ color: formattedDate ? "#000" : "#aaa" }}>
                                    {formattedDate || "Select Date"}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                    minimumDate={today}
                                    maximumDate={today}
                                />
                            )}
                        </View>
                    )}

                    {selectedDate && (
                        <View>
                            <Text style={styles.label}>Login Time</Text>
                            <TextInput style={styles.input} value={currentTime} editable={false} placeholder="Time" />
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !selectedProject || !attendanceType || (attendanceType === "Manually" && !selectedDate) ? styles.disabledButton : null,
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedProject || !attendanceType || (attendanceType === "Manually" && !selectedDate)}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
    },
    header: {
        height: 90,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: StatusBar.currentHeight,
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: "180%",
        transform: [{ translateY: -12 }],
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    content: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    picker: {
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
    },
    dateInput: {
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        justifyContent: "center",
    },
    submitButton: {
        backgroundColor: "#000",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    disabledButton: {
        backgroundColor: "#a0a0a0",
    },
});

export default WorkerClockInScreen;
