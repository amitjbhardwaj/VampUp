import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import { RootStackParamList } from "../../RootNavigator";
import { Picker } from "@react-native-picker/picker";

// Define the type for the project state
type Project = {
    project_Id: string;
    project_description: string;
    long_project_description: string;
    assigned_to: string;
    project_start_date: Date;
    project_end_date: Date;
    contractor_phone: string;
    completion_percentage: string;
    status: string;
};

type AdminAddNewProjectScreenNavigationProp = NavigationProp<RootStackParamList, "AdminAddNewProjectScreen">;

const AdminAddNewProjectScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<AdminAddNewProjectScreenNavigationProp>();

    const [project, setProject] = useState<Project>({
        project_Id: "",
        project_description: "",
        long_project_description: "",
        assigned_to: "",
        project_start_date: new Date(),
        project_end_date: new Date(),
        contractor_phone: "",
        completion_percentage: "0", // Default value to make sure it's not empty
        status: "Yet to start", // Default value to ensure it shows a selection
    });

    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    // Format date to 'yyyy-mm-dd'
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Extract the 'yyyy-mm-dd' part from the ISO string
    };

    // Update the handleChange function to properly type the key and value
    const handleChange = (key: keyof Project, value: string | Date) => {
        setProject({ ...project, [key]: value });
    };

    const handleSubmit = () => {
        console.log("Project Submitted:", project);
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const labels = {
        project_Id: "Project ID",
        project_description: "Project Description",
        long_project_description: "Project Long Description",
        assigned_to: "Assign To",
        project_start_date: "Project Start Date",
        project_end_date: "Project End Date",
        contractor_phone: "Contractor Phone No.",
        completion_percentage: "Completion Percentage",
        status: "Status"
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}>
            <Text style={[styles.title, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>Add New Project</Text>

            {Object.keys(project).map((key) => {
                const currentValue = project[key as keyof Project];

                // For start and end date fields, show DatePicker
                if (key === "project_start_date" || key === "project_end_date") {
                    return (
                        <View key={key} style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                            <TouchableOpacity onPress={() => key === "project_start_date" ? setOpenStartDate(true) : setOpenEndDate(true)}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff', color: theme.mode === 'dark' ? '#fff' : '#000', borderColor: theme.mode === 'dark' ? '#555' : '#ccc' }]}
                                    value={currentValue instanceof Date ? formatDate(currentValue) : ""}
                                    editable={false}
                                />
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={key === "project_start_date" ? openStartDate : openEndDate}
                                date={currentValue instanceof Date ? currentValue : new Date()}
                                mode="date"
                                onConfirm={(date) => {
                                    handleChange(key as keyof Project, date);
                                    key === "project_start_date" ? setOpenStartDate(false) : setOpenEndDate(false);
                                }}
                                onCancel={() => key === "project_start_date" ? setOpenStartDate(false) : setOpenEndDate(false)}
                            />
                        </View>
                    );
                }

                // For completion_percentage dropdown
                if (key === "completion_percentage") {
                    return (
                        <View key={key} style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                            <View
                                style={[
                                    styles.pickerWrapper,
                                    {
                                        backgroundColor: theme.mode === 'dark' ? '#333' : '#fff',
                                        borderColor: theme.mode === 'dark' ? '#555' : '#ccc',
                                    },
                                ]}
                            >
                                <Picker
                                    selectedValue={currentValue}
                                    onValueChange={(value) => handleChange(key as keyof Project, value)}
                                    style={{
                                        color: theme.mode === 'dark' ? '#fff' : '#000',
                                    }}
                                    dropdownIconColor={theme.mode === 'dark' ? '#fff' : '#000'}
                                >

                                    <Picker.Item label="0%" value="0" />
                                    <Picker.Item label="10%" value="10" />
                                    <Picker.Item label="20%" value="20" />
                                    <Picker.Item label="30%" value="30" />
                                    <Picker.Item label="40%" value="40" />
                                    <Picker.Item label="50%" value="50" />
                                    <Picker.Item label="60%" value="60" />
                                    <Picker.Item label="70%" value="70" />
                                    <Picker.Item label="80%" value="80" />
                                    <Picker.Item label="90%" value="90" />
                                    <Picker.Item label="100%" value="100" />
                                </Picker>
                            </View>
                        </View>
                    );
                }

                // For status dropdown
                if (key === "status") {
                    return (
                        <View key={key} style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                            <View
                                style={[
                                    styles.pickerWrapper,
                                    {
                                        backgroundColor: theme.mode === 'dark' ? '#333' : '#fff',
                                        borderColor: theme.mode === 'dark' ? '#555' : '#ccc',
                                    },
                                ]}
                            >
                                <Picker
                                    selectedValue={currentValue}
                                    onValueChange={(value) => handleChange(key as keyof Project, value)}
                                    style={{
                                        color: theme.mode === 'dark' ? '#fff' : '#000',
                                    }}
                                    dropdownIconColor={theme.mode === 'dark' ? '#fff' : '#000'}
                                >
                                    <Picker.Item label="Yet to start" value="Yet to start" />
                                    <Picker.Item label="Active" value="Active" />
                                    <Picker.Item label="In-Progress" value="In-Progress" />
                                    <Picker.Item label="On-Hold" value="On-Hold" />
                                </Picker>
                            </View>
                        </View>
                    );
                }

                // For all other fields, just show a TextInput
                return (
                    <View key={key} style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff', color: theme.mode === 'dark' ? '#fff' : '#000', borderColor: theme.mode === 'dark' ? '#555' : '#ccc' }]}
                            value={typeof currentValue === "string" ? currentValue : ""}
                            onChangeText={(value) => handleChange(key as keyof Project, value)}
                            placeholder={`Enter ${labels[key as keyof Project]}`}
                            placeholderTextColor={theme.mode === 'dark' ? '#bbb' : '#888'}
                        />
                    </View>
                );
            })}

            <Button title="Submit" onPress={handleSubmit} color={theme.mode === 'dark' ? '#4CAF50' : '#000'} />
            <View style={styles.backButtonContainer}>
                <Button title="Back" onPress={handleBack} color={theme.mode === 'dark' ? '#FF5733' : '#555'} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: "center"
    },
    picker: {
        height: 40,  // Ensure Picker has enough height
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: "center",
        color: '#000'  // Explicitly set text color for Picker
    },
    backButtonContainer: {
        marginTop: 10,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
    },

});

export default AdminAddNewProjectScreen;
