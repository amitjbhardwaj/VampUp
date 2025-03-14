import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import projectsData from "../../assets/projects.json";
import { RootStackParamList } from "../../RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TouchID from 'react-native-touch-id';

interface Project {
    project_Id: string;
    project_description: string;
}

type WorkerClockOutScreenNavigationProp = NavigationProp<RootStackParamList, 'WorkerClockOutScreen'>;

const WorkerClockOutScreen: React.FC = () => {
    const navigation = useNavigation<WorkerClockOutScreenNavigationProp>();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [projectDetails, setProjectDetails] = useState<Project | null>(null);
    const [attendanceType, setAttendanceType] = useState<string>("");
    const [isAttendanceEnabled, setIsAttendanceEnabled] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [formattedDate, setFormattedDate] = useState<string>("");
    const [logoutTime, setLogoutTime] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<string>("");


    useEffect(() => {
        const incompleteProjects = projectsData.filter((project) => project.completion_percentage < 100);
        setProjects(incompleteProjects);
    }, []);


    const handleProjectChange = (projectId: string | null) => {
        if (!projectId) return;
        setSelectedProject(projectId);
        const project = projects.find((p) => p.project_Id === projectId) || null;
        setProjectDetails(project);
        setIsAttendanceEnabled(!!project);
        setAttendanceType("");
        setSelectedDate(null);
        setFormattedDate("");
        setLogoutTime("");
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


    const handleClockOut = async () => {
        if (!selectedProject || !projectDetails || !attendanceType || (attendanceType === "Manually" && !selectedDate)) {
            return;
        }

        try {
            const storedRecords = await AsyncStorage.getItem("attendanceHistory");
            const attendanceRecords = storedRecords ? JSON.parse(storedRecords) : [];

            // Find the existing record
            const existingRecordIndex = attendanceRecords.findIndex(
                (record: any) => record.project_Id === projectDetails.project_Id
            );

            if (existingRecordIndex === -1) {
                ToastAndroid.show("No existing attendance record found for this project.", ToastAndroid.SHORT);
                return;
            }

            // Check if logout time is already updated
            if (attendanceRecords[existingRecordIndex].logout_time && attendanceRecords[existingRecordIndex].logout_time !== "--") {
                ToastAndroid.show("Logout time already updated.", ToastAndroid.SHORT);
                return;
            }

            const now = new Date();
            const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            setLogoutTime(formattedTime);

            // Update logout time in attendance records
            attendanceRecords[existingRecordIndex].logout_time = formattedTime;

            await AsyncStorage.setItem("attendanceHistory", JSON.stringify(attendanceRecords));

            navigation.navigate("WorkerAttendanceHistoryScreen", attendanceRecords);
        } catch (error) {
            console.error("Failed to update attendance record", error);
            ToastAndroid.show("An error occurred while updating the attendance record.", ToastAndroid.SHORT);
        }
    };



    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <ScrollView>
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />

                <View style={styles.header}>
                    {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={30} color="#000" />
                    </TouchableOpacity> */}
                    <Text style={styles.headerText}>Clock Out</Text>
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

                    {attendanceType === "Manually" && (
                        <View>
                            <Text style={styles.label}>Date</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                                <Text style={{ color: formattedDate ? "#000" : "#aaa" }}>{formattedDate || "Select Date"}</Text>
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
                            <Text style={styles.label}>Logout Time</Text>
                            <TextInput style={styles.input} value={currentTime} editable={false} placeholder="Time" />
                        </View>
                    )}
                    <TouchableOpacity
                        style={[styles.submitButton, !selectedProject || !attendanceType || (attendanceType === "Manually" && !selectedDate) ? styles.disabledButton : null]}
                        onPress={handleClockOut}
                        disabled={!selectedProject || !attendanceType || (attendanceType === "Manually" && !selectedDate)}
                    >
                        <Text style={styles.submitButtonText}>Clock Out</Text>
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
    dateInput: {
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        justifyContent: "center",
    },
});

export default WorkerClockOutScreen;
