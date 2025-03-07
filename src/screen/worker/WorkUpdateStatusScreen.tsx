import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
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

    const completionValues = Array.from({ length: 11 }, (_, i) => (i * 10).toString()); // 0 to 100 in steps of 10

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
            </View>

            {/* Update Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.backButton}
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
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#fff",
        marginTop: 40
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
        fontSize: 16
    },
    input: {
        height: 40,
        borderColor: '#ccc',
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
        justifyContent: 'flex-end',
        paddingBottom: 25,
    },
    backButton: {
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: -30,
        marginBottom: 30,
        marginLeft: 20,
        marginRight: 20
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 10,
    },
});

export default WorkUpdateStatusScreen;
