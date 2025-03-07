import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { RootStackParamList } from "../../RootNavigator";

type WorkUpdateStatusScreenRouteProp = RouteProp<RootStackParamList, 'WorkUpdateStatus'>;

const WorkUpdateStatusScreen = () => {
    const route = useRoute<WorkUpdateStatusScreenRouteProp>();
    const navigation = useNavigation();

    const { project } = route.params;

    // States
    const [projectId, setProjectId] = useState(project.project_Id);
    const [description, setDescription] = useState(project.project_description);
    const [assignedTo, setAssignedTo] = useState(project.assigned_to);
    const [startDate, setStartDate] = useState(project.project_start_date);
    const [endDate, setEndDate] = useState(project.project_end_date);
    const [completion, setCompletion] = useState(project.completion_percentage.toString());
    const [contractorPhone, setContractorPhone] = useState(project.contractor_phone);
    const [status, setStatus] = useState(getStatus(project.completion_percentage)); // Initial status

    const [modalVisible, setModalVisible] = useState(false);
    const [reason, setReason] = useState("");

    const [timer, setTimer] = useState(1); // Start timer from 1 second
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const completionValues = Array.from({ length: 11 }, (_, i) => (i * 10).toString()); // 0 to 100 in steps of 10

    // Helper function to determine the status
    function getStatus(completion: number) {
        if (completion === 100) {
            return "Completed";
        } else if (completion < 100) {
            return "In-progress";
        } else {
            return "On-Hold";
        }
    }

    let interval: NodeJS.Timeout;

    const handleHoldWork = () => {
        setModalVisible(true);
        setStatus("On-Hold"); // Set status to "On-Hold" when Hold Work is triggered
        setTimer(1); // Reset timer to 1 second
        setIsTimerRunning(true); // Start the timer when work is on hold
    };

    const handleSubmitHoldWork = () => {
        console.log("Hold Work Details:", {
            projectId,
            description,
            assignedTo,
            startDate,
            endDate,
            completion,
            contractorPhone,
            reason,
        });
        setModalVisible(false); // Close the modal after submitting
    };

    const handleResumeWork = () => {
        setStatus("In-progress"); // Change status back to In-progress when Resume Work is pressed
        setIsTimerRunning(false); // Stop the timer when work is resumed
        setTimer(1); // Reset the timer to 1 second when resuming work
    };

    useEffect(() => {
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1); // Increment time by 1 second every interval
            }, 1000);
        } else {
            clearInterval(interval); // Clear interval when the timer is not running
        }

        // Cleanup function to clear the interval on unmount
        return () => clearInterval(interval);
    }, [isTimerRunning]); // This effect runs when isTimerRunning changes

    useEffect(() => {
        setStatus(getStatus(parseInt(completion))); // Update status when completion changes
    }, [completion]);

    // Function to format the time in a human-readable format (years, months, days, hours, minutes, seconds)
    const formatTime = (seconds: number) => {
        const years = Math.floor(seconds / (365 * 24 * 60 * 60));
        const months = Math.floor((seconds % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60));
        const days = Math.floor((seconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);
        const secs = seconds % 60;

        let timeString = "";
        if (years > 0) timeString += `${years} year${years > 1 ? "s" : ""} `;
        if (months > 0) timeString += `${months} month${months > 1 ? "s" : ""} `;
        if (days > 0) timeString += `${days} day${days > 1 ? "s" : ""} `;
        if (hours > 0) timeString += `${hours} hour${hours > 1 ? "s" : ""} `;
        if (minutes > 0) timeString += `${minutes} minute${minutes > 1 ? "s" : ""} `;
        if (secs > 0 || timeString === "") timeString += `${secs} second${secs > 1 ? "s" : ""}`;

        return timeString;
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Update Status</Text>

                <TextInput
                    style={styles.input}
                    value={projectId}
                    onChangeText={setProjectId}
                    placeholder="Project ID"
                    editable={false} // Project ID is usually non-editable
                />
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                />
                <TextInput
                    style={styles.input}
                    value={assignedTo}
                    onChangeText={setAssignedTo}
                    placeholder="Assigned To"
                />
                <TextInput
                    style={styles.input}
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="Start Date"
                />
                <TextInput
                    style={styles.input}
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="End Date"
                />

                {/* Dropdown for Completion */}
                <Text style={styles.label}>Completion (%)</Text>
                <Picker
                    selectedValue={completion}
                    onValueChange={(value) => setCompletion(value)}
                    style={styles.picker}
                >
                    {completionValues.map((value) => (
                        <Picker.Item key={value} label={`${value}%`} value={value} />
                    ))}
                </Picker>

                <TextInput
                    style={styles.input}
                    value={contractorPhone}
                    onChangeText={setContractorPhone}
                    placeholder="Contractor Phone"
                    keyboardType="phone-pad"
                />

                {/* Status Field */}
                <Text style={styles.label}>Status: {status}</Text>
                {status === "On-Hold" && (
                    <Text style={styles.timer}>Time on Hold: {formatTime(timer)}</Text>
                )}
            </View>

            {/* Resume Work Button */}
            {status === "On-Hold" && (
                <TouchableOpacity
                    style={styles.resumeButton}
                    onPress={handleResumeWork}
                >
                    <Icon name="play" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Resume Work</Text>
                </TouchableOpacity>
            )}

            {/* Hold Work Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.holdButton}
                    onPress={handleHoldWork}
                >
                    <Icon name="pause" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Hold Work</Text>
                </TouchableOpacity>

                {/* Update Button */}
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => {
                        console.log("Updated project:", {
                            projectId,
                            description,
                            assignedTo,
                            startDate,
                            endDate,
                            completion,
                            contractorPhone,
                        });
                    }}
                >
                    <Icon name="refresh" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            </View>

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backToCardsButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.backToCardsText}>Back</Text>
            </TouchableOpacity>

            {/* Hold Work Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Hold Work</Text>

                        {/* Project details */}
                        <TextInput
                            style={styles.input}
                            value={projectId}
                            onChangeText={setProjectId}
                            placeholder="Project ID"
                            editable={false}
                        />
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Description"
                        />
                        <TextInput
                            style={styles.input}
                            value={assignedTo}
                            onChangeText={setAssignedTo}
                            placeholder="Assigned To"
                        />
                        <TextInput
                            style={styles.input}
                            value={startDate}
                            onChangeText={setStartDate}
                            placeholder="Start Date"
                        />
                        <TextInput
                            style={styles.input}
                            value={endDate}
                            onChangeText={setEndDate}
                            placeholder="End Date"
                        />

                        {/* Reason Input */}
                        <Text style={styles.label}>Reason for Hold</Text>
                        <TextInput
                            style={styles.input}
                            value={reason}
                            onChangeText={setReason}
                            placeholder="Enter reason"
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleSubmitHoldWork}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>

                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setModalVisible(false)}>
                            <Text style={styles.backButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        fontWeight: "bold",
        marginBottom: 5,
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 15,
    },
    picker: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
    },
    bottomContainer: {
        justifyContent: "flex-end",
        paddingBottom: 25,
    },
    holdButton: {
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    resumeButton: {
        backgroundColor: "#28a745", // Green color for Resume Work
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 10,
    },
    updateButton: {
        backgroundColor: "#000",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    backToCardsButton: {
        marginTop: 15,
        padding: 10,
        alignItems: "center",
    },
    backToCardsText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        width: "80%",
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    backButton: {
        marginTop: 15,
        padding: 10,
        alignItems: "center",
    },
    backButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    timer: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
    },
});

export default WorkUpdateStatusScreen;
