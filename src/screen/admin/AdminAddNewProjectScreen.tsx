import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, Alert, SafeAreaView, Platform, StatusBar } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import { RootStackParamList } from "../../RootNavigator";
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../Header";

// Define the type for the project state
type Project = {
    project_Id: string;
    project_description: string;
    long_project_description: string;
    created_by: string;
    project_start_date: Date;
    project_end_date: string | Date; // Allow string ("--") or Date
    mobile: string;
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
        created_by: "",
        project_start_date: new Date(),
        project_end_date: "--", // Default "--"
        mobile: "",
        completion_percentage: "0",
        status: "Yet to start",
    });

    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    const handleChange = (key: keyof Project, value: string | Date) => {
        setProject({ ...project, [key]: value });
    };

    const handleSubmit = () => {
        const projectData = { ...project };

        // Format dates before sending
        projectData.project_start_date = project.project_start_date;
        projectData.project_end_date =
            project.project_end_date instanceof Date
                ? formatDate(project.project_end_date)
                : "--";

        axios.post("http://192.168.129.119:5001/create-project", projectData)
            .then(res => {
                if (res.data.status === "OK") {
                    Alert.alert(
                        "Success",
                        "Project created successfully. Would you like to allocate this project to a contractor?",
                        [
                            {
                                text: "No, later",
                                onPress: () => navigation.navigate("AdminHomeScreen"),
                                style: "cancel"
                            },
                            {
                                text: "Yes",
                                onPress: () => navigation.navigate("AdminAllocateProjectScreen")
                            }
                        ]
                    );
                } else {
                    Alert.alert("Project creation failed");
                }

            })
            .catch(e => {
                ToastAndroid.show("Error: " + e.message, ToastAndroid.SHORT);
            });
    };

    const labels = {
        project_Id: "Project ID",
        project_description: "Project Description",
        long_project_description: "Project Long Description",
        created_by: "Created By",
        project_start_date: "Project Start Date",
        project_end_date: "Project End Date",
        mobile: "Mobile No.",
        completion_percentage: "Completion Percentage",
        status: "Status"
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await axios.post('http://192.168.129.119:5001/userdata', { token });
                    if (response.data.status === "OK") {
                        const user = response.data.data;
                        const fullName = `${user.firstName} ${user.lastName}`;
                        const mobile = `${user.mobile}`;
                        setProject(prev => ({ ...prev, created_by: fullName, mobile: mobile }));
                    } else {
                        ToastAndroid.show('Failed to fetch user data', ToastAndroid.SHORT);
                    }
                } catch (error) {
                    ToastAndroid.show('Error fetching user data', ToastAndroid.SHORT);
                }
            }
        };
        fetchUserData();
    }, []);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <Header title="New Project" />

            <View style={{ flex: 1 }}>
                <ScrollView
                    style={[styles.container, { backgroundColor: theme.mode === 'dark' ? '#121212' : '#f8f8f8' }]}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {Object.keys(project).map((key) => {
                        const currentValue = project[key as keyof Project];

                        if (key === "created_by") {
                            return (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff', color: theme.mode === 'dark' ? '#fff' : '#000', borderColor: theme.mode === 'dark' ? '#555' : '#ccc' }]}
                                        value={currentValue?.toString()}
                                        editable={false}
                                    />
                                </View>
                            );
                        }

                        if (key === "project_start_date" || key === "project_end_date") {
                            const isStart = key === "project_start_date";
                            return (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                                    <TouchableOpacity onPress={() => isStart ? setOpenStartDate(true) : setOpenEndDate(true)}>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff', color: theme.mode === 'dark' ? '#fff' : '#000', borderColor: theme.mode === 'dark' ? '#555' : '#ccc' }]}
                                            value={currentValue instanceof Date ? formatDate(currentValue) : (currentValue === "--" ? "--" : "")}
                                            editable={false}
                                        />
                                    </TouchableOpacity>
                                    <DatePicker
                                        modal
                                        open={isStart ? openStartDate : openEndDate}
                                        date={currentValue instanceof Date ? currentValue : new Date()}
                                        mode="date"
                                        onConfirm={(date) => {
                                            handleChange(key as keyof Project, date);
                                            isStart ? setOpenStartDate(false) : setOpenEndDate(false);
                                        }}
                                        onCancel={() => isStart ? setOpenStartDate(false) : setOpenEndDate(false)}
                                    />
                                </View>
                            );
                        }

                        const percentageOptions = Array.from({ length: 101 }, (_, i) => i);

                        if (key === "completion_percentage") {
                            return (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                                    <View style={[styles.pickerWrapper, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}>
                                        <Picker
                                            selectedValue={currentValue}
                                            onValueChange={(value) => handleChange(key as keyof Project, value)}
                                            style={{ color: theme.mode === 'dark' ? '#fff' : '#000' }}
                                            dropdownIconColor={theme.mode === 'dark' ? '#fff' : '#000'}
                                        >
                                            {percentageOptions.map((percentage) => (
                                                <Picker.Item key={percentage} label={`${percentage}%`} value={percentage.toString()} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            );
                        }

                        if (key === "status") {
                            return (
                                <View key={key} style={styles.inputContainer}>
                                    <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                                    <View style={[styles.pickerWrapper, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff' }]}>
                                        <Picker
                                            selectedValue={currentValue}
                                            onValueChange={(value) => handleChange(key as keyof Project, value)}
                                            style={{ color: theme.mode === 'dark' ? '#fff' : '#000' }}
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

                        return (
                            <View key={key} style={styles.inputContainer}>
                                <Text style={[styles.label, { color: theme.mode === 'dark' ? '#fff' : '#000' }]}>{labels[key as keyof Project]}</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.mode === 'dark' ? '#333' : '#fff', color: theme.mode === 'dark' ? '#fff' : '#000', borderColor: theme.mode === 'dark' ? '#555' : '#ccc' }]}
                                    value={currentValue?.toString()}
                                    onChangeText={(text) => handleChange(key as keyof Project, text)}
                                />
                            </View>
                        );
                    })}


                </ScrollView>
            </View>
            {/* Fixed bottom button */}
            <View style={{ backgroundColor: theme.background, padding: 16 }}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleSubmit}
                >
                    <Text style={[styles.buttonText, { color: theme.buttonText }]}>Add</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
    },
    input: {
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 10,
        padding: 8,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default AdminAddNewProjectScreen;
